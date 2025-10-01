// src/components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const userMessage = useSelector((state) => state.auth.userMessage);
  const isAuthenticated = Boolean(userMessage);

  return (
    <footer className="s-footer py-16 bg-[#0b0a15] text-white">
      <div className="max-w-6xl mx-auto px-8">

        <div className="grid md:grid-cols-2 gap-8 items-center border-b border-gray-800 pb-10 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-2">Let's Connect</h3>
            <p className="text-gray-400">cherodrick@example.com</p>
          </div>
          <div className="md:col-span-1 md:text-right">
            <ul className="flex justify-start md:justify-end space-x-4">
              {['Twitter', 'Dribbble', 'Behance'].map((social) => (
                <li key={social}>
                  <a
                    href="#0"
                    title={social}
                    className="text-gray-500 hover:text-[#f9861a] transition-colors duration-200 text-lg"
                  >
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="order-2 sm:order-1 mt-4 sm:mt-0 flex items-center space-x-4">
            <span>
              &copy; Copyright Ethos {currentYear}. Template adapted by Cherodrick.
            </span>
            <span className="text-gray-700">|</span>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-[#f9861a] transition-colors duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-500 hover:text-[#f9861a] transition-colors duration-200"
              >
                Admin Login
              </Link>
            )}
          </div>

          <motion.div
            className="order-1 sm:order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="#hero"
              className="ss-go-top inline-flex items-center space-x-2 text-white hover:text-[#f9861a] transition-colors"
            >
              <span>Back to Top</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;