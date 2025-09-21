import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BACKEND_API from "../../../config";


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_API}/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
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

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
          {message && (
            <div className="bg-green-100 text-green-700 p-2 rounded text-center text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <label for="email" className='block text-gray-700 text-sm mb-2'>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-4 pr-4 py-4 text-sm border border-gray-200 rounded-xl 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           outline-none transition-all"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-medium 
                          hover:bg-blue-700 transition-colors flex items-center justify-center ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Remembered your password?{" "}
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
