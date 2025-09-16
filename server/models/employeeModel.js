// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const employeeSchema = new mongoose.Schema({
//     empId:{type: String, required: true, unique: true},
//     name:{type: String, required: true},
//     emailId:{type: String, required: true, unique: true},
//     password:{type: String, required:true},
//     desigination:{type: String, required:true},
//     role: {
//     type: String,
//     enum: ['admin', 'employee'],
//     default: 'employee'
//   },
//   resetPasswordToken:String,
//   resetPasswordExpires:Date
// });

// employeeSchema.pre('save',async function(next){
//     if(!this.isModified('password')){
//         next();
//     }
//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// employeeSchema.methods.checkPassword = async function(givenPassword){
//     return await bcrypt.compare(givenPassword, this.password);
// };


// const employeeModel = mongoose.models.employees || mongoose.model('employees', employeeSchema);
// export default employeeModel;

// models/employeeModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema(
  {
    empId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    desigination: { type: String, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

employeeSchema.methods.checkPassword = async function (givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
};

const employeeModel = mongoose.models.employees || mongoose.model('employees', employeeSchema);
export default employeeModel;
