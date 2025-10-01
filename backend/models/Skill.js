// models/Skill.js
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  level: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // 🔑 add this
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
