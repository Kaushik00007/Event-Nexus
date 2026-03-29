import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Building, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (password.length < 6) return { strength: 0, text: 'Too short', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 1, text: 'Weak', color: 'bg-orange-500' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: 'Strong', color: 'bg-green-500' };
    }
    return { strength: 2, text: 'Medium', color: 'bg-yellow-500' };
  };

  const pwStrength = passwordStrength(formData.password);

  const inputClasses = "w-full pl-11 pr-4 py-3 bg-[#0F1629] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium";

  return (
    <div className="min-h-screen flex bg-[#0B0F1A] text-white overflow-hidden relative font-sans">
      {/* Radial gradient glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none blur-[120px] bg-gradient-to-b from-purple-600 to-transparent" />
      
      {/* Left Panel - Visual/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-[#0B0F1A] to-[#0B0F1A] z-0" />
        
        <div className="relative z-10 flex items-center gap-2">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              EventNexus
            </span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Start your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Journey</span><br />
              with us.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Create an account to join the community of event enthusiasts, organizers, and attendees.
            </p>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} EventNexus. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#111827] border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 my-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">EventNexus</span>
            </Link>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-white">Create an account</h2>
            <p className="text-gray-400 text-sm">Join the community of event enthusiasts</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 overflow-hidden"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-2">
                College / University
              </label>
              <div className="relative group">
                <Building className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="college"
                  name="college"
                  type="text"
                  value={formData.college}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="IIT Delhi"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 h-1.5 bg-[#0F1629] rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full ${pwStrength.color} transition-all duration-300`}
                        style={{ width: `${(pwStrength.strength + 1) * 25}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider w-16 text-right">
                      {pwStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors group-focus-within:text-purple-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Confirm your password"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-start cursor-pointer group pt-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded bg-[#0F1629] border-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 mt-0.5 shrink-0"
                />
              </div>
              <label htmlFor="terms" className="ml-2.5 text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">Privacy Policy</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(139,92,246,0.39)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.23)] hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#111827] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
