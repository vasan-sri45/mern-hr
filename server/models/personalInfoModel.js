import mongoose from 'mongoose';
import validator from 'validator';

const PersonalInfoSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employees', // Use model name for populate
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required.']
  },
  parentName: {
    type: String,
    required: [true, "Father/Mother/Guardian's Name is required."],
    trim: true
  },
  emergencyContactPerson: {
    type: String,
    required: [true, 'Emergency Contact Person is required.'],
    trim: true
  },
  emergencyContactNumber: {
    type: String,
    required: [true, 'Emergency Contact Number is required.'],
    trim: true,
    validate: {
      validator(v) {
        // Accept international formats; adjust locale if needed (e.g., 'en-IN')
        return validator.isMobilePhone(String(v), 'any', { strictMode: false });
      },
      message: (props) => `${props.value} is not a valid emergency contact number.`
    }
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required.'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required.'],
    trim: true
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar Number is required.'],
    unique: true,
    trim: true
    // Optionally enforce 12 digits:
    // validate: {
    //   validator: v => /^\d{12}$/.test(v),
    //   message: props => `${props.value} is not a valid Aadhar Number! It must be 12 digits.`
    // }
  },
  panNumber: {
    type: String,
    required: [true, 'PAN Number is required.'],
    unique: true,
    trim: true,
    validate: {
      validator(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(v));
      },
      message: (props) => `${props.value} is not a valid PAN Number! It must follow the format ABCDE1234F.`
    }
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank Account Number is required.'],
    trim: true
  },
  bankName: {
    type: String,
    required: [true, 'Bank Name is required.'],
    trim: true
  },
  bankBranch: {
    type: String,
    required: [true, 'Bank Branch is required.'],
    trim: true
  },
  uanNumber: {
    type: String,
    required: [true, 'UAN Number is required.'],
    unique: true,
    trim: true
    // Optionally enforce 12 digits:
    // validate: {
    //   validator: v => /^\d{12}$/.test(v),
    //   message: props => `${props.value} is not a valid UAN Number! It must be 12 digits.`
    // }
  }
}, { timestamps: true });

PersonalInfoSchema.index({ employee_id: 1 }, { unique: true });

const PersonalInfo = mongoose.model('PersonalInfo', PersonalInfoSchema);
export default PersonalInfo;
