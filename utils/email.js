const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const { email, subject, message } = options;
  const mailOptions = {
    from: 'Gerges Hany',
    to: email,
    subject: subject,
    text: message,
  };

  // 3) Actually send the email with error handling
  try {
    console.log(`Sending email to ${email} with subject: ${subject}`);
    // await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
