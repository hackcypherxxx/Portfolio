// src/components/CTA.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    // Section uses the deep dark black background (#0b0a15)
    <section id="cta" className="s-cta py-24 bg-[#0b0a15] text-white">
      <div className="max-w-4xl mx-auto px-8 text-center">
        
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-6 leading-snug"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Ready to start your next big project?
        </motion.h2>

        <motion.p
          className="text-xl text-gray-400 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I’m currently available for freelance work and new collaborations.
        </motion.p>

        <motion.a 
          href="#contact"
          className="inline-block border-2 border-[#f9861a] text-white bg-[#f9861a] 
                     hover:bg-transparent hover:text-[#f9861a] 
                     text-lg font-bold uppercase tracking-wider px-10 py-4 rounded-full 
                     transition-all duration-300 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.4 }}
        >
          Say Hello!
        </motion.a>

      </div>
    </section>
  );
};

export default CTA;