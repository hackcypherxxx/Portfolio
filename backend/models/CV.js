// models/CV.js
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String },
  url:      { type: String }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company:     { type: String },
  position:    { type: String },
  startDate:   { type: Date },
  endDate:     { type: Date },
  description: { type: String }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  institution: { type: String },
  degree:      { type: String },
  field:       { type: String },
  startDate:   { type: Date },
  endDate:     { type: Date },
  notes:       { type: String }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title:       { type: String },
  description: { type: String },
  link:        { type: String },
  image: {
    url:       { type: String },
    public_id: { type: String }
  }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name:        { type: String },
  issuer:      { type: String },
  date:        { type: Date },
  credential:  { type: String },
  url:         { type: String }
}, { _id: false });

const languageSchema = new mongoose.Schema({
  name:        { type: String },
  proficiency: { type: String }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  title:   { type: String },
  content: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const cvSchema = new mongoose.Schema({
  personal: {
    name:         { type: String },
    title:        { type: String },
    email:        { type: String },
    phone:        { type: String },
    address:      { type: String },
    website:      { type: String },
    summary:      { type: String },
    profilePic: {
      url:        { type: String },
      public_id:  { type: String } 
    },
    socialLinks: [socialLinkSchema]
  },
  experiences:    [experienceSchema],
  education:      [educationSchema],
  projects:       [projectSchema],
  certifications: [certificationSchema],
  skills: [{
    name:  { type: String },
    level: { type: Number, min: 0, max: 100 }
  }],
  languages:      [languageSchema],
  interests:      [String],
  customSections: [sectionSchema],
  theme:          { type: String, default: 'default' }
}, { timestamps: true });

export default mongoose.model('CV', cvSchema);
