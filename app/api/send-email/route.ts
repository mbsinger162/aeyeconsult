import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { response } = await req.json();

    console.log('Received response:', response);

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Transporter created');

    const mailOptions = {
      from: 'your-app@example.com',
      to: 'mbsinger162@gmail.com',
      subject: 'New User Response',
      text: `A new user is using the chatbot for: ${response}`,
    };

    console.log('Sending email with options:', mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error in POST /api/send-email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}