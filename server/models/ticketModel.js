// import mongoose from 'mongoose';
// import Counter from './counterModel.js'; // Import the Counter model

// const ticketSchema = new mongoose.Schema({
//   ticketNo: {
//     type: String,
//     unique: true // Ensures each ticket has a unique number
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'employees', // References your User model
//     required: true
//   },
//   department: {
//     type: String,
//     required: [true, 'Department is required.']
//   },
//   requestType: {
//     type: String,
//     required: [true, 'Request type is required.']
//   },
//   date: {
//     type: Date,
//     required: true
//   },
//   remark: {
//     type: String,
//     required: [true, 'Remark is required.']
//   },
//   status: {
//     type: String,
//     enum: ['Open', 'In Progress', 'Resolved', 'Closed'], // Defines allowed statuses
//     default: 'Open'
//   }
// }, { timestamps: true }); // Adds createdAt and updatedAt fields

// // Pre-save hook to generate auto-incrementing ticket number
// ticketSchema.pre('save', async function(next) {
//   if (this.isNew) { // Only run for new documents
//     try {
//       const counter = await Counter.findByIdAndUpdate(
//         { _id: 'ticketNo' }, // Identifier for this specific counter
//         { $inc: { sequence_value: 1 } }, // Increment the sequence value
//         { new: true, upsert: true } // Return the updated document; create if not exists
//       );
//       // Format the ticket number (e.g., "0001", "0002")
//       this.ticketNo = counter.sequence_value.toString().padStart(4, '0');
//       next();
//     } catch (error) {
//       next(error); // Pass any errors to the next middleware
//     }
//   } else {
//     next(); // For existing documents, proceed without modification
//   }
// });

// const Ticket = mongoose.model('Ticket', ticketSchema);

// export default Ticket;

import mongoose from 'mongoose';
import Counter from './counterModel.js';

const ticketSchema = new mongoose.Schema({
  ticketNo: { type: String, unique: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true, index: true },
  department: { type: String, required: [true, 'Department is required.'], trim: true },
  requestType: { type: String, required: [true, 'Request type is required.'], trim: true },
  date: { type: Date, required: true },
  remark: { type: String, required: [true, 'Remark is required.'], trim: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open', index: true }
}, { timestamps: true });

// Helpful read indexes
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ createdBy: 1, createdAt: -1 });

// Auto-increment ticketNo (atomic via separate Counter collection)
ticketSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ticketNo' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    this.ticketNo = counter.sequence_value.toString().padStart(4, '0');
    next();
  } catch (err) {
    next(err);
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

