import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadImages = async (files) => {
  const uploads = files.map(file => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'user_contacts' },
        (err, result) => {
          if (err) reject(err);
          else resolve({
            url: result.secure_url,
            publicId: result.public_id,
            alt: file.originalname
          });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  });

  return Promise.all(uploads);
};
