// email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load here too just in case

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export function sendRecurringReminder({ to, subject, text }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px; border-radius: 12px; border: 1px solid #e0e0e0;">
      <h2 style="color: #4f46e5;">Finance Tracker Reminder</h2>
      <p>Dear user,</p>
      <p>This is a friendly reminder from <b>Finance Tracker</b> about your upcoming recurring payments:</p>
      <pre style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; color: #222;">${text}</pre>
      <p>Please ensure timely payment to avoid any inconvenience.</p>
      <p style="margin-top: 32px; color: #888; font-size: 13px;">This is an automated message from Finance Tracker. If you have any questions, please contact our support team.</p>
    </div>
  `;
  return transporter.sendMail({
    from: `Finance Tracker <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
