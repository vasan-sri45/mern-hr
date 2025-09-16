import Employee from '../models/employeeModel.js';
import Task from '../models/taskModel.js';

export const getUserData = async (req, res) => {
  try {
    // The userId is securely attached by the userAuth middleware.
    // There's no need to get it from req.params or req.body.
    const userId = req.userId;

    // Find the user but exclude the password field for security.
    // The .select('-password') projection tells MongoDB not to include that field.
    const user = await Employee.findById(userId).select('-password');

    if (!user) {
      // Use a 404 status code if the resource (user) is not found.
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Success: return a 200 OK status with the user data.
    // Using boolean `true` for success is standard practice.
    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Error in getUserData:", error); // Log the actual error for debugging
    // Use a 500 status code for unexpected server errors.
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getEmployees = async (req, res, next) => {
  try {
    // Pass userId in body, or use auth system to get req.user.id

    // Find the admin user
    const admin = await Employee.findById(req.userId);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin user not found." });
    }

    if (admin.role === 'admin') {
      const employees = await Employee.find({ role: { $ne: "admin" } });
      return res.status(200).json({ success: true, employees });
    } else {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getEmployeeTasks = async(req, res, next) =>{
    try {
        const id = req.body.userId;
        
        const task = await Task.find({assignedTo:id});
        if(!task){
            return res.status(404).json({success: false, message: "tasks are not found."});
        }
        return res.status(200).json({success: true, task});
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}