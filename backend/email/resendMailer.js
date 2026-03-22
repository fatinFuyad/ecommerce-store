import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const resendMailTransport = async (mailOptions) => {
  const { recipient, subject, emailTemplate, text } = mailOptions;

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: recipient.to,
    subject: subject,
    html: emailTemplate
  });
};
