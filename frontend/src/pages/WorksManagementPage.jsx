import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorks, createWork, updateWork, deleteWork } from '../redux/slices/workSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

const ACCENT = '#f9861a';

const WorksPage = () => {
  const dispatch = useDispatch();
  const { items: works, status: worksStatus, error: worksError } = useSelector(state => state.works);
  const { items: categories, status: catStatus } = useSelector(state => state.categories);

  const [newWork, setNewWork] = useState({ title: '', description: '', category: '', image: null });
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [editingWork, setEditingWork] = useState({ title: '', description: '', category: '', image: null });

  useEffect(() => {
    if (worksStatus === 'idle') dispatch(fetchWorks());
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [dispatch, worksStatus, catStatus]);

  // Create new work
  const handleCreateWork = async () => {
    if (!newWork.title || !newWork.category || !newWork.image) {
      return alert("Fill all fields and upload an image");
    }

    const formData = new FormData();
    formData.append('title', newWork.title);
    formData.append('description', newWork.description);
    formData.append('category', newWork.category);
    formData.append('file', newWork.image); // ⚡ must match Multer key 'file'

    dispatch(createWork(formData));
    setNewWork({ title: '', description: '', category: '', image: null });
  };

  // Update existing work
  const handleUpdateWork = async () => {
    if (!editingWork.title || !editingWork.category) return alert('Fill all required fields');

    const formData = new FormData();
    formData.append('title', editingWork.title);
    formData.append('description', editingWork.description);
    formData.append('category', editingWork.category);

    if (editingWork.image instanceof File) {
      formData.append('file', editingWork.image); // ⚡ must match Multer key 'file'
    }

    dispatch(updateWork({ id: editingWorkId, formData }));
    setEditingWorkId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold">Works Management</h2>
      <p className="text-gray-400">Manage your portfolio: add, edit, or delete projects.</p>

      {/* Add New Work */}
      <div className="bg-[#07070e] p-6 rounded-xl border border-gray-800 space-y-4">
        <h3 className="text-xl font-bold" style={{ color: ACCENT }}>Add New Project</h3>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={newWork.title}
          onChange={e => setNewWork({ ...newWork, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={newWork.description}
          onChange={e => setNewWork({ ...newWork, description: e.target.value })}
        />
        <select
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
          value={newWork.category}
          onChange={e => setNewWork({ ...newWork, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <input type="file" onChange={e => setNewWork({ ...newWork, image: e.target.files[0] })} />
        <button
          className="px-6 py-3 bg-[#f9861a] text-white rounded-full hover:bg-opacity-90 transition-colors font-bold"
          onClick={handleCreateWork}
        >
          + Create New Work
        </button>
      </div>

      {/* Existing Works */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold" style={{ color: ACCENT }}>Existing Projects ({works.length})</h3>
        {worksStatus === 'loading' && <p className="text-gray-400">Loading works...</p>}
        {worksStatus === 'failed' && <p className="text-red-500">{worksError}</p>}

        <ul className="divide-y divide-gray-800 bg-[#07070e] rounded-xl border border-gray-800">
          {works.map(work => (
            <li
              key={work._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 space-y-2 md:space-y-0 md:space-x-4"
            >
              {editingWorkId === work._id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
                    value={editingWork.title}
                    onChange={e => setEditingWork({ ...editingWork, title: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
                    value={editingWork.description}
                    onChange={e => setEditingWork({ ...editingWork, description: e.target.value })}
                  />
                  <select
                    className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
                    value={editingWork.category}
                    onChange={e => setEditingWork({ ...editingWork, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                  <input type="file" onChange={e => setEditingWork({ ...editingWork, image: e.target.files[0] })} />
                  <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleUpdateWork}>Save</button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded" onClick={() => setEditingWorkId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="flex-1 flex items-center space-x-4">
                    {work.image?.url && (
                      <img src={work.image.url} alt={work.image.alt} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <div>
                      <p className="text-lg font-bold">{work.title}</p>
                      <p className="text-gray-400">{work.description}</p>
                      <p className="text-sm text-gray-500">
                        Category: {categories.find(c => c._id === work.category)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <button
                      className="text-sm text-blue-500 hover:text-blue-400"
                      onClick={() => { setEditingWorkId(work._id); setEditingWork(work); }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-500 hover:text-red-400"
                      onClick={() => dispatch(deleteWork(work._id))}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default WorksPage;
