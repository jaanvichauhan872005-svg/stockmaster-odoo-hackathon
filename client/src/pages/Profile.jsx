import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  Camera, 
  Shield, 
  MapPin,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  // --- State ---
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@invmanager.com",
    phone: "+1 (555) 123-4567",
    role: "Warehouse Manager",
    location: "San Francisco HQ",
    avatar: null // In a real app, this would be a URL
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --- Handlers ---

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Manage Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">Update your personal information and security settings.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* User Avatar Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-md text-indigo-600 font-bold text-4xl mb-4 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    "A"
                  )}
                </div>
                {/* Camera Overlay */}
                <button 
                  type="button"
                  className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full mt-2">
                {user.role}
              </span>
              
              <div className="mt-6 w-full pt-6 border-t border-gray-100 flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Location</span>
                  <span className="font-medium text-gray-800">{user.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> Department</span>
                  <span className="font-medium text-gray-800">Operations</span>
                </div>
              </div>
            </div>

            {/* Save Button (Mobile/Desktop Sticky) */}
            <button 
              type="submit"
              disabled={isSaving}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white transition-all transform active:scale-95
                ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                {successMessage}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Edit Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Personal Information</h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text"
                      name="role"
                      value={user.role}
                      readOnly
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 outline-none text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Security</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="password"
                      name="current"
                      value={passwords.current}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password to change"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;