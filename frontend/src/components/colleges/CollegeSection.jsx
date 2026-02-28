import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';

const CollegeSection = ({ colleges = [] }) => {
  if (!colleges || colleges.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900/10 dark:via-transparent dark:to-slate-900/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
                College Internal Events
              </h2>
            </div>
            <p className="text-slate-950 dark:text-gray-400 ml-16 text-base font-bold">
              Explore events happening at your institution
            </p>
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {colleges.map((college, index) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex"
            >
              <CollegeCard college={college} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CollegeCard = ({ college }) => {
  return (
    <Link
      to={`/colleges/${college.id}/events`}
      className="group flex flex-col w-full glass-panel-premium rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* College Logo/Header */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden flex-shrink-0">
        {college.logo ? (
          <div className="w-full h-full flex items-center justify-center p-8 bg-white/10 backdrop-blur-sm">
            <img
              src={college.logo}
              alt={college.name}
              className="max-h-32 max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center border-b border-white/10">
            <Building2 className="w-20 h-20 text-white/80" strokeWidth={1} />
          </div>
        )}
        {/* Event Count Badge */}
        {college.event_count > 0 && (
          <div className="absolute top-4 right-4 glass-panel-premium px-3 py-1.5 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                {college.event_count} {college.event_count === 1 ? 'Event' : 'Events'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* College Info */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Short Name Badge */}
        {college.short_name && (
          <div className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold mb-3 w-fit tracking-wide">
            {college.short_name}
          </div>
        )}

        {/* College Name */}
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
          {college.name}
        </h3>

        {/* Description */}
        {college.description && (
          <p className="text-base text-slate-600 dark:text-gray-400 mb-4 line-clamp-3 min-h-[4.5rem] leading-relaxed">
            {college.description}
          </p>
        )}

        {/* Location */}
        {college.location && (
          <div className="flex items-center text-slate-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{college.location}</span>
          </div>
        )}

        {/* View Events Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
            View Events
          </span>
          <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

CollegeSection.propTypes = {
  colleges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      short_name: PropTypes.string,
      logo: PropTypes.string,
      description: PropTypes.string,
      location: PropTypes.string,
      event_count: PropTypes.number
    })
  )
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

export default CollegeSection;
