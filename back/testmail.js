import dotenv from 'dotenv';
dotenv.config();

console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS);
import { transporter } from './utils/email.js';

transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_USER,
  subject: 'Test Email',
  text: 'This is a test email from Node.js'
}).then(info => {
  console.log('Email sent:', info.response);
}).catch(err => {
  console.error('Error sending email:', err);
});
