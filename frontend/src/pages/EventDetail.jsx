import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Heart,
  Share2,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Award,
  CheckCircle,
  AlertCircle,
  Navigation,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateRange, formatEventType, getCategoryColor, getDaysUntil, formatCurrency } from '../utils/helpers';
import { motion, useScroll, useTransform } from 'motion/react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, loading, error, fetchEvent, toggleFavorite } = useEvents();
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);

  useEffect(() => {
    fetchEvent(id);
  }, [id]);

  useEffect(() => {
    if (currentEvent) {
      setIsFavorite(currentEvent.isFavorited || false);
    }
  }, [currentEvent]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await toggleFavorite(id);
      setIsFavorite(response.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentEvent.title,
        text: currentEvent.description?.substring(0, 100) || '',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-slate-600 dark:text-gray-400 mb-6 font-medium">{error || 'The event you are looking for does not exist.'}</p>
          <Link to="/events" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const event = currentEvent;

  // Generate Google Maps URL
  const getMapEmbedUrl = () => {
    const venue = event.venue || '';
    const city = event.city || '';

    // Create full address
    const fullAddress = [venue, city].filter(Boolean).join(', ');

    if (fullAddress) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };

  const getDirectionsUrl = () => {
    const venue = event.venue || '';
    const city = event.city || '';
    const fullAddress = [venue, city].filter(Boolean).join(', ');

    if (fullAddress) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
    }
    return null;
  };

  // Decode HTML entities in image URL
  const getDecodedImage = () => {
    if (!event.image) return null;
    return event.image.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  };

  const formatDescription = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    return paragraphs.map((p, idx) => (
      <p key={idx} className="mb-5 text-[15px] sm:text-base text-slate-600 dark:text-slate-200 leading-[1.8] font-medium">
        {p}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="block md:hidden min-h-screen pb-[100px] overflow-x-hidden">

        {/* 1 & 2. Hero Section with gradient overlay and bottom-left content */}
        <div className="relative h-[220px] rounded-b-[20px] overflow-hidden shadow-sm">
          {event.image ? (
            <img
              src={getDecodedImage()}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 w-[calc(100%-32px)]">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform border border-white/20">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              <button onClick={handleShare} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform border border-white/20">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={handleFavorite} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white active:scale-95 transition-transform border border-white/20">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-primary-600 uppercase tracking-wider shadow-sm">
                {event.category.replace('-', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 uppercase tracking-wider">
                {formatEventType(event.event_type)}
              </span>
              {event.featured && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500 text-yellow-950 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  ★ Featured
                </span>
              )}
            </div>
            <h1 className="text-[20px] font-bold text-white leading-[1.2] drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* 3. Floating event info card */}
        <div className="mx-4 -mt-8 relative z-20 bg-white dark:bg-slate-900 rounded-[18px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#f0f9ff] dark:bg-blue-900/20 flex items-center justify-center text-[#0284c7] dark:text-blue-400 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Date & Time</p>
              <p className="font-bold text-slate-900 dark:text-white text-[13px]">{formatDateRange(event.date, event.end_date)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#eef2ff] dark:bg-indigo-900/20 flex items-center justify-center text-[#4f46e5] dark:text-indigo-400 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</p>
              <p className="font-bold text-slate-900 dark:text-white text-[13px]">{event.venue || event.city || 'Location TBA'}</p>
            </div>
          </div>
        </div>

        {/* 4. About section */}
        <div className="px-4 mt-6">
          <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-2">About</h3>
          <div className="relative">
            <p className={`text-[13.5px] text-slate-600 dark:text-gray-300 leading-relaxed ${!isExpanded && event.description?.length > 250 ? 'line-clamp-5' : ''}`}>
              {event.description}
            </p>
            {!isExpanded && event.description?.length > 250 && (
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none"></div>
            )}
          </div>
          {event.description?.length > 250 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-primary-600 dark:text-primary-400 font-semibold text-[13px] flex items-center gap-1"
            >
              {isExpanded ? <>Read Less <ChevronUp className="w-3.5 h-3.5" /></> : <>Read More <ChevronDown className="w-3.5 h-3.5" /></>}
            </button>
          )}
        </div>

        {/* 5. Schedule */}
        {event.schedule && event.schedule.length > 0 && (
          <div className="px-4 mt-6">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Schedule</h3>
            <div className="space-y-2">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex space-x-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="font-bold text-primary-600 dark:text-primary-400 text-[13px] min-w-[60px] pt-0.5">{item.time}</div>
                  <div className="text-[13px] text-slate-700 dark:text-gray-300 font-medium leading-tight">{item.activity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {event.requirements && event.requirements.length > 0 && (
          <div className="px-4 mt-6">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Requirements</h3>
            <ul className="space-y-2">
              {event.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-2 text-slate-600 dark:text-gray-300 text-[13.5px]">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prizes */}
        {event.prizes && event.prizes.length > 0 && (
          <div className="px-4 mt-6">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Prizes</h3>
            <div className="space-y-2">
              {event.prizes.map((prize, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/10 dark:to-slate-900 border border-yellow-100 dark:border-yellow-900/30 rounded-xl p-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-slate-900 dark:text-white">{prize.position}</div>
                    <div className="text-[12px] text-yellow-700 dark:text-yellow-500 font-semibold">{prize.prize}</div>
                  </div>
                  {prize.amount > 0 && (
                    <div className="text-[15px] font-black text-slate-900 dark:text-white">
                      {formatCurrency(prize.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Location Map */}
        {getMapEmbedUrl() && (
          <div className="px-4 mt-6">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Location</h3>
            <div className="w-full h-[180px] rounded-[14px] overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <iframe
                title="Event Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={getMapEmbedUrl()}
              ></iframe>
            </div>
            {getDirectionsUrl() && (
              <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 w-full py-3 bg-[#eff6ff] dark:bg-blue-900/20 text-[#2563eb] dark:text-blue-400 rounded-xl font-bold text-[14px] active:scale-[0.98] transition-all">
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            )}
          </div>
        )}

        {/* 7. Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="px-4 mt-6">
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, idx) => (
                <span key={idx} className="text-[11.5px] px-3 py-1.5 rounded-[999px] bg-[#eef2ff] dark:bg-indigo-900/30 text-[#4338ca] dark:text-indigo-300 font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 8. Organizer */}
        <div className="px-4 mt-6 mb-8">
          <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-3">Organizer</h3>
          <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-slate-500 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 dark:text-white text-[14px]">{event.college || 'EventNexus Community'}</p>
              <div className="flex gap-4 mt-1.5">
                {event.contact?.email && <a href={`mailto:${event.contact.email}`} className="text-slate-500 dark:text-gray-400 hover:text-primary-600"><Mail className="w-4 h-4" /></a>}
                {event.contact?.phone && <a href={`tel:${event.contact.phone}`} className="text-slate-500 dark:text-gray-400 hover:text-primary-600"><Phone className="w-4 h-4" /></a>}
                {event.contact?.website && <a href={event.contact.website} className="text-slate-500 dark:text-gray-400 hover:text-primary-600" target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </div>

        {/* 9. Sticky CTA */}
        <div className="fixed bottom-6 left-0 right-0 z-[200] px-6 pointer-events-none">
          <div className="max-w-md mx-auto relative pointer-events-auto">
            {/* Scooped Countdown Tab */}
            {(() => {
              const now = new Date();
              const targetDate = event.registration_deadline ? new Date(event.registration_deadline) : new Date(event.date);
              const daysLeft = Math.max(0, Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)));

              return (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-[-1px] z-[0]">
                  <div className="relative bg-black px-5 py-1.5 rounded-t-2xl flex items-center justify-center space-x-1.5 whitespace-nowrap min-w-[120px]">
                    {/* Left Scoop Curve */}
                    <div className="absolute right-full bottom-0 w-4 h-4 overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 rounded-full border-4 border-black translate-x-1/2 translate-y-1/2"></div>
                    </div>
                    {/* Right Scoop Curve */}
                    <div className="absolute left-full bottom-0 w-4 h-4 overflow-hidden">
                      <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-4 border-black -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <span className="text-[#F97316] font-black text-sm">{daysLeft}</span>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Days Left</span>
                  </div>
                </div>
              );
            })()}

            {/* Button Container (Outer Pill) */}
            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-2 border-slate-900/5 dark:border-white/10 relative z-10 transition-colors">
              {(() => {
                const registrationLink = event.registration_link;
                if (registrationLink && registrationLink.trim() !== '') {
                  return (
                    <a
                      href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-14 items-center justify-center bg-[#0066DB] text-white rounded-[35px] font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
                    >
                      <span>Register</span>
                    </a>
                  );
                }
                return (
                  <button className="w-full h-14 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400 rounded-[35px] font-bold cursor-not-allowed">
                    Not Available
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DESKTOP VIEW (RE-DESIGNED)                                */}
      {/* ========================================================= */}
      <div className="hidden md:block">
        
        {/* Modern Dynamic Hero */}
        <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-slate-950 border-b border-white/5 shadow-2xl">
           <motion.div 
             style={{ scale: heroScale, y: heroY }}
             className="absolute inset-0 origin-bottom"
           >
             {event.image ? (
               <img src={getDecodedImage()} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-blue-900"></div>
             )}
           </motion.div>
           
           {/* Dark Gradient Overlay for readability - stays fixed */}
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none mix-blend-multiply"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
           
           {/* Top Navigation */}
           <div className="absolute top-0 left-0 w-full px-8 py-6 z-20 flex justify-between">
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full font-bold transition-all border border-white/10 shadow-lg group">
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> <span>Back to Events</span>
             </button>
             <div className="flex space-x-3">
               <button onClick={handleShare} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-colors border border-white/10 shadow-lg">
                 <Share2 className="w-5 h-5"/>
               </button>
               <button onClick={handleFavorite} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-colors border border-white/10 shadow-lg">
                 <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}/>
               </button>
             </div>
           </div>

           {/* Immersive Text Anchor (Bottom Left) */}
           <div className="absolute bottom-24 lg:bottom-32 left-0 w-full px-8 lg:px-12 z-20">
             <div className="max-w-7xl mx-auto">
               <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
                 {/* Tags */}
                 <div className="flex flex-wrap items-center gap-3 mb-5">
                   <span className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-md bg-white/90 text-indigo-900 shadow-xl border border-white/30">
                     {event.category.replace('-', ' ')}
                   </span>
                   <span className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/50 text-white shadow-xl border border-white/10">
                     {formatEventType(event.event_type)}
                   </span>
                   {event.featured && (
                     <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-1.5 border border-amber-400">
                       ⭐ Featured
                     </span>
                   )}
                 </div>
                 
                 <h1 className="text-4xl lg:text-5xl xl:text-[64px] font-black text-white leading-[1.1] max-w-4xl tracking-tight drop-shadow-2xl">
                   {event.title}
                 </h1>
                 
                 <div className="mt-8 flex flex-wrap items-center gap-6">
                    <div className="flex items-center space-x-2.5 text-slate-100 font-semibold bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                       <Calendar className="w-5 h-5 text-indigo-400" />
                       <span className="text-[15px]">{formatDateRange(event.date, event.end_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-slate-100 font-semibold bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                       <Users className="w-5 h-5 text-indigo-400" />
                       <span className="text-[15px]">By {event.college || 'Community'}</span>
                    </div>
                 </div>
               </motion.div>
             </div>
           </div>
        </div>
        
        {/* Floating Content Layout */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20 relative z-30 pb-24">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* LEFT CONTENT (2/3) */}
            <div className="xl:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[32px] p-8 lg:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.4)] border border-slate-100 dark:border-white/5 relative overflow-hidden">
                
                {/* Decorative blob highlight inside card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                      <AlertCircle className="w-4 h-4" />
                    </span>
                    About This Event
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {formatDescription(event.description)}
                  </div>
                </div>

                {/* Schedule */}
                {event.schedule && event.schedule.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                        <Clock className="w-4 h-4" />
                      </span>
                      Schedule
                    </h3>
                    <div className="grid gap-3">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors shadow-sm group">
                          <div className="text-indigo-600 dark:text-indigo-400 font-black min-w-[100px] text-lg mb-1 sm:mb-0 group-hover:scale-105 transition-transform origin-left">{item.time}</div>
                          <div className="text-slate-800 dark:text-slate-200 text-base font-medium">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && event.requirements.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mr-3 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      Requirements
                    </h3>
                    <ul className="grid gap-4">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-slate-700 dark:text-slate-300 text-base leading-relaxed p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 mr-3" />
                          <span className="font-semibold">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prizes */}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800 relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mr-3 text-amber-600 dark:text-amber-400">
                        <Award className="w-4 h-4" />
                      </span>
                      Prizes & Rewards
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {event.prizes.map((prize, index) => (
                        <div key={index} className="bg-gradient-to-b from-[#fffbeb] to-white dark:from-amber-900/20 dark:to-slate-800/80 border border-amber-200 dark:border-amber-700/50 rounded-2xl p-6 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200 to-transparent dark:from-amber-500/20 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                          <div className="relative z-10">
                            <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white dark:ring-slate-800">
                              <Award className="w-7 h-7 text-amber-500 dark:text-amber-400" />
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-wider">{prize.position}</div>
                            <div className="text-sm text-amber-700 dark:text-amber-500 font-bold mt-1 max-w-[90%] mx-auto">{prize.prize}</div>
                            {prize.amount > 0 && (
                              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-4 drop-shadow-sm">
                                {formatCurrency(prize.amount)}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </div>

            {/* RIGHT SIDEBAR (1/3) */}
            <div className="xl:col-span-1">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="sticky top-28 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[32px] p-8 shadow-[0_20px_50px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 relative z-20">

                <div className="space-y-6">
                  {/* Date Container */}
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 shadow-inner ring-1 ring-indigo-100 dark:ring-indigo-900/50">
                      <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">When</p>
                      <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                        {formatDateRange(event.date, event.end_date)}
                      </p>
                      <p className="text-[13px] text-indigo-600 dark:text-indigo-400 font-black mt-1.5 bg-indigo-50 dark:bg-indigo-900/30 inline-block px-2.5 py-0.5 rounded-md">
                        {getDaysUntil(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Venue Container */}
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 shadow-inner ring-1 ring-emerald-100 dark:ring-emerald-900/50">
                      <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Where</p>
                      <p className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                        {event.venue || 'TBA'}
                      </p>
                      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                        {event.city || 'Loading location'}
                      </p>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800/80 my-2" />

                  {/* Pricing / Cutoff */}
                  <div className="flex justify-between items-end bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fee</span>
                      {event.registration_fee > 0 ? (
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(event.registration_fee)}</span>
                      ) : (
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">FREE</span>
                      )}
                    </div>
                    {event.registration_deadline && (
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Deadline</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {new Date(event.registration_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Map snippet */}
                  {getMapEmbedUrl() && (
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 h-40 group relative">
                       <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors pointer-events-none z-10"></div>
                       <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getMapEmbedUrl()}
                      ></iframe>
                    </div>
                  )}

                  {/* Gradient CTA */}
                  <div className="w-full pt-2">
                    {(() => {
                      const registrationLink = event.registration_link;
                      if (registrationLink && registrationLink.trim() !== '') {
                        return (
                          <div className="relative group/cta">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[20px] blur opacity-40 group-hover/cta:opacity-75 transition duration-500 group-hover/cta:duration-200"></div>
                            <a
                              href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-14 sm:h-16 rounded-[16px] font-black text-lg hover:shadow-xl hover:scale-[1.02] transform transition-all active:scale-95 shadow-indigo-600/30"
                            >
                              <span>Register Now</span>
                              <ExternalLink className="w-5 h-5 ml-1 drop-shadow-md" />
                            </a>
                          </div>
                        );
                      }
                      return (
                        <button className="flex h-16 w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-[16px] font-bold cursor-not-allowed">
                          <span className="text-base">Registrations Closed</span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Footers Contexts */}
                  <div className="flex justify-center gap-4 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                     {getDirectionsUrl() && (
                      <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors shadow-sm ring-1 ring-slate-100 dark:ring-slate-800" title="Directions">
                        <Navigation className="w-4 h-4" />
                      </a>
                     )}
                     {event.contact?.website && (
                      <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors shadow-sm ring-1 ring-slate-100 dark:ring-slate-800" title="Website">
                        <Globe className="w-4 h-4" />
                      </a>
                     )}
                     {event.contact?.email && (
                      <a href={`mailto:${event.contact.email}`} className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors shadow-sm ring-1 ring-slate-100 dark:ring-slate-800" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                     )}
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
