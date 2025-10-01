import { motion } from 'framer-motion';
import heroBg from '../assets/Untitled1.jpeg'; // Adjust path if needed

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const headline = [
    "Hello, I'm Che Rodrick,", 
    "A Full Stack Developer & Cybersecurity Student", 
    "currently based in Bamenda, Cameroon"
  ];

  const socials = [
    {
      name: "WhatsApp",
      href: "https://wa.me/653576238",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.52 3.48a11.89 11.89 0 00-16.77 0A11.89 11.89 0 003.48 20.52l-1.4 5.12 5.27-1.38a11.87 11.87 0 005.63 1.43h.02c6.57 0 11.93-5.36 11.93-11.93a11.87 11.87 0 00-3.91-8.76zm-8.47 17.07h-.01c-1.78 0-3.52-.47-5.01-1.36l-.36-.21-3.13.82.84-3.05-.24-.39a9.959 9.959 0 01-1.54-5.04c0-5.52 4.49-10.01 10.01-10.01 2.67 0 5.18 1.04 7.07 2.93a9.99 9.99 0 012.93 7.07c0 5.52-4.49 10.01-10.01 10.01zm5.43-7.01c-.29-.14-1.71-.84-1.97-.94-.26-.11-.45-.14-.64.14-.18.29-.7.94-.85 1.14-.15.21-.3.24-.55.09-.26-.15-1.09-.4-2.08-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.12-.53.13-.13.29-.33.44-.5.15-.17.2-.28.3-.47.09-.18.05-.34-.02-.48-.07-.14-.64-1.54-.88-2.1-.23-.55-.46-.47-.64-.48-.17-.01-.36-.01-.55-.01s-.48.07-.73.34c-.25.26-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.13.18 1.93 2.95 4.67 4.14.65.28 1.15.45 1.54.57.65.2 1.24.17 1.71.1.52-.08 1.71-.7 1.95-1.37.24-.66.24-1.23.17-1.36-.07-.13-.26-.21-.55-.35z"/>
        </svg> 
      )
    },
  ];

  return (
    <section 
      id="hero" 
      className="relative h-screen flex items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }} 
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 text-center sm:text-left">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto sm:mx-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-5xl font-sans font-bold leading-tight mb-4">
            {headline.map((line, index) => (
              <motion.span key={index} variants={itemVariants} className="block">{line}</motion.span>
            ))}
          </h1>

          {/* Social Links */}
          <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="flex justify-center sm:justify-start space-x-6 mt-10">
            {socials.map((social, index) => (
              <motion.li key={social.name} variants={itemVariants} transition={{ delay: 0.4 + index * 0.15 }}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" title={social.name} className="text-white hover:text-[#f9861a] transition-colors duration-200 flex items-center gap-2 text-lg font-display uppercase tracking-widest">
                  {social.icon}
                  <span className="hidden sm:inline">{social.name}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <a href="#about" aria-label="Scroll to About Section" className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#f9861a]">
        <motion.svg animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 24l-8-9h6v-15h4v15h6z"></path>
        </motion.svg>
      </a>
    </section>
  );
};

export default Hero;
