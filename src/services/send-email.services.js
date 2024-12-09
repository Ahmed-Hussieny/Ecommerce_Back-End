import nodemailer from "nodemailer";
const sendEmailService = async ({
  to = "",
  subject = "no-reply",
  message = "no message",
  attachments = [],
}) => {
  const transporter = nodemailer.createTransport({
    host: "localhost" || "smtp.gmail.com",
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message,
    attachments,
  });
  return info.accepted.length ? true : false;
};

export default sendEmailService;
