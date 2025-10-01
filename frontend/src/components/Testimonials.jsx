import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../redux/slices/reviewSlice";

const Testimonials = () => {
  const dispatch = useDispatch();
  const { items: reviews, status, error } = useSelector(
    (state) => state.reviews
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchReviews());
    }
  }, [dispatch, status]);

  return (
    <section
      id="testimonials"
      className="relative pt-20 pb-32 bg-gray-950 text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          className="w-full text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="uppercase tracking-widest text-[#f9861a] text-sm font-semibold mb-3">
            Testimonials
          </h3>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            What my clients are saying about my work
          </h1>
        </motion.div>

        {/* Loading / Error States */}
        {status === "loading" && (
          <p className="text-center text-lg text-gray-400 animate-pulse">
            Loading testimonials...
          </p>
        )}
        {status === "failed" && (
          <p className="text-center text-lg text-red-400">
            {error || "Failed to load testimonials."}
          </p>
        )}

        {/* Testimonials */}
        {status === "succeeded" && reviews.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                className="relative bg-white/10 backdrop-blur-lg border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Reviewer Image */}
                {review.image?.url && (
                  <img
                    src={review.image.url}
                    alt={review.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#f9861a] shadow-md mb-4 sm:mb-6"
                  />
                )}

                {/* Quote Icon */}
                <div className="text-[#f9861a] mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 14h.01M14 14h.01M18 14h.01M9 18h6M12 2v2m0 16v2M4.93 4.93l1.42 1.42M16.24 16.24l1.42 1.42M2 12h2m16 0h2M6.34 17.66l1.42-1.42M17.66 6.34l1.42-1.42" />
                  </svg>
                </div>

                {/* Review Message */}
                <p className="text-base sm:text-lg md:text-lg italic text-gray-200 leading-relaxed mb-4 sm:mb-6">
                  “{review.message}”
                </p>

                {/* Reviewer Name */}
                <h4 className="text-lg sm:text-xl md:text-xl font-bold text-white">
                  {review.name}
                </h4>
                {review.role && (
                  <p className="text-sm sm:text-base text-gray-400 mt-1">
                    {review.role}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {status === "succeeded" && reviews.length === 0 && (
          <p className="text-center text-lg text-gray-400">
            No testimonials available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
