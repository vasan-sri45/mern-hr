// // pages/ForgotPassword.jsx
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { forgotPassword, reset as resetSlice } from '../store/slices/authSlice';

// export default function ForgotPassword() {
//   const [emailId, setEmailId] = useState('');
//   const dispatch = useDispatch();
//   const { isLoading, message } = useSelector(s => s.auth);

//   const onSubmit = (e) => {
//     e.preventDefault();
//     dispatch(forgotPassword(emailId));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-6 rounded-2xl border bg-white">
//         <h2 className="text-xl font-semibold">Forgot password</h2>
//         <input
//           type="email"
//           placeholder="emailId"
//           value={emailId}
//           onChange={(e)=>setEmailId(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//         <button disabled={isLoading} className="w-full py-2 bg-indigo-600 text-white rounded">
//           {isLoading ? 'Sending…' : 'Send reset link'}
//         </button>
//         {message && <p className="text-sm text-gray-600">{message}</p>}
//       </form>
//     </div>
//   );
// }


// src/pages/ForgotPassword.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../store/slices/authSlice';

export default function ForgotPassword() {
  const [emailId, setEmailId] = useState('');
  const [stars, setStars] = useState([]);
  const dispatch = useDispatch();
  const { isLoading, message } = useSelector((s) => s.auth);

  useEffect(() => {
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(emailId));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Subtle star field */}
      <div className="absolute inset-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Horizon waves (optional, for depth) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="absolute bottom-0 w-full h-64 text-purple-900/40" viewBox="0 0 1200 320" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7L1200,96L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg className="absolute bottom-0 w-full h-48 text-purple-900/60" viewBox="0 0 1200 320" preserveAspectRatio="none">
          <path
            fill="currentColor"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,186.7C672,181,768,203,864,202.7C960,203,1056,181,1152,170.7L1200,160L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Glassmorphism card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Glow blobs behind card */}
        <div className="absolute -top-8 -left-6 w-40 h-40 rounded-full bg-blue-500/40 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-amber-400/40 blur-2xl" />

        <div
          className="
            relative w-full max-w-md rounded-[24px]
            border border-white/20 bg-white/10 backdrop-blur-2xl
            ring-1 ring-white/10
            shadow-2xl
            p-8
          "
        >
          {/* soft highlight overlay */}
          <div className="pointer-events-none absolute -inset-px rounded-[24px] bg-gradient-to-b from-white/20 to-transparent opacity-40" />

          <div className="relative space-y-6">
            <h2 className="text-center text-3xl font-bold text-white">Forgot password</h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="emailId" className="block text-sm font-medium text-white/80 mb-1">
                  Email
                </label>
                <input
                  id="emailId"
                  type="email"
                  placeholder="email@example.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="
                    w-full rounded-2xl px-4 py-3
                    bg-white/15 text-white placeholder-white/70
                    border border-white/20
                    focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent
                    backdrop-blur-sm
                  "
                  required
                />
              </div>

              <button
                disabled={isLoading}
                className="
                  w-full py-3 rounded-2xl font-semibold text-white
                  bg-gradient-to-r from-purple-500 to-pink-500
                  hover:from-purple-600 hover:to-pink-600
                  shadow-lg transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
              >
                {isLoading ? 'Sending…' : 'Send reset link'}
              </button>

              {message && <p className="text-sm text-white/80">{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
