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

const Login = () => {
  // --- State ---
  const [isLoginView, setIsLoginView] = useState(true); // Toggle between Login and SignUp
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Mock Database (In-memory for demo purposes)
  const [users, setUsers] = useState([
    { loginId: 'admin123', password: 'Password@123', email: 'admin@test.com' }
  ]);

  // --- Helpers ---

  const validateSignUp = () => {
    const { loginId, email, password, confirmPassword } = formData;

    // 1. Login ID Validation (6-12 chars)
    if (loginId.length < 6 || loginId.length > 12) {
      return "Login ID must be between 6-12 characters.";
    }

    // 2. Check if Login ID exists
    if (users.some(u => u.loginId === loginId)) {
      return "Login ID already exists. Please choose another.";
    }

    // 3. Check if Email exists
    if (users.some(u => u.email === email)) {
      return "Email ID already registered.";
    }

    // 4. Password Validation (>8 chars, 1 Upper, 1 Special)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length <= 8) {
      return "Password must be greater than 8 characters.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }

    // 5. Password Match
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null; // No errors
  };

  const handleLogin = () => {
    const user = users.find(
      u => u.loginId === formData.loginId && u.password === formData.password
    );

    if (user) {
      setSuccessMsg("Login Successful! Redirecting...");
      setError('');
      // Here you would typically redirect to dashboard
      console.log("Logged in user:", user);
    } else {
      setError("Invalid Login Id or Password");
      setSuccessMsg('');
    }
  };

  const handleSignUp = () => {
    const validationError = validateSignUp();
    if (validationError) {
      setError(validationError);
      setSuccessMsg('');
      return;
    }

    // "Create" User
    const newUser = { 
      loginId: formData.loginId, 
      email: formData.email, 
      password: formData.password 
    };
    setUsers([...users, newUser]);
    
    setSuccessMsg("Account created successfully! Please Sign In.");
    setError('');
    
    // Switch to login view after short delay
    setTimeout(() => {
        setIsLoginView(true);
        setFormData({ ...formData, password: '', confirmPassword: '' }); // Clear passwords
        setSuccessMsg('');
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on typing
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
      
      {/* 1. App Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 animate-fade-in">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg transform rotate-3">
            I
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          InvManager
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {isLoginView ? 'Welcome back! Please login to continue.' : 'Create a new account to get started.'}
        </p>
      </div>

      {/* 2. Main Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl border border-gray-100 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          
          {/* Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <p className="text-sm text-green-700 font-medium">{successMsg}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Login ID (Common) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Login ID {isLoginView ? '' : <span className="text-xs font-normal text-gray-400">(6-12 chars)</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="loginId"
                  type="text"
                  required
                  value={formData.loginId}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="Enter Login ID"
                />
              </div>
            </div>

            {/* Email ID (Sign Up Only) */}
            {!isLoginView && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
            )}

            {/* Password (Common) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {!isLoginView && (
                  <p className="text-xs text-gray-500 mt-1">Must be &gt;8 chars, with 1 uppercase & 1 special char.</p>
              )}
            </div>

            {/* Re-Enter Password (Sign Up Only) */}
            {!isLoginView && (
              <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Re-Enter Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98]"
              >
                {isLoginView ? 'SIGN IN' : 'SIGN UP'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-6 flex items-center justify-center text-sm">
            {isLoginView ? (
                <div className="flex gap-4 text-gray-600">
                    <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
                        Forget Password?
                    </a>
                    <span className="text-gray-300">|</span>
                    <button 
                        onClick={() => { setIsLoginView(false); setError(''); }}
                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </div>
            ) : (
                <div className="text-gray-600">
                    Already have an account?{' '}
                    <button 
                        onClick={() => { setIsLoginView(true); setError(''); }}
                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            )}
          </div>

        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>&copy; 2023 InvManager Inc. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Login;