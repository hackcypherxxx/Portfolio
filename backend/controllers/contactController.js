import asyncHandler from 'express-async-handler';
import { transporter } from '../config/email.js';
import { uploadImages } from '../utils/uploadImages.js';

/**
 * @desc    Send contact message with optional image
 * @route   POST /api/contact
 * @access  Public
 */
export const sendContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  let imageLink = '';
  if (req.file) {
    try {
      // Upload single file to Cloudinary
      const uploaded = await uploadImages([req.file]);
      if (uploaded && uploaded.length > 0) imageLink = uploaded[0].url;
    } catch (err) {
      console.error('❌ Cloudinary upload error:', err);
      return res.status(500).json({ message: 'Failed to upload image', error: err.message });
    }
  }

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `New message from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
      ${imageLink
        ? `<p><strong>Image:</strong> <a href="${imageLink}" target="_blank">View Image</a></p>`
        : ''}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✉️  Mail sent:', info.messageId);
    res.json({ message: 'Your message has been sent', imageLink });
  } catch (err) {
    console.error('❌ sendMail error:', err);
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
});
