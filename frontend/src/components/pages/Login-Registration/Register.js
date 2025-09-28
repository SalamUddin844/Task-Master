
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_API from "../../../config";
import { toast } from "react-hot-toast";

// Zod schema
const registerSchema = z
  .object({
    name: z.string().min(1, { message: "This field cannot be empty" }),

    email: z
      .string()
      .min(1, { message: "This field cannot be empty" })
      .email({ message: "Invalid email format" }),

    password: z
      .string()
      .min(1, { message: "This field cannot be empty" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message:
          "Password must contain at least 8 characters, A-Z,a-z,0-9 & special character",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "This field cannot be empty" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_API}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success("Successfully registered!");

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Name
                 <span className="text-xs mt-1 text-red-500">*</span>
                 </label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.name && (
                <p className="text-xs mt-1 text-red-500"> {errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email
                <span className="text-xs mt-1 text-red-500">*</span>
                </label>
              <input
                type="email"
                placeholder="Email address"
                {...register("email")}
                className="w-full pl-5 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {errors.email && (
                <p className="text-xs mt-1 text-red-500"> {errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">Password
                <span className="text-xs mt-1 text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="text-xs mt-2 text-red-700"> {errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">Confirm Password
                <span className="text-xs mt-1 text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full pl-5 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-12 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.confirmPassword && (
                <p className="text-xs mt-1 text-red-500"> {errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group"
            >
              {loading ? "Registering..." : "Create Account"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Already have account */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

