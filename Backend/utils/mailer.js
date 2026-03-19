const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminderEmail = async (email, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Fitness Tracker - Daily Reminder 💪',
      text: message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${email} (Msg ID: ${info.messageId})`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${email}:`, error);
  }
};

module.exports = {
  sendReminderEmail
};
