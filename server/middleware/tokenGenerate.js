
// import jwt from "jsonwebtoken";

// const generateToken = (res, userId, role) => { // <-- 1. Added 'role' parameter
//   // Ensure JWT_SECRET_KEY is defined in your environment variables
//   if (!process.env.JWT_SECRET_KEY) {
//     console.error("JWT_SECRET_KEY is not defined in environment variables.");
//     throw new Error("Server configuration error: JWT secret is missing.");
//   }

//   // Set token expiry (e.g., 10 days)
//   const expiresInSeconds = 10 * 24 * 60 * 60;

//   // --- 2. Create the payload with both userId and role ---
//   const payload = {
//     userId,
//     role, // The user's role (e.g., 'admin' or 'employee') is now in the token
//   };

//   // Create the JWT with the enhanced payload
//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: `${expiresInSeconds}s`,
//   });

//   // Set the cookie in the response (your existing logic is already excellent)
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: "strict",
//     maxAge: expiresInSeconds * 1000,
//   });
// };

// export default generateToken;

// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId, role) => {
//   if (!process.env.JWT_SECRET_KEY) {
//     throw new Error('Server configuration error: JWT secret is missing.');
//   }

//   // Access token ~10 days (consider 15m–1h for better security, plus refresh token)
//   const expiresInSeconds = 10 * 24 * 60 * 60;

//   // Standardized claims
//   const now = Math.floor(Date.now() / 1000);
//   const payload = {
//     sub: String(userId),   // subject = user identifier
//     role,                  // minimal authorization context
//     iat: now,              // issued at
//     // Optional hardening:
//     // iss: 'your-api',    // issuer
//     // aud: 'your-frontend'// audience
//   };

//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: expiresInSeconds, // seconds number is fine
//     // algorithm: 'HS256' // explicit if customizing (default HS256)
//   });

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',     // use 'lax' if cross-site navigation is required
//     maxAge: expiresInSeconds * 1000,
//     // Optional:
//     // path: '/', 
//     // domain: '.yourdomain.com'
//   });
// };

// export default generateToken;

// utils/generateToken.js
// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId, role) => {
//   if (!process.env.JWT_SECRET_KEY) {
//     throw new Error('Server configuration error: JWT secret is missing.');
//   }

//   const expiresInSeconds = 10 * 24 * 60 * 60; // 10 days

//   const now = Math.floor(Date.now() / 1000);
//   const payload = {
//     sub: String(userId), // subject
//     role,
//     iat: now
//     // Optional: iss, aud
//   };

//   const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
//     expiresIn: expiresInSeconds
//   });

//   res.cookie('token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//      path: '/',
//     maxAge: expiresInSeconds * 1000
//   });

//   return token;
// };

// export default generateToken;


import jwt from 'jsonwebtoken';

const generateToken = (res, userId, role) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('Server configuration error: JWT secret is missing.');
  }

  const expiresInSeconds = 10 * 24 * 60 * 60; // 10 days

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(userId), // subject
    role,
    iat: now
    // Optional: iss, aud
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresInSeconds
  });
  const isProd = process.env.NODE_ENV === 'production';
  const attrs = [
  'Path=/',
  'Secure',
  'SameSite=None',
  'Partitioned', // CHIPS
  `Max-Age=${10*24*60*60}`
].join('; ');
res.append('Set-Cookie', `token=${token}; ${attrs}`);

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure:   isProd,
     path: '/',
    maxAge: expiresInSeconds * 1000
  });

  return token;
};

export default generateToken;