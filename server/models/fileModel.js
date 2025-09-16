import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
   image:String
}, { timestamps: true });

const fileModel = mongoose.model("File", fileSchema);
export default fileModel;
