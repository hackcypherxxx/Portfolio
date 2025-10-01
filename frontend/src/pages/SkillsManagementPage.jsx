// src/pages/SkillsPage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory
} from '../redux/slices/categorySlice';
import {
  fetchSkills,
  createSkill,
  deleteSkill,
  updateSkill,
  increaseSkill,
  decreaseSkill
} from '../redux/slices/skillSlice';

const ACCENT = '#f9861a';

const SkillsPage = () => {
  const dispatch = useDispatch();

  const { items: categories, status: catStatus } = useSelector(state => state.categories);
  const { items: skills, status: skillStatus } = useSelector(state => state.skills);

  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState(50);

  // Fetch initial data
  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategories());
    if (skillStatus === 'idle') dispatch(fetchSkills());
  }, [dispatch, catStatus, skillStatus]);

  // Category handlers
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    dispatch(createCategory(newCategory.trim()));
    setNewCategory('');
  };
  const handleDeleteCategory = (id) => dispatch(deleteCategory(id));
  const handleUpdateCategory = (id) => {
    if (!editCategoryName.trim()) return;
    dispatch(updateCategory({ id, name: editCategoryName.trim() }));
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (!newSkill.trim() || !selectedCategory) return;
    dispatch(createSkill({
      name: newSkill.trim(),
      level: skillLevel,
      category: selectedCategory
    }));
    setNewSkill('');
    setSkillLevel(50);
  };
  const handleDeleteSkill = (id) => dispatch(deleteSkill(id));
  const handleUpdateSkill = (id, updates) => dispatch(updateSkill({ id, updates }));
  const handleIncrease = (id) => dispatch(increaseSkill({ id, amount: 5 }));
  const handleDecrease = (id) => dispatch(decreaseSkill({ id, amount: 5 }));

  // Group skills by category
  const skillsByCategory = categories.reduce((acc, cat) => {
    acc[cat._id] = skills.filter(s => (s.category?._id || s.category) === cat._id);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold">Skills & Categories</h2>
      <p className="text-gray-400">Manage your proficiency list and categorize them.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Management */}
        <div className="bg-[#07070e] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4" style={{ color: ACCENT }}>Categories</h3>

          <ul className="space-y-2 mb-4">
            {categories.map(cat => (
              <li key={cat._id} className="flex justify-between items-center bg-gray-900 p-2 rounded">
                {editCategoryId === cat._id ? (
                  <>
                    <input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="p-1 bg-gray-800 text-white rounded"
                    />
                    <button onClick={() => handleUpdateCategory(cat._id)} className="text-green-400 ml-2">Save</button>
                  </>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <div>
                      <button onClick={() => { setEditCategoryId(cat._id); setEditCategoryName(cat.name); }} className="text-blue-400 mr-2">Edit</button>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500">Remove</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name"
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-3"
          />
          <button onClick={handleAddCategory} className="w-full py-2 bg-gray-700 text-white rounded-full">
            + Add Category
          </button>
        </div>

        {/* Skill Management */}
        <div className="bg-[#07070e] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4" style={{ color: ACCENT }}>Skills List</h3>

          {categories.map(cat => (
            <div key={cat._id} className="mb-6">
              <h4 className="font-semibold text-lg text-gray-300 mb-2">{cat.name}</h4>
              <ul className="flex flex-col gap-2">
                {(skillsByCategory[cat._id] || []).map(skill => (
                  <li key={skill._id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div>
                      <span>{skill.name}</span>
                      <span className="ml-2 text-xs text-gray-400">({skill.level}%)</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleDecrease(skill._id)} className="text-sm px-2 bg-gray-600 rounded">-</button>
                      <button onClick={() => handleIncrease(skill._id)} className="text-sm px-2 bg-gray-600 rounded">+</button>
                      <button onClick={() => handleUpdateSkill(skill._id, { name: prompt("New name:", skill.name) })} className="text-blue-400">Edit</button>
                      <button onClick={() => handleDeleteSkill(skill._id)} className="text-red-400">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Add new skill */}
          <div className="mt-6 space-y-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="New Skill Name"
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Skill Level: {skillLevel}%</label>
              <input
                type="range" min="0" max="100"
                value={skillLevel}
                onChange={(e) => setSkillLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button onClick={handleAddSkill} className="w-full py-2 bg-[#f9861a] text-white rounded-full">
              + Add New Skill
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;
