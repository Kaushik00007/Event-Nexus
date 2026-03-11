import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import CollegeCard from './CollegeCard';

const CollegeSection = ({ colleges = [] }) => {
  if (!colleges || colleges.length === 0) {
    return null;
  }

  const displayedColleges = colleges.slice(0, 4);

  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900/10 dark:via-transparent dark:to-slate-900/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <div className="flex items-center space-x-4 mb-3">
              <div className="h-8 lg:h-10 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-950 dark:text-white tracking-tight">
                College Internal Events
              </h2>
            </div>
            <p className="text-slate-600 dark:text-gray-400 ml-5 text-base font-medium">
              Explore events happening at your institution
            </p>
          </div>
          
          <Link
            to="/colleges"
            className="mt-6 lg:mt-0 ml-5 lg:ml-0 inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
          >
            <span>View All Colleges</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
          {displayedColleges.map((college, index) => (
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

export default CollegeSection;
