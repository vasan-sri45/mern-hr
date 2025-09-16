// import jwt from 'jsonwebtoken';

// const userAuth = (req, res, next) => {
//   if (!process.env.JWT_SECRET_KEY) {
//     // Do not continue without a secret; treat as server misconfig
//     return res.status(500).json({ success: false, message: 'Server authentication error.' });
//   }

//   // Prefer Authorization header, fall back to cookie
//   let token;
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
//     token = authHeader.substring(7);
//   } else {
//     token = req.cookies?.token;
//   }

//   if (!token) {
//     // 401: no credentials presented
//     return res.status(401).json({ success: false, message: 'Not authorized: no token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     // Support both payload styles: { sub, role } and { userId, role }
//     const userId = decoded.sub || decoded.userId;
//     const role = decoded.role;

//     if (!userId) {
//       // Signed token but missing subject/user id => treat as unauthorized payload
//       return res.status(403).json({ success: false, message: 'Not authorized: invalid token payload.' });
//     }

//     // Attach to request
//     req.user = decoded;        // full claims for auditing/logging (avoid exposing in responses)
//     req.userId = String(userId);
//     if (role) req.role = role;

//     return next();
//   } catch (error) {
//     // Normalize common JWT errors
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ success: false, message: 'Not authorized: token expired.' });
//     }
//     if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
//       // Invalid signature, malformed, or used before nbf
//       return res.status(403).json({ success: false, message: 'Not authorized: invalid token.' });
//     }
//     return res.status(500).json({ success: false, message: 'Authentication error.' });
//   }
// };

// export default userAuth;

// middleware/userAuth.js
import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({ success: false, message: 'Server authentication error.' });
  }

  // Prefer Authorization: Bearer <token>, fallback to cookie 'token'
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies?.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized: no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.sub || decoded.userId || decoded.id || decoded._id;
    if (!userId) {
      return res.status(403).json({ success: false, message: 'Not authorized: invalid token payload.' });
    }

    req.user = decoded;
    req.userId = String(userId);
    if (decoded.role) req.role = decoded.role;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Not authorized: token expired.' });
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(403).json({ success: false, message: 'Not authorized: invalid token.' });
    }
    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

export default userAuth;
