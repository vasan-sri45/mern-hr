// controllers/taskController.js
import mongoose from 'mongoose';
import { cloudinary, uploadToCloudinary } from '../helpers/cloudinary.js';
import taskModel from '../models/taskModel.js';
import employeeModel from '../models/employeeModel.js';

// POST /api/tasks
export const taskCreated = async (req, res) => {
  const { title, description, assignedTo, status = 'pending' } = req.body;

  try {
    const admin = await employeeModel.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'admin only access to the task manager' });
    }

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ success: false, message: 'Missing details...' });
    }

    const employee = await employeeModel.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ success: false, message: 'Invalid employee ID' });
    }

    // Upload 0..N documents
    const documents = [];
    const files = req.files?.document || [];
    if (Array.isArray(files) && files.length > 0) {
      // Parallelize uploads for speed; bounded by Multer limits/files
      const results = await Promise.all(
        files.map((doc) => uploadToCloudinary(doc.buffer, { filename_override: doc.originalname }))
      );
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const doc = files[i];
        documents.push({
          url: r.secure_url,
          publicId: r.public_id,
          originalName: doc.originalname,
          mimetype: doc.mimetype,
          bytes: r.bytes,
          format: r.format,
          resourceType: r.resource_type,
        });
      }
    }

    const task = await taskModel.create({
      title,
      description,
      assignedTo,
      status,
      documents,
    });

    return res.status(201).json({ success: true, message: 'Successfully created task', task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tasks
export const getTask = async (req, res) => {
  try {
    const admin = await employeeModel.findById(req.userId);
    if (admin) {
      const tasks = await taskModel.find({}).populate('assignedTo', 'name empId');
      return res.status(200).json({ success: true, tasks });
    }
    return res.status(403).json({ success: false, message: 'admins only access to the task manager' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Optionally replace or append documents
    // If frontend sends a flag replaceDocuments=true, we replace; else we append
    const replace = req.body.replaceDocuments === 'true' || req.body.replaceDocuments === true;

    const newDocs = [];
    const files = req.files?.document || (req.file ? [req.file] : []);
    if (Array.isArray(files) && files.length > 0) {
      const results = await Promise.all(
        files.map((f) => uploadToCloudinary(f.buffer, { filename_override: f.originalname }))
      );
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const f = files[i];
        newDocs.push({
          url: r.secure_url,
          publicId: r.public_id,
          originalName: f.originalname,
          mimetype: f.mimetype,
          bytes: r.bytes,
          format: r.format,
          resourceType: r.resource_type,
        });
      }
    }

    // If replacing, delete old assets from Cloudinary
    if (replace && task.documents?.length) {
      await Promise.all(
        task.documents.map((d) => cloudinary.uploader.destroy(d.publicId, { invalidate: true }))
      );
      task.documents = [];
    }

    if (newDocs.length) {
      task.documents = (task.documents || []).concat(newDocs);
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.checkList !== undefined) task.checkList = req.body.checkList;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.rework !== undefined) task.rework = req.body.rework;
    await task.save();
    return res.status(200).json({ success: true, task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    // Delete all linked Cloudinary documents
    if (task.documents?.length) {
      await Promise.all(
        task.documents.map((d) => cloudinary.uploader.destroy(d.publicId, { invalidate: true }))
      );
    }

    await taskModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tasks/task/count?month=YYYY-MM
export const getMonthlyTaskStats = async (req, res) => {
  console.log(req.userId)
  try {
    // Defensive guard: if auth not wired, fail gracefully
    
    if (!req || !req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify admin
    const admin = await employeeModel.findById(req.userId, 'role');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'admins only access to the task manager' });
    }

    // Parse month boundary; default to current month
    const monthStr = String(req.query.month || '').trim();
    const now = new Date();
    const [y, m] =
      monthStr && /^\d{4}-\d{2}$/.test(monthStr)
        ? [Number(monthStr.slice(0, 4)), Number(monthStr.slice(5, 7))]
        : [now.getFullYear(), now.getMonth() + 1];

    // Month UTC boundaries
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));

    const pipeline = [
      // 1) Filter to the month
      { $match: { createdAt: { $gte: start, $lt: end } } },
      // 2) Aggregate per employee with conditional counters
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          approvedTasks: { $sum: { $cond: [{ $eq: ['$checkList', 'approved'] }, 1, 0] } }
        }
      },
      // 3) Join employee basics for display
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      // 4) Shape response
      {
        $project: {
          _id: 0,
          employeeId: '$_id',
          name: '$employee.name',
          empId: '$employee.empId',
          totalTasks: 1,
          completedTasks: 1,
          approvedTasks: 1
        }
      },
      // 5) Stable order
      { $sort: { name: 1, empId: 1 } }
    ];

    const stats = await taskModel.aggregate(pipeline);
    return res.status(200).json({
      success: true,
      month: `${y}-${String(m).padStart(2, '0')}`,
      stats
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/taskStatsController.js

// Helpers
const parseMonthRange = (monthStr) => {
  const now = new Date();
  const [y, m] =
    monthStr && /^\d{4}-\d{2}$/.test(monthStr)
      ? [Number(monthStr.slice(0, 4)), Number(monthStr.slice(5, 7))]
      : [now.getFullYear(), now.getMonth() + 1];
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
  return { y, m, start, end };
};

// GET /api/tasks/task/stats/employee/:employeeId?month=YYYY-MM&limit=10&page=1  (admin only)
export const getEmployeeMonthlyReport = async (req, res) => {
  try {
    if (!req || !req.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Admin gate
    const admin = await employeeModel.findById(req.userId, 'role');
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'admins only access to the task manager' });
    }

    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ success: false, message: 'Invalid employeeId' });
    }

    const { start, end, y, m } = parseMonthRange(String(req.query.month || '').trim());
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const baseMatch = {
      assignedTo: new mongoose.Types.ObjectId(employeeId),
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
                pendingTasks: {
                  $sum: {
                    $cond: [{ $in: ['$status', ['pending', 'in_progress']] }, 1, 0]
                  }
                },
                approvedTasks: { $sum: { $cond: [{ $eq: ['$checkList', 'approved'] }, 1, 0] } }
              }
            },
            {
              $project: {
                _id: 0,
                totalTasks: 1,
                completedTasks: 1,
                pendingTasks: 1,
                approvedTasks: 1
              }
            }
          ],
          tasks: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                status: 1,
                checkList: 1,
                createdAt: 1
              }
            }
          ],
          totalRows: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const result = await taskModel.aggregate(pipeline);
    const first = result || {};
    const summary = (first.summary && first.summary) || {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      approvedTasks: 0
    };
    const rows = first.tasks || [];
    const totalRows = (first.totalRows && first.totalRows?.count) || 0;

    return res.status(200).json({
      success: true,
      month: `${y}-${String(m).padStart(2, '0')}`,
      employeeId,
      summary,
      page,
      limit,
      totalRows,
      tasks: rows
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/tasks/task/stats/me?month=YYYY-MM&limit=10&page=1  (employee or admin)
// export const getMyMonthlyReport = async (req, res) => {
//   try {
//     if (!req || !req.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

//     const { start, end, y, m } = parseMonthRange(String(req.query.month || '').trim());
//     const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
//     const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
//     const skip = (page - 1) * limit;

//     const baseMatch = {
//       assignedTo: new mongoose.Types.ObjectId(req.userId),
//       createdAt: { $gte: start, $lt: end }
//     };

//     const pipeline = [
//       { $match: baseMatch },
//       {
//         $facet: {
//           summary: [
//             {
//               $group: {
//                 _id: null,
//                 totalTasks: { $sum: 1 },
//                 completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
//                 pendingTasks: {
//                   $sum: {
//                     $cond: [{ $in: ['$status', ['pending', 'in_progress']] }, 1, 0]
//                   }
//                 },
//                 approvedTasks: { $sum: { $cond: [{ $eq: ['$checkList', 'approved'] }, 1, 0] } }
//               }
//             },
//             { $project: { _id: 0, totalTasks: 1, completedTasks: 1, pendingTasks: 1, approvedTasks: 1 } }
//           ],
//           tasks: [
//             { $sort: { createdAt: -1 } },
//             { $skip: skip },
//             { $limit: limit },
//             { $project: { _id: 1, title: 1, description: 1, status: 1, checkList: 1, createdAt: 1 } }
//           ],
//           totalRows: [{ $count: 'count' }]
//         }
//       }
//     ];

//     // const result = await taskModel.aggregate(pipeline);
//     // const first = result || {};
//     // const summary = (first.summary && first.summary) || {
//     //   totalTasks: 0,
//     //   completedTasks: 0,
//     //   pendingTasks: 0,
//     //   approvedTasks: 0
//     // };
//     // const rows = first.tasks || [];
//     // const totalRows = (first.totalRows && first.totalRows?.count) || 0;

//     // return res.status(200).json({
//     //   success: true,
//     //   month: `${y}-${String(m).padStart(2, '0')}`,
//     //   employeeId: req.userId,
//     //   summary,
//     //   page,
//     //   limit,
//     //   totalRows,
//     //   tasks: rows
//     // });

//     const result = await taskModel.aggregate(pipeline);
// const first = result || { summary: [], tasks: [], totalRows: [] }; // aggregate() returns an array
// const summary =
//   first.summary?. || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, approvedTasks: 0 };
// const rows = first.tasks || [];
// const totalRows = first.totalRows?.?.count ?? 0;

// return res.status(200).json({
//   success: true,
//   month: `${y}-${String(m).padStart(2, '0')}`,
//   employeeId: req.userId,
//   summary,
//   page,
//   limit,
//   totalRows,
//   tasks: rows
// });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };


export const getMyMonthlyReport = async (req, res) => {
  try {
    if (!req || !req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { start, end, y, m } = parseMonthRange(String(req.query.month || '').trim());
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const baseMatch = {
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
                pendingTasks: { $sum: { $cond: [{ $in: ['$status', ['pending', 'in_progress']] }, 1, 0] } },
                approvedTasks: { $sum: { $cond: [{ $eq: ['$checkList', 'approved'] }, 1, 0] } }
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

    const result = await taskModel.aggregate(pipeline); // aggregate() returns an array of docs. [5]
    const first = result || { summary: [], tasks: [], totalRows: [] }; // Use result?. to safely get the first doc. [1][5]
    const summary = first.summary || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, approvedTasks: 0 }; // $facet branches are arrays. [3][1]
    const rows = first.tasks || []; // Tasks branch is already an array. [3]
    const totalRows = first.totalRows?.count ?? 0; // $count outputs [{count:N}] so index . [4][1]

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
    return res.status(500).json({ success: false, message: err.message });
  }
};
