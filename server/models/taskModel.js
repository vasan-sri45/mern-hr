// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'employees'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'in_progress', 'completed'],
//     default: 'pending'
//   },
//   documents: [
//     {
//       url: String,
//       publicId: String,
//       originalName: String,
//       mimetype: String
//     }
//   ],
//   checkList:{
//     type: String,
//     enum: ['not_approved', 'approved'],
//     default: 'not_approved'
//   },
//   rework:{
//     type: Boolean,
//     enum: ['not_approved', 'approved'],
//     default: false
//   }

// }, { timestamps: true });

// // Place this after schema definition, before model compilation
// taskSchema.index({ assignedTo: 1, createdAt: 1, status: 1, checkList: 1 });


// const taskModel = mongoose.model("Task", taskSchema);
// export default taskModel;


// models/taskModel.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employees',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    documents: [
      {
        url: String,
        publicId: String,
        originalName: String,
        mimetype: String
      }
    ],
    checkList: {
      type: String,
      enum: ['not_approved', 'approved'],
      default: 'not_approved'
    },
    // Keep rework as pure boolean without enum strings
    rework: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Compound index to accelerate monthly stats query patterns
taskSchema.index({ assignedTo: 1, createdAt: 1, status: 1, checkList: 1 });

const taskModel = mongoose.model('Task', taskSchema);
export default taskModel;
