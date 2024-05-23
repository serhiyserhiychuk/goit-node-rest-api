import sgMail from "@sendgrid/mail";
import { SEND_GRID_API_KEY } from "../config.js";
sgMail.setApiKey(SEND_GRID_API_KEY);

const letterSender = async (email, token) => {
  const link = `http://localhost:3000/api/users/verify/${token}`;

  const message = {
    to: "serhiy.serhiychuk07@gmail.com",
    from: "serhiy20071@gmail.com",
    subject: "Email Verification",
    html: `<h1>Click this <a href=${link}>link</a> to verify your email.</h1>`,
    text: `Follow this link to verify your email: ${link}`,
  };

  await sgMail.send(message);
};

export default letterSender;
