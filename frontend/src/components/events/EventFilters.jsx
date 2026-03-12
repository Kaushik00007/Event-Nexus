import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CATEGORIES, EVENT_TYPES, CITIES } from '../../utils/constants';
import IconSelect from '../common/IconSelect';

const EventFilters = ({ filters, setFilters, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      eventType: '',
      city: '',
      search: '',
      upcoming: 'true',
      sort: 'date'
    });
    onSearch();
  };

  const hasActiveFilters = filters.category || filters.eventType || filters.city || (filters.search && filters.search.length > 0);

  return (
    <div className="glass-panel-premium p-4 sm:p-6 mb-6 sm:mb-8 relative z-20">
      {/* Search Bar & Mobile Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-0 sm:mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-grow">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search events, hackathons..."
              className="w-full pl-11 pr-20 sm:pr-24 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm sm:text-base"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary-600 dark:bg-primary-500 text-white px-3 sm:px-4 py-1.5 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 text-xs sm:text-sm font-bold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all md:hidden ${
            isExpanded 
              ? 'bg-primary-600 border-primary-600 text-white shadow-lg' 
              : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Filter className={`w-5 h-5 ${isExpanded ? 'animate-pulse' : ''}`} />
          <span className="font-bold text-sm">{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
          {hasActiveFilters && !isExpanded && (
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Filters Grid - Desktop Always Visible, Mobile Toggleable */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-slate-200 dark:border-white/10 sm:border-0`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Category */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 ml-1">Category</label>
            <IconSelect
              name="category"
              value={filters.category}
              onChange={handleChange}
              options={[
                { value: '', label: 'All Categories' },
                ...CATEGORIES
              ]}
              placeholder="All Categories"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 ml-1">Type</label>
            <IconSelect
              name="eventType"
              value={filters.eventType}
              onChange={handleChange}
              options={[
                { value: '', label: 'All Types' },
                ...EVENT_TYPES
              ]}
              placeholder="All Types"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 ml-1">Location</label>
            <IconSelect
              name="city"
              value={filters.city}
              onChange={handleChange}
              options={[
                { value: '', label: 'All Cities', icon: 'MapPin' },
                ...CITIES.map(city => ({
                  value: city,
                  label: city,
                  icon: city === 'Online' ? 'Globe' : 'MapPin'
                }))
              ]}
              placeholder="All Cities"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 ml-1">Sort</label>
            <IconSelect
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              options={[
                { value: 'date', label: 'Upcoming', icon: 'Calendar' },
                { value: 'latest', label: 'Latest', icon: 'Clock' },
                { value: 'popular', label: 'Popular', icon: 'Zap' },
                { value: 'favorites', label: 'Trending', icon: 'Heart' }
              ]}
            />
          </div>

          {/* Upcoming Toggle */}
          <div>
            <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 ml-1">Status</label>
            <IconSelect
              name="upcoming"
              value={filters.upcoming}
              onChange={handleChange}
              options={[
                { value: 'true', label: 'Upcoming', icon: 'CalendarCheck' },
                { value: '', label: 'All Time', icon: 'Eye' }
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold ring-1 ring-primary-500/20">
                {filters.category.replace('-', ' ')}
                <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))} className="ml-2 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.eventType && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold ring-1 ring-primary-500/20">
                {filters.eventType}
                <button onClick={() => setFilters(prev => ({ ...prev, eventType: '' }))} className="ml-2 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-bold ring-1 ring-primary-500/20">
                {filters.city}
                <button onClick={() => setFilters(prev => ({ ...prev, city: '' }))} className="ml-2 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto text-xs text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center justify-center space-x-1.5 font-black uppercase tracking-widest transition-all px-4 py-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
