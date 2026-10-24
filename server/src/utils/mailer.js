const nodemailer = require("nodemailer");
const env = require("../config/env");
const AppError = require("./AppError");

let transporter;

const getTransporter = () => {
  if (!env.mail.user || !env.mail.pass) {
    throw new AppError(503, "Email is not configured on the server");
  }
  transporter ??= nodemailer.createTransport({
    service: env.mail.service,
    auth: { user: env.mail.user, pass: env.mail.pass },
  });
  return transporter;
};

const sendMail = async ({ to, subject, text }) => {
  try {
    await getTransporter().sendMail({
      from: `"${env.mail.fromName}" <${env.mail.user}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Email could not be sent:", error.message);
    throw new AppError(502, "The email could not be sent. Please try again later.");
  }
};

module.exports = { sendMail };
