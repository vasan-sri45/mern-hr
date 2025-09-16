import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  title: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees'
  },
  documents: [
    {
      url: String,
      publicId: String,
      originalName: String,
      mimetype: String
    }
  ]
}, { timestamps: true });

const folderModel = mongoose.model("Folder", folderSchema);
export default folderModel;


