import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Package,
  History,
  Settings,
  Boxes,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navRef = useRef(null);
  const profileRef = useRef(null);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/' },

    {
      name: 'Operations',
      icon: Boxes,
      children: [
        { name: 'Receipt', to: '/receipts' },
        { name: 'Delivery', to: '/delivery' },
        { name: 'Adjustment', to: '/adjustment' }
      ]
    },

    { name: 'Stock', icon: Package, to: '/stock' },
    { name: 'Move History', icon: History, to: '/history' },

    {
      name: 'Settings',
      icon: Settings,
      children: [
        { name: 'Warehouse', to: '/warehouse' },
        { name: 'Locations', to: '/location' }
      ]
    },
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleDropdownToggle = (name) => {
    setIsProfileOpen(false);
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  const currentTitle =
    navItems
      .flatMap(i => (i.children ? i.children : [i]))
      .find(n => n.to === location.pathname)?.name || 'Dashboard';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Left */}
          <div className="flex items-center gap-8">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="font-bold text-xl hidden md:block text-gray-800">InvManager</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isChildActive = item.children?.some(child => child.to === location.pathname);
                const isActive = location.pathname === item.to || isChildActive;

                // If dropdown item
                if (item.children) {
                  return (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition 
                          ${isActive || activeDropdown === item.name
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                        `}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform 
                          ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {activeDropdown === item.name && (
                        <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.to}
                                onClick={() => setActiveDropdown(null)}
                                className={`block px-4 py-2 text-sm 
                                  ${location.pathname === child.to
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'}
                                `}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Simple nav item
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition 
                      ${isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}
                    `}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Page Title */}
            <h1 className="hidden lg:block text-xl font-semibold text-gray-800">
              {currentTitle}
            </h1>

            <div className="hidden lg:block h-6 w-px bg-gray-200"></div>

            {/* Notification Bell */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-white border rounded-full"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setActiveDropdown(null); setIsProfileOpen(!isProfileOpen); }}
                className="flex items-center gap-3 pl-2"
              >
                <div className="w-9 h-9 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center text-indigo-700">
                  A
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-gray-700">Admin User</p>
                  <p className="text-xs text-gray-500">Warehouse Mgr.</p>
                </div>
                <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 transition 
                  ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <Link to={"/profile"} className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Manage Profile
                    </Link>
                    <button className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 px-2 space-y-1">

            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base text-gray-600 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition 
                        ${activeDropdown === item.name ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {activeDropdown === item.name && (
                      <div className="space-y-1 pl-10">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.to}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-md 
                              ${location.pathname === child.to
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'}
                            `}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base 
                    ${location.pathname === item.to
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}

          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
