import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Edit2, Save, X, CheckCircle, AlertCircle, Camera, Calendar } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    bio: user?.bio || ''
  });
  
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 300], [0, 50]);

  const avatarScale = useTransform(scrollY, [0, 200], [1, 0.8]);
  const avatarY = useTransform(scrollY, [0, 200], [0, -20]);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      college: user?.college || '',
      bio: user?.bio || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      college: user?.college || '',
      bio: user?.bio || ''
    });
    setPreviewAvatar(null);
    setIsEditing(false);
    setError('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500 overflow-x-hidden pb-20">
      {/* Messages */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            {success && (
              <div className="bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 shadow-2xl flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <p className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-2xl flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm sm:text-base">{error}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative h-[45vh] min-h-[350px] w-full origin-top"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-[60px] mix-blend-overlay opacity-30"></div>
          {/* Decorative blur orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl mix-blend-screen animate-pulse duration-10000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl mix-blend-screen animate-pulse duration-7000"></div>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end md:justify-between h-full">
            <div className="flex-1 md:pl-56 text-center md:text-left mb-8 md:mb-0 w-full z-10 pt-16 md:pt-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg"
              >
                {user?.name || 'Your Profile'}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-indigo-100 mt-4 text-base sm:text-lg font-medium flex flex-wrap justify-center md:justify-start items-center gap-3 drop-shadow"
              >
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{user?.college || 'No college specified'}</span>
                </div>
                <span className="hidden sm:inline opacity-50">•</span>
                <span className="capitalize px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md border border-white/20 shadow-sm">
                  {user?.role || 'Guest'}
                </span>
              </motion.div>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="z-10 flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-white transition-all font-semibold shadow-xl shadow-black/10"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Interactive Avatar */}
        <motion.div 
          style={{ scale: avatarScale, y: avatarY }}
          className="relative -mt-24 sm:-mt-28 mb-12 mx-auto md:mx-0 md:ml-8 w-40 h-40 sm:w-48 sm:h-48 origin-bottom"
        >
          <div className="relative group w-full h-full rounded-full border-[6px] border-white dark:border-slate-900 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden cursor-pointer transition-all duration-300">
            {previewAvatar || user?.avatar ? (
              <img
                src={previewAvatar || user.avatar}
                alt={user?.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:scale-110 transition-transform duration-500">
                <span className="text-6xl sm:text-7xl font-black text-slate-400 dark:text-slate-600">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            
            {/* Hover overlay for editing */}
            {isEditing && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Camera className="w-10 h-10 text-white drop-shadow-md" />
              </div>
            )}
          </div>
          
          {/* Glowing ring under everything */}
          {isEditing && (
             <div className="absolute -inset-2 rounded-full border-[6px] border-primary-500/0 hover:border-primary-500/40 pointer-events-none transition-colors duration-300 -z-10"></div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
        </motion.div>

        {/* Content Section */}
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Full Name Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <label className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mr-3 shadow-inner">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 disabled:opacity-50 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-500/40 transition-all text-lg font-semibold shadow-inner border border-slate-100 dark:border-slate-800"
                />
              ) : (
                <div className="px-5 py-4 text-slate-900 dark:text-white text-lg font-semibold">
                  {user?.name}
                </div>
              )}
            </motion.div>

            {/* Email Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <label className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3 shadow-inner">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Email Address
              </label>
              <div className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 text-lg font-semibold break-all">{user?.email}</p>
                {isEditing && <span className="text-xs bg-slate-200 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 ml-3 whitespace-nowrap font-medium">Read-only</span>}
              </div>
            </motion.div>

            {/* College Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <label className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mr-3 shadow-inner">
                  <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                College / University
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Where do you study?"
                  className="w-full px-5 py-4 bg-white dark:bg-slate-900/50 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 dark:focus:ring-purple-500/40 transition-all text-lg font-semibold shadow-inner border border-slate-100 dark:border-slate-800"
                />
              ) : (
                <p className="px-5 py-4 text-slate-900 dark:text-white text-lg font-semibold">
                  {user?.college || <span className="text-slate-400 italic font-normal">Not specified</span>}
                </p>
              )}
            </motion.div>

            {/* Account Info Card */}
            <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <label className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mr-3 shadow-inner">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Account Overview
              </label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Role</span>
                  <span className="text-slate-900 dark:text-white font-bold capitalize text-lg">{user?.role || 'User'}</span>
                </div>
                <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Joined</span>
                  <span className="text-slate-900 dark:text-white font-bold whitespace-nowrap text-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Unknown'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bio Card (Full Width) */}
            <motion.div variants={itemVariants} className="md:col-span-2 p-6 rounded-3xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-2xl border border-white dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <label className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mr-3 shadow-inner">
                  <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                About Me
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Share your interests, skills, and what you're looking for..."
                  className="w-full px-5 py-5 bg-white dark:bg-slate-900/50 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20 dark:focus:ring-amber-500/40 transition-all text-lg font-medium shadow-inner resize-y border border-slate-100 dark:border-slate-800"
                />
              ) : (
                <div className="px-5 py-5 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400/50 group-hover:bg-amber-400 transition-colors"></div>
                  <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-medium min-h-[6rem]">
                    {user?.bio || <span className="text-slate-400 italic text-base">No bio added yet. Tell the community about yourself.</span>}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="mt-12 flex flex-col-reverse sm:flex-row justify-end items-center gap-4"
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-slate-800 border-[3px] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold text-lg"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel changes</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-10 py-4.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 transform skew-x-12 -translate-x-full group-hover:animate-shimmer"></div>
                  <Save className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{loading ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default Profile;
