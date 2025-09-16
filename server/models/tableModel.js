import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  heading: { type: String, trim: true, minlength: 1 },
  title: { type: String, required: [true, 'A title is required.'], trim: true, minlength: 1 },
  description: { type: String, trim: true },
  content: { type: String, trim: true },
  checkList: { type: Boolean, default: false },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees',           // use the model name
    required: [true, 'An employee ID is required.'],
    index: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees'            // use the model name
  }
}, { timestamps: true });

// helpful indexes
tableSchema.index({ createdAt: -1 });
tableSchema.index({ heading: 1, createdAt: -1 }); // optional if you filter by heading often

const Table = mongoose.model('Table', tableSchema);
export default Table;
