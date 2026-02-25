import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import baseUrl from '../constant/baseUrl';
import axios from 'axios';
import Toastify from 'toastify-js';

export default function Register() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/register`, { username, email, password });
      Toastify({
        text: 'Success Register 🎉',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true,
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();
      navigate('/login');
    } catch (error) {
      Toastify({
        text: error.response?.data?.message || 'Register Failed',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true,
        style: {
          background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        },
      }).showToast();
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-3/4 max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Sign up
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Sign up
          </button>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          already have an account?{' '}
          <Link
            to="/login"
            className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
