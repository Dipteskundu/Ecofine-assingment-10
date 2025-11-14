import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Leaf, LogIn, LogOut, User, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { getAuth, updateProfile } from 'firebase/auth';

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ||
    "light");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => { 
    const html = document.querySelector("html"); 
    html.setAttribute("data-theme", theme); 
    localStorage.setItem("theme", theme); 
  }, [theme]); 
 
  const handleTheme = (checked) => { 
    setTheme(checked ? "dark" : "light"); 
    setIsDark(checked);
  }; 

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored ? stored === 'dark' : prefersDark;
    setIsDark(initialDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Navigation Links - Before Login
  const publicNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Issues', href: '/all-issues' },
    { name: 'About', href: '/about' }
  ];

  // Navigation Links - After Login
  const authenticatedNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Issues', href: '/all-issues' },
    { name: 'Add Issues', href: '/addIssues' },
    { name: 'My Issues', href: '/my-issues' },
    { name: 'My Contribution', href: '/my-contribution' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-gray-900'
          }`}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-black dark:text-white text-xl font-bold">Ecofine</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-black dark:text-white hover:text-green-400 transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right Side - Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <label className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" aria-label="Toggle theme">
                <input 
                  onChange={(e) => handleTheme(e.target.checked)} 
                  type="checkbox" 
                  defaultChecked={localStorage.getItem('theme') === "dark"} 
                  className="toggle"
                />
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </label>
              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="p-1 rounded-full hover:ring-2 hover:ring-green-500 transition-all cursor-pointer"
                    aria-label="Profile menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-10 h-10 rounded-full border-2 border-green-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=User'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-2 border-green-600">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-300 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setProfileName(user.displayName || ''); setProfilePhoto(user.photoURL || ''); setIsUpdateOpen(true); setIsProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Update Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-black dark:text-white hover:text-green-400 transition-colors duration-200 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition-colors duration-200 font-medium flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-900 dark:text-gray-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-900 dark:text-gray-100 hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-4 py-2 border-t border-gray-200 pt-4">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">{user.email}</p>
                    </div>
                  </div>
                  <label className="w-full mt-2 px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center space-x-2 cursor-pointer">
                    <input 
                      onChange={(e) => handleTheme(e.target.checked)} 
                      type="checkbox" 
                      defaultChecked={localStorage.getItem('theme') === "dark"} 
                      className="toggle"
                    />
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </label>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition-colors duration-200 font-medium mt-2 flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center text-gray-900 dark:text-gray-100 hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2 rounded transition-colors border-t border-gray-200 pt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded transition-colors duration-200 font-medium mt-2 flex items-center justify-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                  <label className="w-full mt-2 px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center space-x-2 cursor-pointer">
                    <input 
                      onChange={(e) => handleTheme(e.target.checked)} 
                      type="checkbox" 
                      defaultChecked={localStorage.getItem('theme') === "dark"} 
                      className="toggle"
                    />
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Update Profile</h3>
            <div className="space-y-4">
              <input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Display Name"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                placeholder="Photo URL"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setIsUpdateOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const auth = getAuth();
                      if (!auth.currentUser) return;
                      await updateProfile(auth.currentUser, { displayName: profileName || undefined, photoURL: profilePhoto || undefined });
                      toast.success('Profile updated');
                      setIsUpdateOpen(false);
                    } catch {
                      toast.error('Failed to update profile');
                    }
                  }}
                  className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}