const transporter = require("../config/nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Internship System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;