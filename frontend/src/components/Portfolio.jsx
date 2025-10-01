import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorks } from "../redux/slices/workSlice";
import { fetchCategories } from "../redux/slices/categorySlice";

const Portfolio = () => {
  const dispatch = useDispatch();
  const { items: works, status: worksStatus, error: worksError } = useSelector(
    (state) => state.works
  );
  const { items: categories, status: categoriesStatus, error: categoriesError } = useSelector(
    (state) => state.categories
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    if (worksStatus === "idle") dispatch(fetchWorks());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, worksStatus, categoriesStatus]);

  // Filtering
  const filteredItems =
    activeFilter === "All"
      ? works
      : works.filter((item) => item.category?.name === activeFilter);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="portfolio" className="pt-32 pb-32 bg-[#0b0a15] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section Intro */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-[#f9861a] uppercase tracking-widest text-sm mb-2 font-bold">
            Recent Works
          </h3>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            Take a look at some of my recent projects
          </h1>
        </motion.div>

        {/* Loading / Error */}
        {worksStatus === "loading" && (
          <p className="text-center text-lg text-gray-400 animate-pulse">
            Loading portfolio...
          </p>
        )}
        {worksStatus === "failed" && (
          <p className="text-center text-lg text-red-400">{worksError}</p>
        )}
        {categoriesStatus === "failed" && (
          <p className="text-center text-lg text-red-400">{categoriesError}</p>
        )}

        {/* Filters */}
        <div className="text-center mb-12">
          <ul className="flex flex-wrap justify-center gap-4 text-lg font-medium">
            <li>
              <button
                onClick={() => { setActiveFilter("All"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === "All"
                    ? "bg-[#f9861a] text-black"
                    : "bg-gray-800 text-gray-400 hover:bg-[#f9861a] hover:text-black"
                }`}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => { setActiveFilter(cat.name); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeFilter === cat.name
                      ? "bg-[#f9861a] text-black"
                      : "bg-gray-800 text-gray-400 hover:bg-[#f9861a] hover:text-black"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {worksStatus === "succeeded" &&
            currentItems.map((item, index) => (
              <motion.div
                key={item._id}
                className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-black cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => setModalImage(item.image?.url)}
              >
                <img
                  src={item.image?.url || "/images/placeholder.png"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#f9861a]">
                      {item.category?.name || "Uncategorized"}
                    </span>
                    <h3 className="text-lg md:text-xl font-serif font-bold mt-1 text-white">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-300 mt-1 font-sans text-sm md:text-base">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {worksStatus === "succeeded" && filteredItems.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            No projects found in this category.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === i + 1
                    ? "bg-[#f9861a] text-black"
                    : "bg-gray-800 text-gray-400 hover:bg-[#f9861a] hover:text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4"
            onClick={() => setModalImage(null)}
          >
            <img
              src={modalImage}
              alt="Enlarged"
              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
            />
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold"
              onClick={() => setModalImage(null)}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
