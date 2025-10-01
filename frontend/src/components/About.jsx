// src/components/About.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills } from "../redux/slices/skillSlice";

// Component for the animated skill bar with green fill
const SkillBar = ({ title, percentage }) => {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-sans font-medium text-white mb-2">{title}</h3>
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
        />
      </div>
      <span className="block text-sm font-sans font-medium text-gray-400 mt-1 float-right">
        {percentage}%
      </span>
      <div className="clearfix"></div>
    </motion.div>
  );
};

const About = () => {
  const dispatch = useDispatch();
  const { items: skills, status, error } = useSelector((state) => state.skills);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSkills());
    }
  }, [dispatch, status]);

  return (
    <section id="about" className="s-about pt-24 pb-24 bg-[#0b0a15] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Intro */}
        <motion.div
          className="lg:w-1/2 md:w-2/3 w-full mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="subhead text-primary-orange font-display uppercase tracking-widest text-sm mb-2">
            About Me
          </h3>
          <h1 className="display-1 text-4xl font-bold">
            I'm the kind of person who isn't afraid of challenges.
          </h1>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-x-16">
          {/* Left Column: Profile & Description */}
          <motion.div
            className="w-full mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4">Profile</h3>

            <img
              src="/images/profile-pic.jpg"
              alt="Profile"
              className="w-5/12 h-auto float-right ml-12 mb-5 rounded-lg shadow-lg"
            />

            <p className="text-gray-400 mb-3 text-base leading-relaxed text-justify">
              I am a results-oriented frontend developer with a passion for creating
              engaging and user-friendly digital experiences. My work focuses on
              bridging the gap between design and functionality, ensuring high
              performance and accessibility in all projects.
            </p>
            <p className="text-gray-400 mb-8 text-base leading-relaxed text-justify">
              My background in design allows me to appreciate and execute
              pixel-perfect translations of prototypes into live code, specializing
              in React, Tailwind CSS, and sophisticated animation libraries like
              Framer Motion. I love solving complex UI problems with clean,
              maintainable code.
            </p>
          </motion.div>

          {/* Right Column: Details & Skills */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-4">Details</h3>
            <ul className="text-gray-400 space-y-2 mb-8 text-base">
              <li>
                <span className="font-bold text-white">Email:</span>{" "}
                cherodrick@example.com
              </li>
              <li>
                <span className="font-bold text-white">Phone:</span> +1 (555) 123 4567
              </li>
              <li>
                <span className="font-bold text-white">Freelance:</span> Available
              </li>
              <li>
                <span className="font-bold text-white">Current Location:</span>{" "}
                Global Remote
              </li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">Skills</h3>
            <div className="space-y-4">
              {status === "loading" && (
                <p className="text-gray-400">Loading skills...</p>
              )}
              {status === "failed" && (
                <p className="text-red-500">{error || "Failed to load skills."}</p>
              )}
              {status === "succeeded" &&
                skills.map((skill) => (
                  <SkillBar
                    key={skill._id}
                    title={skill.name}
                    percentage={skill.level}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
