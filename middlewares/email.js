import { Resend } from "resend";

import dotenv from "dotenv";
dotenv.config();

const mailSender = async (option) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `Quantumtrade <support@quantumtradehq.com>`,
      to: option.email,
      subject: option.subject,
      text: option.message,
      html: option.htmlTemplate,
    });
  } catch (error) {
    console.log(error);
  }
};

export default mailSender;
