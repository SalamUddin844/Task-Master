import React, { useState } from 'react';
import {ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_API from "../../../config";

export default function Register() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ 
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) { /// checking password and confirm
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
        <p className="text-gray-500 mt-1">Create your account</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5"> 
          {/* Name */}
          <div className="relative">
            <label for="name" className="block text-gray-700 text-sm mb-2">Name</label>
            {/* <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label for="email" className='block text-gray-700 text-sm mb-2'>Email</label>
              
            {/* <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label for="password" className="block text-gray-700 text-sm mb-2">Password</label>
            {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label for="confirmPassword" className="block text-gray-700 text-sm mb-2">Confirm Password</label>
            {/* <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group"
          >
            {loading ? 'Registering...' : 'Create Account'}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{' '}
          <button
            className="text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  </div>
);
}
