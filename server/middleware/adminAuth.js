// export const adminAuth = (req, res, next) => {
//   // This middleware should run AFTER your standard userAuth middleware
//   console.log(req.user)
//   if (req.user && req.user.role === 'admin') {
//     next(); // User is an admin, proceed
//   } else {
//     // User is not an admin or user info is missing
//     return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
//   }
// };

// middleware/adminAuth.js
export const adminAuth = (req, res, next) => {
  // Runs AFTER userAuth
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
};

