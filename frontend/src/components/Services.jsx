// src/components/Services.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Component for a single service item
const ServiceItem = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      className="col-span-1"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <div className="text-center md:text-left">
        {/* FIX: Replaced bg-primary-orange with bg-[#f9861a] */}
        <div className="inline-block p-4 rounded-full bg-[#f9861a] text-white mb-6">
          {icon}
        </div>
        
        <h3 className="text-2xl font-sans font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-lg">
          {description}
        </p>
      </div>
    </motion.div>
  );
};


const Services = () => {
  
  // Data for the three main service blocks
  const servicesData = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      ),
      title: 'Web Development',
      description: 'Building modern, fast, and scalable web applications using the latest frameworks like React and Vue, focused on performance and mobile responsiveness.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      title: 'UI/UX Design',
      description: 'Designing intuitive and aesthetically pleasing user interfaces. Focusing on user flows, wireframing, and interactive prototypes in tools like Figma.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      title: 'Technical Consulting',
      description: 'Providing expert guidance on technology stack decisions, code architecture review, performance optimization, and developer workflow improvements.',
    },
  ];

  return (
    // FIX: Replaced bg-background-dark with bg-[#0b0a15]
    <section id="services" className="s-services pt-32 pb-32 bg-[#0b0a15] text-white">
      <div className="max-w-6xl mx-auto px-8">
        
        {/* Section Intro (Matches original styling) */}
        <motion.div 
          className="lg:w-1/2 md:w-2/3 w-full mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {/* Subhead class matches the style */}
          {/* FIX: Replaced text-primary-orange with text-[#f9861a] */}
          <h3 className="subhead text-[#f9861a] font-display uppercase tracking-widest text-sm mb-2">My Services</h3>
          {/* Display-1 class matches the large, heavy headline */}
          <h1 className="display-1 text-4xl font-bold">
            I bring a blend of design sensibility and engineering expertise to every project.
          </h1>
        </motion.div>

        {/* Services List (Three-column grid on large screens) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-x-8 lg:gap-x-12">
          {servicesData.map((item, index) => (
            <ServiceItem 
              key={item.title} 
              icon={item.icon} 
              title={item.title} 
              description={item.description} 
              // Staggered delay for the fade-up effect
              delay={0.1 + index * 0.15} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;