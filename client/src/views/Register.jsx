import { useState } from "react";
import { useNavigate } from "react-router";
import baseUrl from "../constant/baseUrl";
import axios from "axios";
import Toastify from "toastify-js";

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    
  async function handleRegister (e) {
    e.preventDefault()
    try {
        await axios.post (`${baseUrl}/register`, {email, password})
         Toastify({
        text: "Success Register 🎉",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)"
        }
      }).showToast()
      navigate("/login")
    } catch (error) {
         Toastify({
        text: error.response?.data?.message || "Register Failed",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }
      }).showToast()
    }
    }

    return (
           <div className="min-h-screen flex items-center justify-center w-full">
      <div className="px-8 py-6 w-1/3 bg-green-400 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="bg-white rounded-lg w-full px-3 py-2 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full mt-5 py-2 px-4 border-2 border-black rounded-lg text-sm font-medium text-white bg-gray-700 hover:bg-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Register
          </button>
        </form>
      </div>
    </div>
    )
  }
