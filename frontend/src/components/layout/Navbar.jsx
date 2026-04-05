import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as notificationService from '../../services/notificationService';
import {
  Menu,
  X,
  Calendar,
  User,
  LogOut,
  Star,
  PlusCircle,
  LayoutDashboard,
  ChevronDown,
  Shield,
  Bell,
  Search,
  Laptop,
  Trophy,
  BookOpen,
  Mic,
  Lightbulb,
  Music,
  Dumbbell,
  GraduationCap,
  Users,
  ArrowRight
} from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const InternalCustomSearch = ({ value, onChange, placeholder = "Search events..." }) => {
  return (
    <div className="relative search-dropdown-wrapper mx-auto w-full">
      <div className="custom-search-container relative z-[1055] mx-auto w-full flex justify-center">
        <div className="relative w-full max-w-[600px]">
          <div id="poda">
            <div className="custom-search-glow"></div>
            <div className="custom-search-darkBorderBg"></div>
            <div className="custom-search-darkBorderBg"></div>
            <div className="custom-search-darkBorderBg"></div>
            <div className="custom-search-white"></div>
            <div className="custom-search-border"></div>
            <div id="main">
              <input
                placeholder={placeholder}
                type="text"
                name="text"
                className="custom-search-input"
                value={value}
                onChange={onChange}
              />
              <div id="input-mask"></div>
              <div id="pink-mask"></div>
              <div id="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={24} fill="none" className="feather feather-search">
                  <circle stroke="url(#search)" r={8} cy={11} cx={11} />
                  <line stroke="url(#searchl)" y2="16.65" y1={22} x2="16.65" x1={22} />
                  <defs>
                    <linearGradient gradientTransform="rotate(50)" id="search">
                      <stop stopColor="#0ea5e9" offset="0%" />
                      <stop stopColor="#d946ef" offset="100%" />
                    </linearGradient>
                    <linearGradient id="searchl">
                      <stop stopColor="#0ea5e9" offset="0%" />
                      <stop stopColor="#d946ef" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const Navbar = ({ isCollapsed, isDrawerOpen, onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Only show search bar on home page
  const showSearchBar = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fetch unread notification count
  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="glass-navbar fixed top-0 left-0 w-full z-[1000] mobile-navbar-opaque md:mobile-navbar-glass">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative w-full">

          {/* Mobile Animated Hamburger (Left aligned) */}
          <div className="md:hidden flex items-center z-50 -ml-2">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full active:scale-90 transition-transform focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center overflow-hidden">
                <span className={`bg-current h-[2px] w-5 rounded-full transform transition-all duration-300 ease-in-out absolute ${isDrawerOpen ? 'rotate-45' : '-translate-y-2'}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transform transition-all duration-300 ease-in-out absolute ${isDrawerOpen ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transform transition-all duration-300 ease-in-out absolute ${isDrawerOpen ? '-rotate-45' : 'translate-y-2'}`} />
              </div>
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto flex items-center z-[1010] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <Link to="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 to-slate-900 dark:from-blue-400 dark:to-slate-100 bg-clip-text text-transparent tracking-tighter leading-none block drop-shadow-md">EventNexus</span>
            </Link>
          </div>

          {/* Search Bar - Only on Home Page */}
          {showSearchBar && (
            <div className={`absolute ${isCollapsed ? 'left-[calc(50%+40px)]' : 'left-[calc(50%+128px)]'} -translate-x-1/2 transition-[left] duration-300 hidden md:flex items-center h-full`}>
              <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <InternalCustomSearch
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events..."
                />
              </form>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">


            {isAuthenticated ? (
              <>

                <div className="flex items-center gap-0.5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-slate-200/30 dark:border-white/5 p-1 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none">
                  {/* Favorites */}
                  <Link
                    to="/favorites"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 group"
                    title="Favorites"
                  >
                    <Star className="w-[18px] h-[18px] icon-transition group-hover:scale-110 group-hover:fill-yellow-400/20" />
                  </Link>

                  {/* Notifications Bell */}
                  <Link
                    to="/notifications"
                    className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-gray-400 hover:text-primary-600 group"
                    title="Notifications"
                  >
                    <div className={`relative ${unreadCount > 0 ? 'animate-bell-ring text-red-600' : ''}`}>
                      <Bell className="w-[18px] h-[18px] transition-all icon-transition group-hover:scale-110" />
                      {unreadCount > 0 && (
                        <>
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></span>
                        </>
                      )}
                    </div>
                  </Link>

                  <ThemeToggle />

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden bg-primary-50/50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100/50 dark:hover:bg-primary-500/20 transition-all group"
                      title="Profile"
                    >
                      {user?.role === 'admin' ? (
                        <Shield className="w-[18px] h-[18px] text-red-500 icon-transition group-hover:scale-110" />
                      ) : (
                        <User className="w-[18px] h-[18px] icon-transition group-hover:scale-110" />
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 glass-panel-premium rounded-lg shadow-lg py-2 animate-fadeIn border-white/20">
                        {user?.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-500/10 font-semibold group rounded-md mx-2"
                            >
                              <Shield className="w-4 h-4 icon-transition group-hover:scale-110" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <hr className="my-2" />
                          </>
                        )}
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/10 group rounded-md mx-2"
                        >
                          <LayoutDashboard className="w-4 h-4 icon-transition group-hover:scale-110" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/10 group rounded-md mx-2"
                        >
                          <User className="w-4 h-4 icon-transition group-hover:scale-110" />
                          <span>Profile</span>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-500/10 w-[calc(100%-1rem)] text-left group rounded-md mx-2"
                        >
                          <LogOut className="w-4 h-4 icon-transition group-hover:translate-x-0.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:opacity-90 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-[1.02] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Actions / Theme Toggle for Mobile (Right aligned) */}
          <div className="md:hidden flex items-center z-40 gap-1 -mr-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search Bar - Appears below Navbar only on Home Page */}
        {showSearchBar && (
          <div className="md:hidden pb-2 px-2">
            <form onSubmit={handleSearch}>
              <InternalCustomSearch
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, workshops..."
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
