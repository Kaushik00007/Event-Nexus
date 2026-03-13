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
    <div className="mb-4 sm:mb-8 relative z-20">
      <div className="hidden md:block absolute inset-0 glass-panel-premium -z-10 rounded-2xl"></div>
      <div className="p-0 md:p-6 px-1 sm:px-0">
      {/* Search Bar & Mobile Toggle */}
      {/* Search Bar & Mobile Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-0 sm:mb-6">
        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search events, hackathons..."
              className="w-full pl-11 pr-24 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm sm:text-base shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary-600 dark:bg-primary-500 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20 text-sm font-bold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Mobile Custom Search with Integrated Filter */}
        <div className="md:hidden w-full">
          <div className="custom-search-container !min-h-[50px]">
            <div id="poda">
              <div className="custom-search-glow"></div>
              <div className="custom-search-darkBorderBg"></div>
              <div className="custom-search-darkBorderBg"></div>
              <div className="custom-search-darkBorderBg"></div>
              <div className="custom-search-white"></div>
              <div className="custom-search-border"></div>
              <div id="main">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    placeholder="Search events..."
                    type="text"
                    name="search"
                    className="custom-search-input"
                    value={filters.search}
                    onChange={handleChange}
                  />
                </form>
                <div id="input-mask"></div>
                <div id="pink-mask"></div>
                <div className="filterBorder"></div>
                <button 
                  id="filter-icon"
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`${isExpanded ? 'bg-primary-100 dark:bg-primary-500/20' : ''} transition-colors`}
                >
                  <svg preserveAspectRatio="none" height={20} width={20} viewBox="4.8 4.56 14.832 15.408" fill="none">
                    <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="currentColor" className={`${isExpanded ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-gray-400'}`} strokeWidth={1} strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {hasActiveFilters && !isExpanded && (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </button>
                <div id="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" height={20} fill="none" className="feather feather-search">
                    <circle stroke="url(#search_filter)" r={8} cy={11} cx={11} />
                    <line stroke="url(#searchl_filter)" y2="16.65" y1={22} x2="16.65" x1={22} />
                    <defs>
                      <linearGradient gradientTransform="rotate(50)" id="search_filter">
                        <stop stopColor="#0ea5e9" offset="0%" />
                        <stop stopColor="#d946ef" offset="100%" />
                      </linearGradient>
                      <linearGradient id="searchl_filter">
                        <stop stopColor="#0ea5e9" offset="0%" />
                        <stop stopColor="#d946ef" offset="100%" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Grid - Desktop Always Visible, Mobile Toggleable */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-200 dark:border-white/10 sm:border-0`}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
          {/* Category */}
          <div>
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1 ml-1">Category</label>
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
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1 ml-1">Type</label>
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
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1 ml-1">Location</label>
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
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1 ml-1">Sort</label>
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
            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1 ml-1">Status</label>
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
    </div>
  );
};

export default EventFilters;
