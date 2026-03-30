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

  const inputClasses = "w-full pl-10 pr-4 h-11 bg-[#0F1629]/80 backdrop-blur-md border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium shadow-inner hover:bg-[#0F1629]";

  return (
    <div className="h-screen w-full grid lg:grid-cols-[1.2fr_1fr] bg-[#0B0F1A] text-white overflow-hidden relative font-sans">
      {/* Texture Noise Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* Cinematic Lighting & Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[40%] bg-violet-600/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      {/* Left Panel - Visual/Brand */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 xl:p-20 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent z-0 pointer-events-none" />
        
        {/* Subtle glowing divider edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent shadow-[0_0_25px_rgba(139,92,246,0.5)]" />

        <div className="relative z-10 flex items-center gap-2">
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-sm">
              EventNexus
            </span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-xl mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight">
              Start your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">Journey</span><br />
              with us.
            </h1>
            <p className="text-gray-400 text-xl leading-relaxed font-light">
              Create an account to join the community of event enthusiasts, organizers, and attendees.
            </p>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-sm text-gray-500/80 font-medium">
          © {new Date().getFullYear()} EventNexus. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form (Fixed, strictly no scrolling) */}
      <div className="w-full h-full flex items-start justify-center p-6 relative z-10 pt-[5vh] lg:pt-[10vh] overflow-hidden">
        {/* Soft glow precisely behind the card */}
        <div className="absolute top-[30%] lg:top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[110%] md:w-[100%] md:h-[110%] lg:w-[100%] lg:h-[130%] bg-gradient-to-br from-purple-600/10 via-transparent to-indigo-600/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[500px] bg-[#111827]/80 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] hover:-translate-y-1 hover:shadow-[0_10px_60px_-15px_rgba(139,92,246,0.15)] transition-all duration-500 mx-auto relative overflow-hidden shrink-0"
        >
          {/* Subtle top edge highlight for glass effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">EventNexus</span>
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">Create an account</h2>
            <p className="text-gray-400/80 text-sm">Join the community of event enthusiasts</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 overflow-hidden backdrop-blur-md"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 w-4 h-4 transition-colors group-focus-within:text-purple-400" />
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
              <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 w-4 h-4 transition-colors group-focus-within:text-purple-400" />
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
              <label htmlFor="college" className="block text-xs font-medium text-gray-300 mb-1.5">
                College / University
              </label>
              <div className="relative group">
                <Building className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 w-4 h-4 transition-colors group-focus-within:text-purple-400" />
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
              <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 w-4 h-4 transition-colors group-focus-within:text-purple-400" />
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
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 hover:text-gray-300 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {formData.password && (
                <div className="mt-2 text-xs font-medium tracking-wide flex justify-end text-gray-400/80">
                  <span className={pwStrength.color.replace('bg-', 'text-')} style={{ textShadow: "0 0 10px currentColor" }}>
                    {pwStrength.text}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500/80 w-4 h-4 transition-colors group-focus-within:text-purple-400" />
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
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500/80 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex items-start cursor-pointer group pt-1">
              <div className="flex items-center h-4">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-3.5 w-3.5 rounded bg-[#0F1629]/80 border-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0 mt-0.5 shrink-0 transition-colors"
                />
              </div>
              <label htmlFor="terms" className="ml-2.5 text-xs text-gray-400/90 group-hover:text-gray-300 transition-colors leading-relaxed font-light">
                I agree to the{' '}
                <a href="#" className="text-purple-400/90 font-medium hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] transition-all">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-purple-400/90 font-medium hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] transition-all">Privacy Policy</a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="relative w-full mt-6 h-11 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white fill-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_35px_rgba(139,92,246,0.4)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-[#111827] transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden border border-white/10 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </div>
            </motion.button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400/80 font-medium tracking-wide">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] font-semibold transition-all">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
