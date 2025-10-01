import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Theme Colors
const ACCENT = '#f9861a';
const DARK = '#0b0a15';
const OFF_DARK = '#07070e';

// Card component
const StatCard = ({ title, value, color, buttonText, to }) => (
  <motion.div
    className="p-6 rounded-xl shadow-xl border border-gray-800 flex flex-col justify-between h-48 sm:h-auto"
    style={{ backgroundColor: DARK }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">{title}</h3>
      <p className="text-5xl font-extrabold text-white mb-6">{value}</p>
    </div>
    <Link 
      to={to}
      className="text-sm font-semibold transition-colors hover:text-white inline-block mt-auto"
      style={{ color: color }}
    >
      {buttonText} →
    </Link>
  </motion.div>
);

const DashboardOverview = () => {
  // Fetch data from Redux store
  const works = useSelector(state => state.works.items || []);
  const testimonials = useSelector(state => state.reviews.items || []);
  const skills = useSelector(state => state.skills.items || []);
  const messages = useSelector(state => state.contact.items || []);

  // Compute exact counts
  const totalWorks = works.length;
  const pendingReviews = testimonials.filter(t => t.status === 'pending').length;
  const activeSkills = skills.length;
  const newMessages = messages.filter(m => !m.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Desktop Welcome/Greeting */}
      <div className="hidden lg:block">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-gray-400">
          Welcome back, Cherodrick. Last login: {/* Pull from auth slice if available */}
        </p>
      </div>
      <div className="lg:hidden">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Works"
          value={totalWorks}
          color={ACCENT}
          buttonText="Manage Projects"
          to="/dashboard/works"
        />
        <StatCard 
          title="Pending Reviews"
          value={pendingReviews}
          color="#10b981" // Green
          buttonText="Approve Testimonials"
          to="/dashboard/testimonials"
        />
        <StatCard 
          title="Active Skills"
          value={activeSkills}
          color="#3b82f6" // Blue
          buttonText="Update Skills List"
          to="/dashboard/skills"
        />
        <StatCard 
          title="New Messages"
          value={newMessages}
          color="#f43f5e" // Red/Pink
          buttonText="View Contact Inbox"
          to="/dashboard/messages"
        />
      </div>

      {/* Quick Access Management Sections */}
      <div className="space-y-6">
        {/* Work Management */}
        <motion.div 
          className={`bg-[${OFF_DARK}] p-8 rounded-xl border border-gray-800 shadow-lg`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>Work Management</h3>
          <p className="text-gray-400 mb-6">
            Quickly add new projects, edit existing entries, and reorder your portfolio items here.
          </p>
          <Link to="/dashboard/works" className="mt-4 px-6 py-2 bg-[#f9861a] text-white font-semibold rounded-full hover:bg-opacity-85 transition-colors inline-block shadow-md">
            Go to Works Page
          </Link>
        </motion.div>

        {/* Testimonial Approval Queue */}
        <motion.div 
          className={`bg-[${OFF_DARK}] p-8 rounded-xl border border-gray-800 shadow-lg`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{ color: ACCENT }}>Testimonial Approval Queue</h3>
          <p className="text-gray-400 mb-6">
            Review and publish client testimonials. Requires verification before going live on the site.
          </p>
          <Link to="/dashboard/testimonials" className="mt-4 px-6 py-2 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition-colors inline-block shadow-md">
            View Queue ({pendingReviews})
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
