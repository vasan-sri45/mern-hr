import mongoose from 'mongoose';

// Optional: derived dayKey (YYYY-MM-DD) for uniqueness per day
const attendanceSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees', // match the model name
    required: true,
    index: true
  },
  punchInTime: { type: Date, required: true },
  punchOutTime: { type: Date, default: null },
  dayKey: { type: String, required: true, index: true } // '2025-08-25'
}, { timestamps: true });

// Enforce at most one punch-in per employee per day
attendanceSchema.index({ employee_id: 1, dayKey: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
