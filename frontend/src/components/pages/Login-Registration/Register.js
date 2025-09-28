
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
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

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
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

      toast.success('Successfully registered!');

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

  // Validation helpers
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordRules = {
    length: formData.password.length >= 8,
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo + Heading */}
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
            <div className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <p
                className={`text-xs mt-2 ${
                  passwordRules.length &&
                  passwordRules.number &&
                  passwordRules.special
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-red-700 text-sm">*</span> This field cannot be empty              
                </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <p
                className={`text-xs mt-1 ${
                  formData.email && !isValidEmail(formData.email)
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                
              </p>
              <p
                className={`text-xs mt-2 ${
                  passwordRules.length &&
                  passwordRules.number &&
                  passwordRules.special
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-red-700 text-sm">*</span> Email should be valid formate              
                </p>
            </div>
            

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <p
                className={`text-xs mt-2 ${
                  passwordRules.length &&
                  passwordRules.number &&
                  passwordRules.special
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="text-red-700 text-sm">*</span> Password must contain at least 8
                characters, 0-9, A-Z, a-z & special characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium 
                         hover:bg-blue-700 transition-colors flex items-center justify-center group"
            >
              {loading ? 'Registering...' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Already have account */}
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
