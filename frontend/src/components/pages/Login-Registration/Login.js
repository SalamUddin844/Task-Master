import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://192.168.12.224:5001/api/auth/login', formData);
      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TaskMaster</h1>
          <p className="text-gray-500 mt-1">Simple project management</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-11 pr-10 py-4 border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center 
                           text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full py-3 px-4 rounded-xl text-sm font-medium 
                           border border-gray-200 text-gray-700 
                           hover:bg-gray-50 active:bg-gray-100 
                           transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-medium 
                         hover:bg-blue-700 transition-colors flex items-center justify-center group"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Don’t have an account?{' '}
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
