

// utils/sendEmail.js
import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, html, text }) {
  
  const port = 587; // or 465 with secure:true
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port,
//   secure: port === 465,
//   auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
// });
// Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,               // STARTTLS
  auth: { user: process.env.SMPT_USER, pass: process.env.SMPT_PASSWORD }
});


  // Fail fast with a descriptive message if connection/auth is wrong
  await transporter.verify();

  const info = await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text
  });

  return info; // contains messageId, response, accepted/rejected
}
