const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'your_mailtrap_username',
      pass: process.env.SMTP_PASSWORD || 'your_mailtrap_password'
    }
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'Sleep Haven'} <${process.env.FROM_EMAIL || 'noreply@sleephaven.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
