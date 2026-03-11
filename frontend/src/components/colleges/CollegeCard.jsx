import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const CollegeCard = ({ college }) => {
  return (
    <Link
      to={`/colleges/${college.id}/events`}
      className="group flex flex-col w-full aspect-[4/5] sm:aspect-auto glass-panel-premium rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* College Logo/Header */}
      <div className="relative h-28 sm:h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden flex-shrink-0">
        {college.logo ? (
          <div className="w-full h-full flex items-center justify-center p-3 sm:p-6 bg-white/10 backdrop-blur-sm">
            <img
              src={college.logo}
              alt={college.name}
              className="max-h-24 max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center border-b border-white/10">
            <Building2 className="w-16 h-16 text-white/80" strokeWidth={1} />
          </div>
        )}
        {/* Event Count Badge */}
        {college.event_count > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 glass-panel-premium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-lg">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-900 dark:text-white leading-none">
                {college.event_count} <span className="hidden sm:inline">{college.event_count === 1 ? 'Event' : 'Events'}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* College Info */}
      <div className="p-3.5 sm:p-5 flex flex-col flex-grow">
        {/* Short Name Badge */}
        {college.short_name && (
          <div className="hidden md:inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2.5 w-fit tracking-wide">
            {college.short_name}
          </div>
        )}

        {/* College Name */}
        <h3 className="text-[13px] sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[1.75rem] sm:min-h-[2.75rem] leading-tight">
          {college.name}
        </h3>

        {/* Description */}
        {college.description && (
          <p className="hidden md:line-clamp-3 text-sm text-slate-600 dark:text-gray-400 mb-4 min-h-[3.75rem] leading-relaxed">
            {college.description}
          </p>
        )}

        {/* Location */}
        {college.location && (
          <div className="flex items-center text-slate-500 dark:text-gray-400 mb-1.5 sm:mb-4">
            <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="text-[9px] sm:text-xs line-clamp-1">{college.location}</span>
          </div>
        )}

        {/* View Events Button */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-white/10 mt-auto">
          <span className="text-[11px] sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
            View Events
          </span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

CollegeCard.propTypes = {
  college: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    short_name: PropTypes.string,
    logo: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    event_count: PropTypes.number
  }).isRequired
};

export default CollegeCard;
