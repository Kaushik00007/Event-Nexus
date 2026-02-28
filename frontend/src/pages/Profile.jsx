import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Edit2, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-transparent py-8 transition-colors duration-500">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Profile Settings</h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">Manage your account information</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 dark:text-green-400 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel-premium overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>

          {/* Avatar & Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="-mt-16 mb-4 sm:mb-0">
                <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-full border-4 border-white dark:border-white/10 shadow-lg flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Email */}
              <div className="flex-1 sm:pb-4">
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{user?.name}</h2>
                <p className="text-slate-600 dark:text-gray-400 flex items-center space-x-2 font-medium">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </p>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 sm:mt-0 sm:mb-4 flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 transition-all font-bold backdrop-blur-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                  <User className="w-4 h-4 inline mr-1 text-primary-600 dark:text-primary-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-lg text-slate-900 dark:text-white font-medium">{user?.name}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                  <Building className="w-4 h-4 inline mr-1 text-primary-600 dark:text-primary-400" />
                  College
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Your college name"
                    className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                ) : (
                  <p className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-lg text-slate-900 dark:text-white font-medium">
                    {user?.college || 'Not specified'}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              ) : (
                <p className="px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-lg text-slate-900 dark:text-white min-h-24 font-medium leading-relaxed">
                  {user?.bio || 'No bio added yet'}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">
                <Mail className="w-4 h-4 inline mr-1 text-slate-400 dark:text-gray-500" />
                Email Address
              </label>
              <p className="px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-gray-400 font-medium italic">
                {user?.email}
                <span className="ml-2 text-xs text-slate-400 dark:text-gray-500">(Cannot be changed)</span>
              </p>
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
                  <span className="text-slate-600 dark:text-gray-400 font-medium">Account Type</span>
                  <span className="font-bold text-slate-950 dark:text-white capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
                  <span className="text-slate-600 dark:text-gray-400 font-medium">Member Since</span>
                  <span className="font-bold text-slate-950 dark:text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-bold"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20 disabled:opacity-50 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
