import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import Toastify from 'toastify-js';

import Button from '../components/Button';
import baseUrl from '../constant/baseUrl';
import { useAuth } from '../context/LoginContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });

      // save token via context
      login(data.access_token);

      Toastify({
        text: 'Login Success',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'left',
        stopOnFocus: true,
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();

      navigate('/');
    } catch (error) {
      Toastify({
        text: error.response?.data?.message || 'Login Failed',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'left',
        stopOnFocus: true,
        style: {
          background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
        },
      }).showToast();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mt-2">Login to your account</p>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
            Login
          </button>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-green-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
