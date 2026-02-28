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
  Navigation
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-panel-premium p-6 md:p-8 mb-8">
              {/* Category & Type */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                  {event.category.replace('-', ' ').toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                  {formatEventType(event.event_type)}
                </span>
                {event.featured && (
                  <span className="px-3 py-1 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-bold border border-yellow-500/20">
                    ⭐ FEATURED
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-950 dark:text-white mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-100/50 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Organized by</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{event.college}</p>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-3">About This Event</h3>
                <p className="text-slate-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-4">Schedule</h3>
                  <div className="space-y-3">
                    {event.schedule.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 transition-colors">
                        <div className="text-primary-600 dark:text-primary-400 font-bold min-w-24">{item.time}</div>
                        <div className="text-slate-700 dark:text-gray-300">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {event.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-slate-600 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prizes */}
              {event.prizes && event.prizes.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-4">Prizes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {event.prizes.map((prize, index) => (
                      <div key={index} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-800/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4 text-center">
                        <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-slate-950 dark:text-white">{prize.position}</div>
                        <div className="text-yellow-700 dark:text-yellow-300 font-bold">{prize.prize}</div>
                        {prize.amount > 0 && (
                          <div className="text-2xl font-black text-slate-950 dark:text-white mt-1">
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
            {/* Event Details Card */}
            <div className="glass-panel-premium p-6 mb-6 sticky top-24">
              {/* Date */}
              <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="w-12 h-12 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Date</p>
                  <p className="font-bold text-slate-950 dark:text-white">
                    {formatDateRange(event.date, event.end_date)}
                  </p>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-bold">
                    {getDaysUntil(event.date)}
                  </p>
                </div>
              </div>

              {/* Venue */}
              {event.venue && (
                <div className="flex items-start space-x-4 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="w-12 h-12 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-gray-400">Venue</p>
                    <p className="font-bold text-slate-950 dark:text-white">
                      {event.venue}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="w-12 h-12 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 dark:text-gray-400">Location</p>
                    <p className="font-bold text-slate-950 dark:text-white">{event.city || 'Location TBA'}</p>
                    {event.college && (
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        {event.college}
                      </p>
                    )}
                  </div>
                </div>

                {/* Google Maps Embed */}
                {getMapEmbedUrl() && (
                  <div className="mt-3">
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={getMapEmbedUrl()}
                      className="shadow-sm"
                    ></iframe>

                    {/* Get Directions Button */}
                    {getDirectionsUrl() && (
                      <a
                        href={getDirectionsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full flex items-center justify-center space-x-2 bg-blue-600/10 dark:bg-blue-500/10 hover:bg-blue-600/20 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 py-2 px-4 rounded-lg text-sm font-bold transition-all border border-blue-500/20"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Get Directions</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Registration Fee */}
              <div className="flex items-start space-x-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="w-12 h-12 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Registration Fee</p>
                  {event.registration_fee > 0 ? (
                    <p className="text-2xl font-black text-slate-950 dark:text-white">
                      {formatCurrency(event.registration_fee)}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">FREE</p>
                  )}
                </div>
              </div>

              {/* Register Button */}
              {(() => {
                const registrationLink = event.registration_link;
                if (registrationLink && registrationLink.trim() !== '') {
                  return (
                    <a
                      href={registrationLink.startsWith('http') ? registrationLink : `https://${registrationLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-primary-600 dark:bg-primary-500 text-white py-3 px-6 rounded-lg font-bold hover:bg-primary-700 dark:hover:bg-primary-600 transition-all mb-4 shadow-lg shadow-primary-500/20"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  );
                }
                return (
                  <button className="w-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-400 py-3 px-6 rounded-lg font-bold cursor-not-allowed mb-4">
                    Registration Not Available
                  </button>
                );
              })()}

              {/* Registration Deadline */}
              {event.registration_deadline && (
                <p className="text-sm text-center text-slate-500 dark:text-gray-400 font-medium">
                  Register before: {new Date(event.registration_deadline).toLocaleDateString()}
                </p>
              )}

              {/* Contact Info */}
              {(event.contact?.email || event.contact?.phone || event.contact?.website) && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                  <h4 className="font-bold text-slate-950 dark:text-white mb-3">Contact</h4>
                  <div className="space-y-2">
                    {event.contact.email && (
                      <a href={`mailto:${event.contact.email}`} className="flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">{event.contact.email}</span>
                      </a>
                    )}
                    {event.contact.phone && (
                      <a href={`tel:${event.contact.phone}`} className="flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-medium">{event.contact.phone}</span>
                      </a>
                    )}
                    {event.contact.website && (
                      <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-slate-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">Visit Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5">
                  <h4 className="font-bold text-slate-950 dark:text-white mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
