// import React, { useState, useEffect } from 'react';
// import { User, Lock, Eye, EyeOff } from 'lucide-react';
// import { useSelector, useDispatch} from 'react-redux';
// import {useNavigate} from 'react-router-dom'
// import {reset, login} from '../store/slices/authSlice';

// function App() {
//   const [empId, setEmpId] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [stars, setStars] = useState([]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, isSuccess } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Generate random stars
//     const generateStars = () => {
//       const newStars = [];
//       for (let i = 0; i < 50; i++) {
//         newStars.push({
//           id: i,
//           x: Math.random() * 100,
//           y: Math.random() * 100,
//           size: Math.random() * 3 + 1,
//           opacity: Math.random() * 0.8 + 0.2,
//           animationDelay: Math.random() * 3,
//         });
//       }
//       setStars(newStars);
//     };

//     generateStars();
//   }, []);

//   useEffect(() => {
//   if (isSuccess && user) {
//     navigate('/'); // or '/home' or whatever your home page route is
//     dispatch(reset()); // optionally reset auth state
//   }  
// }, [isSuccess, user, navigate, dispatch]);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     console.log('Login attempt:', { empId, password, rememberMe });
//     dispatch(login({ empId, password}));
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
//       {/* Animated Stars */}
//       <div className="absolute inset-0">
//         {stars.map((star) => (
//           <div
//             key={star.id}
//             className="absolute rounded-full bg-white animate-pulse"
//             style={{
//               left: `${star.x}%`,
//               top: `${star.y}%`,
//               width: `${star.size}px`,
//               height: `${star.size}px`,
//               opacity: star.opacity,
//               animationDelay: `${star.animationDelay}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Mountain Silhouettes */}
//       <div className="absolute bottom-0 left-0 right-0">
//         {/* Back mountains */}
//         <svg
//           className="absolute bottom-0 w-full h-64 text-purple-900/40"
//           viewBox="0 0 1200 320"
//           preserveAspectRatio="none"
//         >
//           <path
//             fill="currentColor"
//             d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7L1200,96L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//           />
//         </svg>

//         {/* Front mountains */}
//         <svg
//           className="absolute bottom-0 w-full h-48 text-purple-900/60"
//           viewBox="0 0 1200 320"
//           preserveAspectRatio="none"
//         >
//           <path
//             fill="currentColor"
//             d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,186.7C672,181,768,203,864,202.7C960,203,1056,181,1152,170.7L1200,160L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//           />
//         </svg>

//         {/* Tree silhouettes */}
//         <div className="absolute bottom-0 w-full h-32">
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute bottom-0 bg-purple-900/80"
//               style={{
//                 left: `${(i * 7) + Math.random() * 5}%`,
//                 width: `${Math.random() * 20 + 10}px`,
//                 height: `${Math.random() * 60 + 40}px`,
//                 clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Login Form */}
//       <div className="flex items-center justify-center min-h-screen relative z-10 p-4">
//         <div className="w-full max-w-md">
//           {/* Form Container */}
//           <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-white/70" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="empId"
//                   value={empId}
//                   onChange={(e) => setEmpId(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-white/70" />
//                 </div>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-4 flex items-center"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
//                   )}
//                 </button>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between text-sm">
                
//                 <button
//                   type="button"
//                   className="text-white/90 hover:text-white transition-colors"
//                   onClick={()=>navigate('/forgot-password')}
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
//               >
//                 Login
//               </button>

//               {/* Register Link */}
//               <div className="text-center">
//                 <span className="text-white/70">Don't have an account? </span>
//                 <button
//                   type="button"
//                   className="text-white font-semibold hover:text-purple-200 transition-colors"
//                 >
//                   Register
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reset, login } from '../store/slices/authSlice';

export default function Login() {
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [stars, setStars] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    // Generate random stars once
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (isSuccess && user) {
      navigate('/');
      dispatch(reset());
    }
  }, [isSuccess, user, navigate, dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ empId, password }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Mountain Silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Back mountains */}
        <svg
          className="absolute bottom-0 w-full h-64 text-purple-900/40"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7L1200,96L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        {/* Front mountains */}
        <svg
          className="absolute bottom-0 w-full h-48 text-purple-900/60"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,186.7C672,181,768,203,864,202.7C960,203,1056,181,1152,170.7L1200,160L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        {/* Tree silhouettes */}
        <div className="absolute bottom-0 w-full h-32">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-purple-900/80"
              style={{
                left: `${(i * 7) + Math.random() * 5}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 60 + 40}px`,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Form (glassmorphism) */}
      <div className="flex items-center justify-center min-h-screen relative z-10 p-4">
        {/* Glow blobs behind the card */}
        <div className="absolute -top-8 -left-6 w-40 h-40 rounded-full bg-blue-500/40 blur-2xl" />
        <div className="absolute bottom-8 right-10 w-40 h-40 rounded-full bg-amber-400/40 blur-2xl" />

        <div className="w-full max-w-md relative">
          {/* Glass card */}
          <div
            className="
              relative rounded-3xl border border-white/20
              bg-white/10 backdrop-blur-2xl
              ring-1 ring-white/10 ring-offset-0
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              p-8
            "
          >
            {/* Soft top highlight */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-white/20 to-transparent opacity-40" />

            <div className="relative">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Login</h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* EmpId */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/70" />
                  </div>
                  <input
                    type="text"
                    placeholder="empId"
                    value={empId}
                    onChange={(e) => setEmpId(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    autoComplete="username"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/70" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-white/90 hover:text-white transition-colors"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  Login
                </button>

                {/* Register link */}
                {/* <div className="text-center">
                  <span className="text-white/70">Don&apos;t have an account? </span>
                  <button
                    type="button"
                    className="text-white font-semibold hover:text-purple-200 transition-colors"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
