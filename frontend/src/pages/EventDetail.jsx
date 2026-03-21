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

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, loading, error, fetchEvent, toggleFavorite } = useEvents();
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-500">
      <div className="block md:hidden bg-slate-50 dark:bg-slate-950 min-h-screen pb-[100px] overflow-x-hidden">

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
      {/* DESKTOP VIEW (min-width: 768px)                           */}
      {/* ========================================================= */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-600 to-secondary-600">
          {event.image && (
            <img
              src={getDecodedImage()}
              alt={event.title}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white bg-black/30 hover:bg-black/50 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleShare}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleFavorite}
              className={`p-3 rounded-lg transition-colors ${isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-10 pb-32 md:pb-8">
          <div className="block lg:grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="glass-panel-premium p-6 md:p-10 mb-6 md:mb-8 border border-white/40 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {/* Category & Type */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getCategoryColor(event.category)}`}>
                    {event.category.replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wide border border-black/5 dark:border-white/5">
                    {formatEventType(event.event_type)}
                  </span>
                  {event.featured && (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-sm shadow-amber-500/20 flex items-center gap-1.5">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-[32px] lg:text-[36px] font-black text-slate-900 dark:text-white mb-6 leading-[1.2] tracking-tight max-w-[90%]">
                  {event.title}
                </h1>

                {/* Organizer */}
                <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-[#f8fafc] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-slate-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Organized by</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{event.college}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="prose max-w-none mb-10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    About This Event
                  </h3>
                  <div className="relative">
                    <p className={`text-[15px] text-slate-600 dark:text-slate-300 whitespace-pre-line leading-[1.7] ${!isExpanded && event.description?.length > 400 ? 'line-clamp-[6]' : ''}`}>
                      {event.description}
                    </p>

                    {!isExpanded && event.description?.length > 400 && (
                      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                  
                  {event.description?.length > 400 && (
                    <div className="mt-2">
                       <button 
                         onClick={() => setIsExpanded(!isExpanded)}
                         className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 transition-colors"
                       >
                         {isExpanded ? (
                           <>Read Less <ChevronUp className="w-4 h-4" /></>
                         ) : (
                           <>Read More <ChevronDown className="w-4 h-4" /></>
                         )}
                       </button>
                    </div>
                  )}
                </div>

                {/* Schedule */}
                {event.schedule && event.schedule.length > 0 && (
                  <div className="mb-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Schedule</h3>
                    <div className="space-y-3">
                      {event.schedule.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-[#f8fafc] dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 transition-all hover:shadow-sm">
                          <div className="text-primary-600 dark:text-primary-400 font-black min-w-24 text-[15px]">{item.time}</div>
                          <div className="text-slate-700 dark:text-slate-300 text-[15px] font-medium">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && event.requirements.length > 0 && (
                  <div className="mb-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Requirements</h3>
                    <ul className="space-y-3">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prizes */}
                {event.prizes && event.prizes.length > 0 && (
                  <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Prizes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {event.prizes.map((prize, index) => (
                        <div key={index} className="bg-gradient-to-b from-[#fffbeb] to-white dark:from-amber-900/10 dark:to-slate-800/50 border border-amber-200/60 dark:border-amber-700/30 rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-100 to-transparent dark:from-amber-900/20 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
                          <Award className="w-8 h-8 text-amber-500 dark:text-amber-400 mx-auto mb-3" />
                          <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">{prize.position}</div>
                          <div className="text-sm text-amber-600 dark:text-amber-500 font-bold mt-1">{prize.prize}</div>
                          {prize.amount > 0 && (
                            <div className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                              {formatCurrency(prize.amount)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-panel-premium bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 rounded-[20px] lg:sticky lg:top-[100px] mb-8 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                
                {/* 1. Date Block */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date & Time</p>
                    <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                      {formatDateRange(event.date, event.end_date)}
                    </p>
                    <p className="text-[12px] text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                      {getDaysUntil(event.date)}
                    </p>
                  </div>
                </div>

                {/* 2. Venue Block */}
                {event.venue && (
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Venue</p>
                      <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                        {event.venue}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Location Block */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                      {event.city || 'Location TBA'}
                    </p>
                  </div>
                </div>

                {/* 4. Map Block */}
                {getMapEmbedUrl() && (
                  <div className="mb-6 rounded-[14px] overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <iframe
                      width="100%"
                      height="160"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={getMapEmbedUrl()}
                    ></iframe>
                  </div>
                )}

                {/* Registration Info */}
                <div className="flex items-center justify-between mb-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fee</span>
                    {event.registration_fee > 0 ? (
                      <span className="text-[20px] font-black text-slate-900 dark:text-white">
                        {formatCurrency(event.registration_fee)}
                      </span>
                    ) : (
                      <span className="text-[20px] font-black text-emerald-600 dark:text-emerald-400">FREE</span>
                    )}
                  </div>
                  {event.registration_deadline && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Deadline</span>
                      <span className="text-[14px] font-bold text-slate-900 dark:text-white">
                        {new Date(event.registration_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. CTA Button Desktop */}
                <div className="w-full relative z-10">
                  {(() => {
                    const registrationLink = event.registration_link;
                    if (registrationLink && registrationLink.trim() !== '') {
                      return (
                        <a
                          href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-[48px] w-full items-center justify-center space-x-2 bg-primary-600 text-white rounded-[14px] font-bold hover:bg-primary-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                        >
                          <span className="text-[15px]">Register Now</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      );
                    }
                    return (
                      <button className="flex h-[48px] w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-[14px] font-bold cursor-not-allowed">
                        <span className="text-[15px]">Not Available</span>
                      </button>
                    );
                  })()}
                </div>
                
                {/* Footer links within card */}
                {(event.contact?.email || event.contact?.phone || event.contact?.website || getDirectionsUrl()) && (
                  <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
                    {getDirectionsUrl() && (
                      <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-primary-600 transition-colors tooltip" title="Directions">
                        <Navigation className="w-4 h-4" />
                      </a>
                    )}
                    {event.contact?.website && (
                      <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-primary-600 transition-colors tooltip" title="Website">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {event.contact?.email && (
                      <a href={`mailto:${event.contact.email}`} className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-primary-600 transition-colors tooltip" title="Email">
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              {/* Tags Section moved OUT of the main sticky card */}
              {event.tags && event.tags.length > 0 && (
                <div className="px-2">
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-[999px] text-[12px] font-medium shadow-sm hover:border-primary-200 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div> {/* End Desktop View */}

    </div>
  );
};

export default EventDetail;
