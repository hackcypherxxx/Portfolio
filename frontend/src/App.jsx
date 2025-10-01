// src/App.jsx
import React, { useState } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/slices/authSlice'; 

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Pages
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// NEW: Import Dashboard Sub-Pages
import DashboardOverview from './pages/DashboardOverviewPage';
import WorksPage from './pages/WorksManagementPage';
import TestimonialsPage from './pages/TestimonialsManagementPage';
import SkillsPage from './pages/SkillsManagementPage';
import SettingsPage from './pages/ProfileSettingsPage';

// Import portfolio sections for the main route
import Hero from './components/Hero';
import About from './components/About'; 
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Contact from './components/Contact';


// --- Shared Layout for Main Portfolio ---
const MainLayout = () => (
  <>
    <Header />
    <main>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials /> 
      <CTA />
      <Contact />
    </main>
    <Footer />
  </>
);


// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
  // Assuming 'userMessage' being present means the user is authenticated
  const isAuth = Boolean(useSelector((state) => state.auth.userMessage));
  
  if (!isAuth) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Redirects to /dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const isAuth = Boolean(useSelector((state) => state.auth.userMessage));
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};


function App() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch your Redux logout action
    dispatch(logout());
  };

  const wrapperClass = isLoading 
      ? 'invisible h-screen overflow-hidden' 
      : 'visible min-h-screen bg-[#0b0a15] text-white';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0 : 1 }}
      transition={{ duration: 0.5, delay: isLoading ? 0 : 0.8 }}
      className={wrapperClass} 
    >
      <Routes>
        {/* Route for the Main Portfolio (Home) */}
        <Route path="/" element={<MainLayout />} />
        
        {/* Route for the Login Page */}
        <Route path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        {/* Dashboard Parent Route (provides layout and auth protection) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {/* Dashboard component provides the layout (Sidebar, Mobile menu) */}
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        >
          {/* Nested Routes (content rendered inside Dashboard's <Outlet />) */}
          
          {/* Renders at the root: /dashboard */}
          <Route index element={<DashboardOverview />} /> 
          
          {/* Specific section routes: /dashboard/works, /dashboard/skills, etc. */}
          <Route path="works" element={<WorksPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </motion.div>
  );
}

export default App;