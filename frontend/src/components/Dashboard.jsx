import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet } from 'react-router-dom'; // 👈 Essential: Link and Outlet

// Ethos Theme Colors (Arbitrary Values)
const ACCENT = '#f9861a';

// Dashboard Navigation Items (These drive the sidebar links)
const dashboardNav = [
  { name: 'Overview', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', to: '/dashboard' },
  { name: 'Works', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', to: '/dashboard/works' },
  { name: 'Testimonials', icon: 'M17 10H7', to: '/dashboard/testimonials' },
  { name: 'Skills & Categories', icon: 'M10 20l4-16', to: '/dashboard/skills' },
  { name: 'Profile Settings', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', to: '/dashboard/settings' },
];

const Dashboard = ({ onLogout }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sidebar component for desktop navigation
  const Sidebar = () => (
    <motion.nav 
      className="hidden lg:flex flex-col w-64 h-full fixed top-0 left-0 bg-[#07070e] border-r border-gray-800 py-8 z-50"
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <h1 className="text-3xl font-display uppercase tracking-widest text-center mb-12" style={{ color: ACCENT }}>
        Admin
      </h1>
      
      <ul className="flex flex-col space-y-2 px-4">
        {dashboardNav.map((item) => (
          <li key={item.name}>
            <Link 
              to={item.to}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* Logout Button (Desktop) */}
      <div className="mt-auto px-4 pt-8">
        <button
          onClick={onLogout} 
          className="w-full text-center py-2 px-4 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-colors rounded-lg"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
  
  // Main Content Wrapper (contains Outlet)
  const MainContentWrapper = () => (
    <div className="lg:ml-64 p-4 md:p-10">
      
      {/* Mobile Top Bar (with Logout and Menu Button) */}
      <div className="lg:hidden flex justify-between items-center mb-8 pt-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onLogout} 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
          <button 
            onClick={() => setMobileNavOpen(true)}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 👈 CRITICAL: This renders the content (DashboardOverview) */}
      <Outlet />
      
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0a15] text-white">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Wrapper (with margin for sidebar) */}
      <MainContentWrapper />

      {/* Mobile Sidebar/Menu Overlay (Fully responsive) */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[999] lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            
            {/* Mobile Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#07070e] z-[1000] lg:hidden 
                         flex flex-col py-8 px-6 shadow-2xl overflow-y-auto" 
            >
              <h3 className="text-3xl font-display uppercase tracking-widest text-center mb-8" style={{ color: ACCENT }}>
                Admin
              </h3>
              
              <ul className="flex flex-col space-y-1 w-full">
                {dashboardNav.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.to}
                      // Close the menu after navigation
                      onClick={() => setMobileNavOpen(false)} 
                      className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-8">
                <button
                  onClick={onLogout} // Logout functionality working here
                  className="w-full text-center py-2 px-4 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-colors rounded-lg"
                >
                  Logout
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default Dashboard;
