import employeeModel from "../models/employeeModel.js";
import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";
// GET /api/tasks/task/stats/overview?month=YYYY-MM   (admin only)
export const getMonthlyOverviewAllEmployees = async (req, res) => {
  try {
    if (!req || !req.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const admin = await employeeModel.findById(req.userId, 'role');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'admins only access to the task manager' });
    }

    const monthStr = String(req.query.month || '').trim();
    const now = new Date();
    const [y, m] = monthStr && /^\d{4}-\d{2}$/.test(monthStr)
      ? [Number(monthStr.slice(0, 4)), Number(monthStr.slice(5, 7))]
      : [now.getUTCFullYear(), now.getUTCMonth() + 1];

    // UTC month boundaries
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const end   = new Date(Date.UTC(y, m,     1, 0, 0, 0, 0));

    const pipeline = [
      { $match: { createdAt: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          notCompleted: { $sum: { $cond: [{ $in: ['$status', ['pending','in_progress']] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: employeeModel.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          empId: '$employee.empId',
          name: '$employee.name',
          totalTasks: 1,
          completed: 1,
          notCompleted: 1
        }
      },
      { $sort: { name: 1, empId: 1 } }
    ];

    const stats = await taskModel.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      month: `${y}-${String(m).padStart(2, '0')}`,
      stats
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyMonthlyReport = async (req, res) => {
  try {
    if (!req || !req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const monthStr = String(req.query.month || '').trim();
    const now = new Date();
    const [y, m] = monthStr && /^\d{4}-\d{2}$/.test(monthStr)
      ? [Number(monthStr.slice(0, 4)), Number(monthStr.slice(5, 7))]
      : [now.getUTCFullYear(), now.getUTCMonth() + 1];

    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const end   = new Date(Date.UTC(y, m,     1, 0, 0, 0, 0));

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const baseMatch = {
      // FIX: Correctly cast the userId to an ObjectId
      assignedTo: new mongoose.Types.ObjectId(req.userId),
      createdAt: { $gte: start, $lt: end }
    };

    const pipeline = [
      { $match: baseMatch },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                pendingTasks:   { $sum: { $cond: [{ $in: ['$status', ['pending','in_progress']] }, 1, 0] } },
                approvedTasks:  { $sum: { $cond: [{ $eq: ['$checkList', 'approved'] }, 1, 0] } }
              }
            },
            { $project: { _id: 0, totalTasks: 1, completedTasks: 1, pendingTasks: 1, approvedTasks: 1 } }
          ],
          tasks: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { _id: 1, title: 1, description: 1, status: 1, checkList: 1, createdAt: 1 } }
          ],
          totalRows: [{ $count: 'count' }]
        }
      }
    ];

    const result = await taskModel.aggregate(pipeline);

    // This logic is correct, but was receiving no data due to the bad filter.
    const first = result[0] || { summary: [], tasks: [], totalRows: [] };
    const summary = first.summary[0] || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, approvedTasks: 0 };
    const rows = first.tasks || [];
    const totalRows = first.totalRows[0]?.count || 0;

    return res.status(200).json({
      success: true,
      month: `${y}-${String(m).padStart(2, '0')}`,
      employeeId: req.userId,
      summary,
      page,
      limit,
      totalRows,
      tasks: rows
    });

  } catch (err) {
    console.error("Error generating monthly report:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};