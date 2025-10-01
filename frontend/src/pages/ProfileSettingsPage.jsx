import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCV, upsertCV } from '../redux/slices/cvSlice';
import { toast } from 'react-hot-toast';

const ACCENT = '#f9861a';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const cv = useSelector(state => state.cv.data);
  const status = useSelector(state => state.cv.status);
  const error = useSelector(state => state.cv.error);

  const initialState = {
    personal: {
      name: '', title: '', email: '', phone: '', address: '', website: '', summary: '',
      profilePic: null,
      socialLinks: []
    },
    experiences: [],
    education: [],
    projects: [],
    certifications: [],
    skills: [],
    languages: [],
    interests: [],
    customSections: []
  };

  const [formState, setFormState] = useState(initialState);

  // Merge CV data from backend into formState
  useEffect(() => {
    if (!cv) dispatch(fetchCV());
    else {
      setFormState({
        personal: {
          ...initialState.personal,
          ...cv.personal,
          profilePic: cv.personal?.profilePic || null,
          socialLinks: cv.personal?.socialLinks || []
        },
        experiences: cv.experiences || [],
        education: cv.education || [],
        projects: cv.projects || [],
        certifications: cv.certifications || [],
        skills: cv.skills || [],
        languages: cv.languages || [],
        interests: cv.interests || [],
        customSections: cv.customSections || []
      });
    }
  }, [cv, dispatch]);

  const handlePersonalChange = (key, value) => {
    setFormState(prev => ({ ...prev, personal: { ...prev.personal, [key]: value } }));
  };

  const handlePersonalFileChange = e => {
    const file = e.target.files[0];
    if (file) handlePersonalChange('profilePic', file);
  };

  const handleArrayChange = (section, index, key, value) => {
    const updated = [...formState[section]];
    if (section === 'interests') updated[index] = value;
    else updated[index] = { ...updated[index], [key]: value };
    setFormState(prev => ({ ...prev, [section]: updated }));
  };

  const handleNestedArrayChange = (parentKey, section, index, key, value) => {
    const updated = [...formState[parentKey][section]];
    updated[index] = { ...updated[index], [key]: value };
    setFormState(prev => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [section]: updated }
    }));
  };

  const addArrayItem = (section, template = {}) => {
    if (section === 'interests') template = '';
    setFormState(prev => ({ ...prev, [section]: [...prev[section], template] }));
  };

  const removeArrayItem = (section, index, nestedKey = null) => {
    if (nestedKey) {
      const updated = [...formState[nestedKey][section]];
      updated.splice(index, 1);
      setFormState(prev => ({ ...prev, [nestedKey]: { ...prev[nestedKey], [section]: updated } }));
    } else {
      const updated = [...formState[section]];
      updated.splice(index, 1);
      setFormState(prev => ({ ...prev, [section]: updated }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();

      if (formState.personal.profilePic instanceof File) {
        formData.append('profilePic', formState.personal.profilePic);
      }

      const personalPayload = { ...formState.personal };
      delete personalPayload.profilePic;
      formData.append('personal', JSON.stringify(personalPayload));

      ['experiences','education','projects','certifications','skills','languages','interests','customSections']
        .forEach(section => formData.append(section, JSON.stringify(formState[section] || [])));

      await dispatch(upsertCV(formData)).unwrap();
      toast.success('✅ CV updated successfully!');
    } catch (err) {
      toast.error(`❌ Failed to update CV: ${err}`);
    }
  };

  if (status === 'loading' && !cv) return <p>Loading...</p>;
  if (status === 'failed') return <p className="text-red-500">Error: {error}</p>;

  // Array section render
  const renderArraySection = (section, fields, title) => (
    <div className="bg-[#07070e] p-6 rounded-xl border border-gray-800 mb-4">
      <h3 className="text-xl font-bold mb-4" style={{ color: ACCENT }}>{title}</h3>
      {formState[section].map((item, idx) => (
        <div key={idx} className="border-b border-gray-700 pb-2 mb-2">
          {fields.map(f => (
            <input
              key={f.key}
              type={f.type || 'text'}
              value={section==='interests'?item:item[f.key]||''}
              placeholder={f.key}
              onChange={e=>handleArrayChange(section, idx, f.key, e.target.value)}
              className="w-full p-2 mb-1 rounded bg-gray-700 text-white"
            />
          ))}
          <button type="button" onClick={()=>removeArrayItem(section, idx)} className="bg-red-600 px-2 rounded text-white mb-2">Remove</button>
        </div>
      ))}
      <button type="button" onClick={()=>addArrayItem(section, fields.reduce((a,f)=>({...a,[f.key]:''}),{}))} className="bg-blue-600 px-4 py-2 rounded text-white mt-2">+ Add {title.slice(0,-1)}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="space-y-8">
      <h2 className="text-3xl font-bold">CV Settings</h2>
      <p className="text-gray-400">Update all fields in your CV.</p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Info */}
        <div className="bg-[#07070e] p-6 rounded-xl border border-gray-800">
          <h3 className="text-xl font-bold mb-4" style={{ color: ACCENT }}>Personal Info</h3>
          {['name','title','email','phone','address','website','summary'].map(key => (
            <div key={key}>
              <label className="block text-gray-400 mb-1">{key.charAt(0).toUpperCase()+key.slice(1)}</label>
              {key==='summary' ? (
                <textarea value={formState.personal[key]||''} onChange={e=>handlePersonalChange(key,e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" rows={4} />
              ) : (
                <input type={key==='email'?'email':'text'} value={formState.personal[key]||''} onChange={e=>handlePersonalChange(key,e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              )}
            </div>
          ))}

          <div>
            <label className="block text-gray-400 mb-1">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handlePersonalFileChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white" />
            {formState.personal.profilePic && !(formState.personal.profilePic instanceof File) && (
              <img src={formState.personal.profilePic.url} alt="Profile" className="w-20 h-20 rounded-full mt-2 object-cover border border-gray-700" />
            )}
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-gray-400 mb-1">Social Links</label>
            {formState.personal.socialLinks.map((link, idx)=>(
              <div key={idx} className="flex gap-2 mb-2">
                <input type="text" placeholder="Platform" value={link.platform||''} onChange={e=>handleNestedArrayChange('personal','socialLinks',idx,'platform',e.target.value)} className="w-1/3 p-2 rounded bg-gray-700 text-white" />
                <input type="text" placeholder="URL" value={link.url||''} onChange={e=>handleNestedArrayChange('personal','socialLinks',idx,'url',e.target.value)} className="w-2/3 p-2 rounded bg-gray-700 text-white" />
                <button type="button" onClick={()=>removeArrayItem('socialLinks', idx, 'personal')} className="bg-red-600 px-2 rounded text-white">X</button>
              </div>
            ))}
            <button type="button" onClick={()=>addArrayItem('personal','socialLinks',{platform:'',url:''})} className="bg-blue-600 px-4 py-2 rounded text-white mt-2">+ Add Social Link</button>
          </div>
        </div>

        {/* Other Sections */}
        {renderArraySection('experiences', [
          {key:'company'}, {key:'position'}, {key:'startDate', type:'date'}, {key:'endDate', type:'date'}, {key:'description'}
        ], 'Experiences')}

        {renderArraySection('education', [
          {key:'institution'}, {key:'degree'}, {key:'field'}, {key:'startDate', type:'date'}, {key:'endDate', type:'date'}, {key:'notes'}
        ], 'Education')}

        {renderArraySection('projects', [
          {key:'title'}, {key:'description'}, {key:'link'}
        ], 'Projects')}

        {renderArraySection('certifications', [
          {key:'name'}, {key:'issuer'}, {key:'date', type:'date'}, {key:'credential'}, {key:'url'}
        ], 'Certifications')}

        {renderArraySection('skills', [
          {key:'name'}, {key:'level', type:'number'}
        ], 'Skills')}

        {renderArraySection('languages', [
          {key:'name'}, {key:'proficiency'}
        ], 'Languages')}

        {renderArraySection('interests', [
          {key:'value'}
        ], 'Interests')}

        {renderArraySection('customSections', [
          {key:'title'}, {key:'content'}
        ], 'Custom Sections')}

        <button type="submit" className="w-full py-3 bg-[#f9861a] text-white rounded-full font-bold hover:bg-opacity-90 mt-4">Save CV</button>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
