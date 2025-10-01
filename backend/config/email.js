// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // ← ensures process.env.GMAIL_* is populated

// log for debugging – remove in prod
console.log('→ Gmail user:', process.env.GMAIL_USER);
console.log('→ Gmail pass:', !!process.env.GMAIL_PASS);

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,           // use STARTTLS
  secure: false,       // false = STARTTLS on port 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// verify connection configuration
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP connection error:', err);
  } else {
    console.log('✅ SMTP server is ready to send messages');
  }
});
