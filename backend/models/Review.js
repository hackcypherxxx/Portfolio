import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  image: {
    url: { type: String },
    publicId: { type: String },
    alt: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
