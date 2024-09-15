import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { response } = await req.json();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: 'your-app@example.com',
    to: 'mbsinger162@gmail.com',
    subject: 'New User Response',
    text: `A new user is using the chatbot for: ${response}`,
  });

  return NextResponse.json({ message: 'Email sent successfully' });
}