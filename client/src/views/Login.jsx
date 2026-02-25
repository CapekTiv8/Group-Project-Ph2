import { useState } from 'react';
import { useNavigate } from 'react-router';

import axios from 'axios';
import Toastify from 'toastify-js';
import Button from '../components/Button';
import baseUrl from '../constant/baseUrl';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${baseUrl}/login`, {
        email,
        password,
      });
      localStorage.setItem('token', data.access_token);
      const decodedToken = jwtDecode(data.access_token);
      localStorage.setItem('UserId', decodedToken.id);
      localStorage.setItem('username', decodedToken.username);

      Toastify({
        text: 'Succeed Login',
        duration: 3000,
        destination: 'https://github.com/apvarun/toastify-js',
        newWindow: true,
        close: true,
        gravity: 'top', // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
        onClick: function () {}, // Callback after click
      }).showToast();
      navigate('/');
    } catch (error) {
      Toastify({
        text: error.response?.data?.message || 'Login failed',
        duration: 3000,
        destination: 'https://github.com/apvarun/toastify-js',
        newWindow: true,
        close: true,
        gravity: 'top', // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="px-8 py-6 w-1/3 bg-blue-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium ">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                placeholder="your@email.com"
                autoComplete="current-email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button nameProp={'/Login'} />
          </form>
        </div>
      </div>
    </>
  );
}
