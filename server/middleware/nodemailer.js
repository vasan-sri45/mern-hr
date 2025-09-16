import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const mail = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
  port:587,
  secure:false,
  auth: {
    user: process.env.SMPT_USER,
    pass: process.env.SMPT_PASSWORD,
  },
});



export default mail;