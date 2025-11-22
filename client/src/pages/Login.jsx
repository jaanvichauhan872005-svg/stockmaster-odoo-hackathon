import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateSignUp = () => {
    if (formData.name.trim().length < 3)
      return "Name must be at least 3 characters.";

    if (!formData.email.includes("@"))
      return "Enter a valid email.";

    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";

    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (isLoginView) {
        // EMAIL + PASSWORD LOGIN
        await login(formData.email, formData.password);
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 50);

      } else {
        // SIGN UP
        const validationErr = validateSignUp();
        if (validationErr) return setError(validationErr);

        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        setSuccessMsg("Account created successfully! Please sign in.");
        setTimeout(() => {
          setIsLoginView(true);
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          setSuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">

      {/* Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 animate-fade-in">
        <div className="flex justify-center items-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            I
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">InvManager</h2>
        <p className="mt-2 text-sm text-gray-500">
          {isLoginView ? "Welcome back!" : "Create a new account"}
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-200 sm:rounded-xl">

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 p-3 border-l-4 border-red-600 rounded flex gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              {error}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="mb-4 bg-green-50 p-3 border-l-4 border-green-600 rounded flex gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5 mt-0.5" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name - Sign Up Only */}
            {!isLoginView && (
              <div>
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 py-2 border rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 py-2 border rounded-lg"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border rounded-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password - Signup */}
            {!isLoginView && (
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Re-Enter Password
                </label>
                <div className="relative mt-1">
                  <ShieldCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 py-2 border rounded-lg"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-semibold hover:bg-blue-700 transition"
            >
              {isLoginView ? "SIGN IN" : "SIGN UP"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch View */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLoginView ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLoginView(false)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLoginView(true)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
