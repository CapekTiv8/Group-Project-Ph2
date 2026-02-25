import { useState } from 'react';
import { useNavigate } from 'react-router';
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
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="px-8 py-6 w-1/3 bg-blue-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              placeholder="your@email.com"
              autoComplete="current-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button nameProp={'Login'} />
        </form>
      </div>
    </div>
  );
}
