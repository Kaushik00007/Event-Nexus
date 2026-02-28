import { Search, Filter, X } from 'lucide-react';
import { CATEGORIES, EVENT_TYPES, CITIES } from '../../utils/constants';
import IconSelect from '../common/IconSelect';

const EventFilters = ({ filters, setFilters, onSearch }) => {
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

  const hasActiveFilters = filters.category || filters.eventType || filters.city || filters.search;

  return (
    <div className="glass-panel-premium p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search events, hackathons, workshops..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">Category</label>
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
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">Event Type</label>
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
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">City</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">All Cities</option>
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="date">Date (Upcoming)</option>
            <option value="latest">Latest Added</option>
            <option value="popular">Most Popular</option>
            <option value="favorites">Most Favorited</option>
          </select>
        </div>

        {/* Upcoming Toggle */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-gray-300 mb-1.5">Show</label>
          <select
            name="upcoming"
            value={filters.upcoming}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="true">Upcoming Events</option>
            <option value="">All Events</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {filters.category.replace('-', ' ')}
                <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.eventType && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {filters.eventType}
                <button onClick={() => setFilters(prev => ({ ...prev, eventType: '' }))} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                {filters.city}
                <button onClick={() => setFilters(prev => ({ ...prev, city: '' }))} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                "{filters.search}"
                <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="ml-2">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1.5 font-bold transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
