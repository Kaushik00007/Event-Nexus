import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { getCategoryIcon, getCategoryColor, formatDate, formatEventType } from '../../utils/helpers';
import { useState } from 'react';

const EventCard = ({ event }) => {
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle both MongoDB (_id) and Supabase (id) formats
  const eventId = event.id || event._id;

  // Decode HTML entities in image URL
  const getDecodedImage = () => {
    if (!event.image) return null;
    return event.image.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  };

  // Check if event is in user's favorites
  const isFavorite = localFavorite || user?.favorites?.some(fav =>
    (typeof fav === 'string' ? fav : fav.id || fav._id) === eventId
  );

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setIsLoading(true);
    try {
      const response = await toggleFavorite(eventId);
      setLocalFavorite(response.isFavorited);

      // Show success animation
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setIsLoading(false);
    }
  };

  const CategoryIcon = getCategoryIcon(event.category);
  const categoryColor = getCategoryColor(event.category);

  // Category-specific gradient backgrounds for events without images
  const getCategoryGradient = () => {
    const gradients = {
      'hackathon': 'from-purple-600 via-pink-600 to-red-600',
      'workshop': 'from-blue-600 via-cyan-600 to-teal-600',
      'networking': 'from-green-600 via-emerald-600 to-lime-600',
      'seminar': 'from-indigo-600 via-purple-600 to-pink-600',
      'tech-talk': 'from-cyan-600 via-blue-600 to-indigo-600',
      'coding-contest': 'from-orange-600 via-red-600 to-pink-600',
      'academic': 'from-blue-700 via-indigo-700 to-purple-700',
      'other': 'from-gray-600 via-gray-700 to-gray-800'
    };
    return gradients[event.category] || gradients['other'];
  };

  return (
    <Link to={`/events/${eventId}`}>
      <div className="glass-panel-premium rounded-2xl overflow-hidden group h-full flex flex-col">
        {/* Image Section */}
        <div className={`relative h-56 overflow-hidden ${event.image && !imageError ? '' : `bg-gradient-to-br ${getCategoryGradient()}`}`}>
          {event.image && !imageError ? (
            <img
              src={getDecodedImage()}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
              <div className="bg-white/10 backdrop-blur-md rounded-full p-5 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <CategoryIcon className="w-12 h-12 text-white/90" />
              </div>
            </div>
          )}

          {/* Overlay for better text readability (Gradient) */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#171717] to-transparent opacity-80" />

          {/* Category Badge - Minimalist */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white tracking-wider uppercase">
              {event.category.replace('-', ' ')}
            </span>
          </div>

          {/* Favorite Button - Glass Style */}
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${isFavorite
              ? 'bg-yellow-400 border-yellow-400 text-white'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-tight line-clamp-2 max-w-[70%]">
              {event.title}
            </h3>
            {event.featured && (
              <span className="featured-pill flex-shrink-0">
                Featured
              </span>
            )}
          </div>

          <p className="text-slate-700 dark:text-gray-300 text-sm mb-6 line-clamp-2 flex-grow font-semibold">
            {event.description || 'Join us for this exciting event! Details and registration information available below.'}
          </p>

          <div className="space-y-4 mb-6">
            {/* Minimalist Info Row */}
            <div className="flex items-center justify-between text-[11px] font-bold tracking-wide">
              <div className="flex items-center text-slate-500 dark:text-gray-400 uppercase">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-slate-500 dark:text-gray-400 uppercase">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                {event.city || 'Online'}
              </div>
            </div>

            <div className="h-px bg-slate-200/50 dark:bg-white/10 w-full" />
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <div className="glass-button-primary dark:bg-white/10 dark:text-white dark:border-white/20">
              View Event
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
