// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { downloadCV } from '../redux/slices/cvSlice';

const navItems = [
  { id: '', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'services', name: 'Services' },
  { id: 'portfolio', name: 'Works' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'contact', name: 'Say Hello' },
];

const Header = () => {
  const dispatch = useDispatch();
  const downloadStatus = useSelector((state) => state.cv.downloadStatus);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Change header on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 900);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu
  const handleLinkClick = () => setIsOpen(false);

  // Trigger download via Redux thunk
  const handleDownload = async () => {
    try {
      const blob = await dispatch(downloadCV()).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cherodrick_CV.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CV download failed:', err);
    }
  };

  const headerClasses = isScrolled
    ? 'h-20 py-4 bg-[#0b0a15] shadow-lg'
    : 'h-24 py-6 bg-[#0b0a15]/80 backdrop-blur-sm';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className={`fixed top-0 w-full flex items-center justify-between px-8 text-white transition-all duration-300 ease-in-out z-[999] ${headerClasses}`}
      >
        {/* Logo */}
        <div className="header-logo">
          <a
            href="/"
            className="text-2xl font-display uppercase tracking-widest text-white hover:text-[#f9861a] transition-colors"
          >
            <strong>E</strong>THOS
          </a>
        </div>

        <div className="flex items-center space-x-6">
          {/* Desktop nav */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6 xl:space-x-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-white hover:text-[#f9861a] text-sm font-sans font-medium uppercase tracking-wider transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Download CV button - Desktop */}
          <button
            onClick={handleDownload}
            disabled={downloadStatus === 'loading'}
            className={`hidden lg:block text-sm rounded-full transition-all duration-300 font-sans font-medium uppercase tracking-widest ${
              isScrolled
                ? 'border-[#f9861a] text-[#f9861a] hover:bg-[#f9861a] hover:text-[#0b0a15] px-4 py-1.5 border'
                : 'border-white text-white hover:bg-white hover:text-[#0b0a15] px-5 py-2 border'
            } disabled:opacity-50`}
          >
            {downloadStatus === 'loading' ? 'Downloading…' : 'Download CV'}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="lg:hidden text-white hover:text-[#f9861a] transition-colors duration-200 p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[997] lg:hidden"
              onClick={handleLinkClick}
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#0b0a15] z-[998] flex flex-col items-center py-12 px-8 shadow-2xl overflow-y-auto"
            >
              <h3 className="text-xl font-display uppercase tracking-widest text-[#f9861a] mb-10">
                Navigation
              </h3>

              <nav className="w-full">
                <ul className="space-y-4 text-left">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={handleLinkClick}
                        className="block text-lg py-2 font-sans font-medium uppercase tracking-wider text-white hover:text-[#f9861a] transition-colors duration-200 border-b border-gray-800 last:border-b-0"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Download CV button - Mobile */}
              <button
                onClick={() => {
                  handleDownload();
                  handleLinkClick();
                }}
                disabled={downloadStatus === 'loading'}
                className="mt-12 border border-[#f9861a] text-[#f9861a] hover:bg-[#f9861a] hover:text-[#0b0a15] text-base rounded-full font-sans font-medium uppercase tracking-widest px-8 py-3 transition-all duration-300 disabled:opacity-50"
              >
                {downloadStatus === 'loading' ? 'Downloading…' : 'Download CV'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
