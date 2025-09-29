import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BACKEND_API from "../../../config";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' })); // clear field error while typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_API}/auth/login`, formData);
      toast.success("Login Successful!");
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email not found" }));
      } else if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({ ...prev, password: "Wrong password" }));
      } else {
        toast.error(message); // fallback generic error
      }
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
          <p className="text-gray-500 mt-1">Simple project management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6"
        >
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={`w-full pl-5 pr-4 py-3 text-sm border rounded-xl outline-none transition-all
                         ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"}`}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 text-sm mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full pl-5 pr-10 py-3 text-sm border rounded-xl outline-none transition-all
                         ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="mt-2">
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

          {/* Sign Up Link */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Don’t have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
