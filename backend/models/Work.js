import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: {
    url:       { type: String},
    public_id: { type: String },
    alt: { type: String || "Work image" }
  }
}, { timestamps: true });

export default mongoose.model('Work', workSchema);
