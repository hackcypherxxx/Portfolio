// src/components/Login.jsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginThunk } from '../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      dispatch(loginThunk({ email, password }))
        .then((action) => {
          // action.meta.requestStatus is "fulfilled" or "rejected"
          console.log('Login action:', action);

          if (loginThunk.fulfilled.match(action)) {
            // success ▶ redirect once
            navigate('/dashboard', { replace: true });
          } else {
            // failure ▶ error is already in your slice state
            console.error('Login failed:', action.payload);
          }
        })
        .catch((err) => {
          // should never hit, but just in case
          console.error('Unexpected login error:', err);
        });
    },
    [dispatch, email, password, navigate]
  );

  return (
    <section
      id="login"
      className="s-login min-h-screen pt-32 pb-16 bg-[#0b0a15] text-white flex items-center justify-center"
    >
      <motion.div
        className="w-full max-w-md mx-auto px-8 py-10 rounded-lg shadow-2xl border border-gray-800"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold text-center mb-4">Welcome Back</h2>
        <Link to={"/"}>
          <p className='text-xl font-bold text-center underline text-blue-400'>Go back to Home</p>
        </Link>
        <p className="text-gray-400 text-center mb-10">
          Sign in to access your dashboard.
        </p>

        {error && <div className="mb-6 text-center text-red-500">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-[#f9861a] focus:ring-[#f9861a] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-[#f9861a] focus:ring-[#f9861a] transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full border-2 border-[#f9861a] bg-[#f9861a] text-white hover:bg-transparent hover:text-[#f9861a]
                       text-lg font-bold uppercase tracking-wider px-10 py-4 rounded-full transition-all duration-300 mt-8 disabled:opacity-50"
          >
            {status === 'loading' ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default Login;
