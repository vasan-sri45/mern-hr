import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js'; 
import Employee from "../models/employeeModel.js";
import generateToken from '../middleware/tokenGenerate.js';

export const createUser = async(req,res,next) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {empId, name, emailId, password, desigination} = req.body;
    
    if(!empId || !name || !emailId || !password || !desigination){
        return res.status(404).json({success: "false", message: "Missing Details..."});
    };

    if(!emailRegex.test(emailId)){
        return res.status(404).json({success: "false", message: "Invalid emailId..."});
    }

    try {
        const user = await Employee.findOne({emailId});
        if(user){
            return res.status(404).json({success: "false", message: "Employee already exists.."});
        }
        const employee = new Employee({
            empId, name, emailId, password, desigination
        });
        await employee.save();
        
        return res.status(201).json({success: "true", message: "Successfully Registered..."});
    } catch (error) {
        return res.status(404).json({success: "false", message: error.message});
    }

  }

export const employeeLogin = async (req, res) => {
  const { empId, password } = req.body;

  if (!empId || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    // 1. Find the user by their employee ID and include the password for comparison
    const user = await Employee.findOne({ empId }).select('+password');

    // 2. Check if user exists and if the password matches
    if (!user || !(await user.checkPassword(password))) {
      // Use a single, generic message for failed logins for security
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Use your standardized function to generate the token and set the cookie
    //    This automatically creates the payload as { userId: user._id }
    generateToken(res, user._id, user.role);

    // 4. Prepare a safe user object to send back (without the password)
    const safeUser = user.toObject();
    delete safeUser.password;

    // 5. Send a single, final success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser
    });

  } catch (error) {
    console.error("Login Error:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const employeeLogout = async (req, res, next) => {
    try {
         res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });
        return res.status(200).json({success: true, message: "Logged Out..."})
    } catch (error) {
        return res.status(404).json({success: "false", message: error.message});
    }
}


// export const forgotPassword = async (req, res) => {
//   const { emailId } = req.body;
//   if (!emailId) return res.status(400).json({ success: false, message: 'emailId required' });

//   const user = await Employee.findOne({ emailId });
//   // Always respond 200 to avoid user enumeration
//   if (!user) return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent' });

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
//   user.resetPasswordToken = tokenHash;
//   user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
//   await user.save({ validateBeforeSave: false });

//   const clientBase = process.env.CLIENT_URL || 'http://localhost:5173';
//   const link = `${clientBase}/reset-password/${resetToken}`;

//   try {
//     await sendEmail(user.emailId, 'Password reset', `Click to reset your password: ${link}`);
//     return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent' });
//   } catch (e) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return res.status(500).json({ success: false, message: 'Email failed' });
//   }
// };

// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   if (!token || !password) return res.status(400).json({ success: false, message: 'Invalid request' });

//   const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
//   const user = await Employee.findOne({
//     resetPasswordToken: tokenHash,
//     resetPasswordExpires: { $gt: Date.now() }
//   }).select('+password');

//   if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

//   user.password = password; // pre-save hook re-hashes
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   await user.save();

//   return res.status(200).json({ success: true, message: 'Password reset successful' });
// };

export const forgotPassword = async (req, res) => {
  const { emailId } = req.body;
  if (!emailId) return res.status(400).json({ success: false, message: 'emailId required' });

  const user = await Employee.findOne({ emailId });
  if (!user) return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const clientBase = process.env.CLIENT_URL || 'http://localhost:5173';
  const link = `${clientBase}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.emailId,
      subject: 'Password reset',
      text: `Reset your password: ${link}`,
      html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p>`
    });
    return res.status(200).json({ success: true, message: 'If that email exists, a reset link was sent' });
  } catch (e) {
  console.error('Email send error:', {
    message: e.message,
    code: e.code,
    command: e.command,
    response: e.response, // may be undefined depending on failure
  });
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });
  return res.status(500).json({ success: false, message: 'Email failed' });
}
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!token || !password) return res.status(400).json({ success: false, message: 'Invalid request' });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await Employee.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: Date.now() }
  }).select('+password');

  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

  user.password = password; // pre-save hook re-hashes
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).json({ success: true, message: 'Password reset successful' });
};