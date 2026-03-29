import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const getWelcomeTemplate = (name) => {
  return `
    <div style="background-color: #0A0A0F; color: #F0F0F5; padding: 20px; font-family: sans-serif;">
      <h1 style="color: #00C896;">Welcome to Golf Charity!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining. Start playing, win prizes, and support your favorite charities.</p>
    </div>
  `;
};

// other templates go here...
