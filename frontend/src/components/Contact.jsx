// src/components/Contact.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { sendContact } from '../redux/slices/contactSlice';

const Contact = () => {
  const dispatch = useDispatch();
  const { status, error, message: successMessage } = useSelector(
    (state) => state.contact
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  // Clear form on successful submit
  useEffect(() => {
    if (status === 'succeeded') {
      setName('');
      setEmail('');
      setMessage('');
      setImage(null);
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    if (image) formData.append('image', image);

    dispatch(sendContact(formData));
  };

  return (
    <section
      id="contact"
      className="s-contact pt-32 pb-32 bg-[#0b0a15] text-white"
    >
      <div className="max-w-6xl mx-auto px-8">
        {/* Intro */}
        <motion.div
          className="lg:w-1/2 md:w-2/3 w-full mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="subhead text-[#f9861a] font-display uppercase tracking-widest text-sm mb-2">
            Get In Touch
          </h3>
          <h1 className="display-1 text-4xl font-bold">
            I would love to hear from you. Let's work together!
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-x-16">
          {/* Form */}
          <motion.div
            className="w-full mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Send Me a Message</h3>

            {error && (
              <p className="mb-4 text-red-500">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="mb-4 text-green-400">
                {successMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-[#f9861a] focus:ring-[#f9861a] transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-[#f9861a] focus:ring-[#f9861a] transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Your Message"
                  className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-[#f9861a] focus:ring-[#f9861a] transition-colors"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <p className='text-xl text-amber-300'>
                Please Upload an image if you want to send a review
              </p>
              <div>
                <input
                  placeholder="Upload image for reviews placement"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0] || null)}
                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-[#f9861a] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full border-2 border-[#f9861a] text-white bg-[#f9861a] hover:bg-transparent hover:text-[#f9861a] text-lg font-bold uppercase tracking-wider px-10 py-4 rounded-full transition-all duration-300 disabled:opacity-50"
              >
                {status === 'loading' ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Socials */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-6 text-lg">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="text-[#f9861a] pt-1">
                  {/* svg */}
                </div>
                <div>
                  <h4 className="font-bold text-white">Email</h4>
                  <p className="text-gray-400">cherodrick@example.com</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="text-[#f9861a] pt-1">
                  {/* svg */}
                </div>
                <div>
                  <h4 className="font-bold text-white">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123 4567</p>
                </div>
              </div>
              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="text-[#f9861a] pt-1">
                  {/* svg */}
                </div>
                <div>
                  <h4 className="font-bold text-white">Location</h4>
                  <p className="text-gray-400">Global Remote / Available for travel</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-10 mb-4">I'm also on</h3>
            <ul className="flex space-x-4">
              {['Twitter', 'Dribbble', 'Behance', 'Instagram'].map((social) => (
                <li key={social}>
                  <a
                    href="#0"
                    title={social}
                    className="text-gray-400 hover:text-[#f9861a] transition-colors duration-200"
                  >
                    {/* placeholder svg */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 17.5l-5-5L8.5 13 10 14.5 15.5 9 17 10.5 10 17.5z" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;