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

const EXPLORE_CATEGORIES = [
  { id: 'hackathon', label: 'Hackathons', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  { id: 'coding-contest', label: 'Coding Contests', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  { id: 'workshop', label: 'Workshops', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  { id: 'cultural', label: 'Cultural', icon: Music, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-500/10' },
  { id: 'sports', label: 'Sports', icon: Dumbbell, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
  { id: 'networking', label: 'Networking', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  { id: 'seminar', label: 'Seminars', icon: Mic, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' }
];

const InternalCustomSearch = ({ value, onChange, placeholder = "Search events..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-dropdown-wrapper')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setIsOpen(false);
    navigate(`/events?category=${categoryId}`);
  };

  return (
    <div className="relative w-full search-dropdown-wrapper">
      <div className="custom-search-container relative z-[1051]">
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
              onClick={() => setIsOpen(true)}
            />
            <div id="input-mask"></div>
            <div id="pink-mask"></div>
            <div className="filterBorder"></div>
            <div 
              id="filter-icon" 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
              className="cursor-pointer z-20"
              title="Explore Categories"
            >
              <svg preserveAspectRatio="none" height={20} width={20} viewBox="4.8 4.56 14.832 15.408" fill="none">
                <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="currentColor" className="text-slate-600 dark:text-gray-400" strokeWidth={1} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
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
      
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-900 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 overflow-hidden z-[1050] animate-fadeIn origin-top">
          <div className="p-4 sm:p-5 pb-6">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest pl-2">Explore</span>
                <button type="button" onClick={() => { setIsOpen(false); navigate('/events'); }} className="text-[13px] font-bold text-primary-600 dark:text-primary-400 flex items-center hover:translate-x-1 transition-transform group pr-2">
                  View All <ArrowRight className="w-4 h-4 ml-1 icon-transition group-hover:translate-x-0.5" />
                </button>
             </div>
             
             <div className="grid grid-cols-4 gap-y-5 gap-x-2">
                {EXPLORE_CATEGORIES.map(cat => (
                   <button 
                     key={cat.id}
                     type="button"
                     onClick={() => handleCategoryClick(cat.id)}
                     className="flex flex-col items-center justify-center rounded-xl transition-all group active:scale-95"
                   >
                     <div className={`w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full ${cat.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 border border-transparent`}>
                        <cat.icon className={`w-5 h-5 sm:w-[22px] sm:h-[22px] ${cat.color}`} />
                     </div>
                     <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-gray-300 text-center leading-tight">
                       {cat.label}
                     </span>
                   </button>
                ))}
             </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-blue-600 to-slate-900 p-4 sm:px-6 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity" 
            onClick={() => { setIsOpen(false); navigate('/create-event'); }}
          >
             <div className="flex items-center gap-3">
               <span className="text-2xl animate-bounce-slow filter drop-shadow-md">🚀</span>
               <div>
                  <h4 className="text-white font-bold text-sm">Host Your Own Event</h4>
                  <p className="text-blue-200 text-xs font-medium opacity-90 mt-0.5">Reach students instantly!</p>
               </div>
             </div>
             <ArrowRight className="w-5 h-5 text-white opacity-70" />
          </div>
        </div>
      )}
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

          {/* Logo - Centered on Mobile, Left on Desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:left-auto flex items-center z-[1010] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            <Link to="/" className="flex items-center space-x-1 md:space-x-3">
              <img
                src="/logo.png"
                alt="EventNexus Logo"
                className="w-10 h-10 md:w-16 md:h-16 object-contain"
              />
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
