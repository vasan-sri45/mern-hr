// // pages/ResetPassword.jsx
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import { resetPasswordThunk } from '../store/slices/authSlice';

// export default function ResetPassword() {
//   const [password, setPassword] = useState('');
//   const { token } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, isSuccess, message } = useSelector(s => s.auth);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const res = await dispatch(resetPasswordThunk({ token, password }));
//     if (res.meta.requestStatus === 'fulfilled') navigate('/login');
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-6 rounded-2xl border bg-white">
//         <h2 className="text-xl font-semibold">Set a new password</h2>
//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e)=>setPassword(e.target.value)}
//           className="w-full border rounded px-3 py-2"
//           required
//         />
//         <button disabled={isLoading} className="w-full py-2 bg-indigo-600 text-white rounded">
//           {isLoading ? 'Saving…' : 'Reset password'}
//         </button>
//         {message && <p className="text-sm text-gray-600">{message}</p>}
//       </form>
//     </div>
//   );
// }


// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordThunk } from '../store/slices/authSlice';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [stars, setStars] = useState([]);
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(resetPasswordThunk({ token, password }));
    if (res.meta.requestStatus === 'fulfilled') navigate('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Stars */}
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

      {/* Horizon waves (optional) */}
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

      {/* Glass card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Glow blobs */}
        <div className="absolute -top-8 -left-6 w-40 h-40 rounded-full bg-blue-500/40 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-amber-400/40 blur-2xl" />

        <div
          className="
            relative w-full max-w-md rounded-[24px]
            border border-white/20 bg-white/10 backdrop-blur-2xl
            ring-1 ring-white/10
            shadow-[0_10px_30px_rgba(0,0,0,0.35)]
            p-8
          "
        >
          <div className="pointer-events-none absolute -inset-px rounded-[24px] bg-gradient-to-b from-white/20 to-transparent opacity-40" />

          <div className="relative space-y-6">
            <h2 className="text-center text-3xl font-bold text-white">Set a new password</h2>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full pl-12 pr-12 py-4
                    bg-white/10 backdrop-blur-sm
                    border border-white/20 rounded-2xl
                    text-white placeholder-white/70
                    focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent
                    transition-all duration-300
                  "
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-5 w-5 text-white/70 hover:text-white" /> : <Eye className="h-5 w-5 text-white/70 hover:text-white" />}
                </button>
              </div>

              <button
                disabled={isLoading}
                className="
                  w-full py-4 rounded-2xl font-semibold text-white
                  bg-gradient-to-r from-purple-500 to-pink-500
                  hover:from-purple-600 hover:to-pink-600
                  shadow-lg transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
              >
                {isLoading ? 'Saving…' : 'Reset password'}
              </button>

              {message && <p className="text-sm text-white/80">{message}</p>}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
