import Attendance from '../models/attendenceModel.js';
import Employee from '../models/employeeModel.js';
import { startEndOfDayUTC } from '../utils/date.js';

// Punch In: atomic upsert prevents races
export const punchIn = async (req, res) => {
  try {
    const employee_id = req.userId;
    if (!employee_id) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { start, end, dayKey } = startEndOfDayUTC(new Date());

    // Try to insert a new attendance if not exists today
    const now = new Date();
    const doc = await Attendance.findOneAndUpdate(
      { employee_id, dayKey },
      {
        $setOnInsert: {
          employee_id,
          dayKey,
          punchInTime: now,
          punchOutTime: null
        }
      },
      { upsert: true, new: true }
    );

    // If it already existed and has a punchInTime, report conflict
    // Detect conflict when matched existing doc without insertion:
    // If punchOutTime is null and punchInTime exists, they're already punched in.
    // Unique index ensures only one per day.
    if (doc.punchInTime && doc.punchInTime < now && doc.punchOutTime === null) {
      // But if this call inserted (first time), it's fine—return 201.
      const createdNow = Math.abs(doc.punchInTime.getTime() - now.getTime()) < 1500;
      if (!createdNow) {
        return res.status(409).json({
          success: false,
          message: `Already punched in today at ${doc.punchInTime.toLocaleTimeString()}`
        });
      }
    }

    const isNew = doc.punchInTime && Math.abs(doc.punchInTime.getTime() - now.getTime()) < 1500;
    return res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Punch-in recorded successfully.' : 'Already punched in today.',
      data: doc
    });
  } catch (err) {
    // Handle unique index races cleanly
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: 'Already punched in today.' });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const punchOut = async (req, res) => {
  try {
    const employee_id = req.userId;
    if (!employee_id) return res.status(401).json({ success: false, message: 'Not authorized' });

    const { start, end, dayKey } = startEndOfDayUTC(new Date());

    // Only update open record for today
    const updated = await Attendance.findOneAndUpdate(
      {
        employee_id,
        dayKey,
        punchInTime: { $gte: start, $lte: end },
        punchOutTime: null
      },
      { $set: { punchOutTime: new Date() } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'No active punch-in found for today.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Punch-out recorded successfully.',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const query = {};
    const isAdmin = req.user?.role === 'admin';

    if (!isAdmin) {
      query.employee_id = req.userId;
    } else if (req.query.employeeId) {
      query.employee_id = req.query.employeeId;
    }

    // Optional date range filters; interpret as UTC boundaries
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.punchInTime = { $gte: start, $lte: end };
    }

    const [records, totalRecords] = await Promise.all([
      Attendance.find(query)
        .populate('employee_id', 'name email empId')
        .sort({ punchInTime: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTodaysAttendance = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized.' });
    }
    const { start, end, dayKey } = startEndOfDayUTC(new Date());
    const attendance = await Attendance.findOne({
      employee_id: userId,
      punchInTime: { $gte: start, $lte: end }
    });
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No attendance record found for today.' });
    }
    return res.status(200).json({ success: true, attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide both a start and end date.' });
    }

    const records = await Attendance.find({
      employee_id: userId,
      punchInTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).sort({ punchInTime: -1 });

    const historyWithHours = records.map((record) => {
      let workingHours = 'In Progress';
      if (record.punchInTime && record.punchOutTime) {
        const diffMs = new Date(record.punchOutTime) - new Date(record.punchInTime);
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        workingHours = `${hours}h ${minutes}m`;
      } else if (!record.punchInTime) {
        workingHours = 'N/A';
      }
      return { ...record.toObject(), workingHours };
    });

    return res.status(200).json({ success: true, data: historyWithHours });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMonthlyAttendanceStats = async (req, res) => {
  try {
    const requesterId = req.userId;
    const isAdmin = req.user?.role === 'admin';
    let targetEmployeeId = requesterId;

    // If admin and employeeId is provided in query, target that employee
    if (isAdmin && req.query.employeeId) {
      targetEmployeeId = req.query.employeeId;
    }

    // Determine the month to query (format: YYYY-MM)
    const monthQuery = req.query.month; // e.g., "2025-09"
    const targetDate = monthQuery ? new Date(monthQuery + '-01T12:00:00Z') : new Date();
    
    // Calculate start and end of the target month in UTC
    const startOfMonth = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0, 23, 59, 59));

    // Fetch all attendance records for the employee within the month
    const records = await Attendance.find({
      employee_id: targetEmployeeId,
      punchInTime: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ punchInTime: 'asc' });

    let totalWorkingMs = 0;
    records.forEach(rec => {
      if (rec.punchInTime && rec.punchOutTime) {
        totalWorkingMs += new Date(rec.punchOutTime) - new Date(rec.punchInTime);
      }
    });

    // Convert total milliseconds to hours and minutes
    const totalHours = Math.floor(totalWorkingMs / 3600000);
    const totalMinutes = Math.floor((totalWorkingMs % 3600000) / 60000);
    const formattedTotalWorkTime = `${totalHours}h ${totalMinutes}m`;

    // Calculate total weekdays in the month (Mon-Fri)
    let totalWeekdays = 0;
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        if (dayOfWeek > 0 && dayOfWeek < 6) {
            totalWeekdays++;
        }
    }
    
    const presentDays = records.length;
    const absentDays = totalWeekdays - presentDays;

    return res.status(200).json({
      success: true,
      data: {
        month: startOfMonth.toISOString().slice(0, 7), // YYYY-MM
        totalWorkingDays: presentDays,
        totalAbsentDays: Math.max(0, absentDays), // Ensure non-negative
        totalWorkingHours: formattedTotalWorkTime,
        attendanceRecords: records,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMonthlyReportForAllEmployees = async (req, res) => {
  // Security check: Ensure user is an admin
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }

  try {
    const monthQuery = req.query.month; // e.g., "2025-09"
    const targetDate = monthQuery ? new Date(monthQuery + '-01T12:00:00Z') : new Date();

    const startOfMonth = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 0, 23, 59, 59));

    // 1. Fetch all employees to get their names and IDs
    const allEmployees = await Employee.find({}, '_id name');

    // 2. Fetch all attendance records for the month
    const attendanceRecords = await Attendance.find({
      punchInTime: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // 3. Group attendance records by employee ID for efficient lookup
    const recordsByEmployee = new Map();
    attendanceRecords.forEach(record => {
      const empId = record.employee_id.toString();
      if (!recordsByEmployee.has(empId)) {
        recordsByEmployee.set(empId, []);
      }
      recordsByEmployee.get(empId).push(record);
    });

    // 4. Calculate total weekdays in the month
    let totalWeekdays = 0;
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getUTCDay();
      if (dayOfWeek > 0 && dayOfWeek < 6) { // Monday to Friday
        totalWeekdays++;
      }
    }

    // 5. Process data for each employee
    const report = allEmployees.map(employee => {
      const empId = employee._id.toString();
      const employeeRecords = recordsByEmployee.get(empId) || [];
      const presentDays = employeeRecords.length;
      const absentDays = totalWeekdays - presentDays;

      let totalWorkingMs = 0;
      employeeRecords.forEach(rec => {
        if (rec.punchInTime && rec.punchOutTime) {
          totalWorkingMs += new Date(rec.punchOutTime) - new Date(rec.punchInTime);
        }
      });

      const totalHours = Math.floor(totalWorkingMs / 3600000);
      const totalMinutes = Math.floor((totalWorkingMs % 3600000) / 60000);
      const formattedTotalWorkTime = `${totalHours}h ${totalMinutes}m`;

      return {
        employeeId: empId,
        employeeName: employee.name,
        presentDays,
        absentDays: Math.max(0, absentDays),
        totalHours: formattedTotalWorkTime,
      };
    });

    res.status(200).json({ success: true, data: report });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};