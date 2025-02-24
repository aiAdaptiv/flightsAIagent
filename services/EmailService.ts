import nodemailer from "nodemailer";
import { google } from "googleapis";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

export async function sendReport(pdfBuffer: Buffer) {
  await transporter.sendMail({
    to: process.env.REPORT_RECIPIENT,
    subject: "Flight Search Report",
    attachments: [
      {
        filename: `report-${Date.now()}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
