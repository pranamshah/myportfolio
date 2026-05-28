import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email] Would send to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Navkar Exim <noreply@navkarexim.com>",
    to,
    subject,
    html,
  });
}

export function quoteReceivedEmail(name: string, origin: string, dest: string) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0A1628; padding: 24px; text-align: center;">
        <h1 style="color: #0E7490; margin: 0;">Navkar Exim</h1>
        <p style="color: #94a3b8; margin: 4px 0;">Clearing & Forwarding Agent</p>
      </div>
      <div style="padding: 32px; background: #fff;">
        <h2>Quote Request Received</h2>
        <p>Dear ${name},</p>
        <p>We have received your quote request for shipment from <strong>${origin}</strong> to <strong>${dest}</strong>.</p>
        <p>Our team will review and respond within 2 hours on WhatsApp and email.</p>
        <p>Thank you for choosing Navkar Exim!</p>
      </div>
    </div>
  `;
}

export function shipmentStatusEmail(jobNo: string, status: string, clientName: string) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0A1628; padding: 24px; text-align: center;">
        <h1 style="color: #0E7490; margin: 0;">Navkar Exim</h1>
      </div>
      <div style="padding: 32px; background: #fff;">
        <h2>Shipment Status Update</h2>
        <p>Dear ${clientName},</p>
        <p>Your shipment <strong>${jobNo}</strong> status has been updated to:</p>
        <p style="background: #F0F6FA; padding: 12px; border-radius: 8px; font-size: 18px; font-weight: bold; color: #0E7490;">${status.replace(/_/g, " ")}</p>
        <p>Login to your portal to view details and download documents.</p>
      </div>
    </div>
  `;
}
