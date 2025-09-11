import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { from_name, from_email, company, subject, message } = await request.json();

    console.log('🔧 Email send attempt:', {
      from_name,
      from_email, 
      subject,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? '***set***' : 'missing'
    });

    // Create a transporter - Auto-detect provider based on email
    const isGmail = process.env.EMAIL_USER?.includes('@gmail.com');
    const isIcloud = process.env.EMAIL_USER?.includes('@icloud.com') || process.env.EMAIL_USER?.includes('@me.com');
    
    let transportConfig;
    
    if (isGmail) {
      transportConfig = {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      };
    } else if (isIcloud) {
      transportConfig = {
        host: 'smtp.mail.me.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      };
    } else {
      transportConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);

    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${from_name}</p>
      <p><strong>Email:</strong> ${from_email}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><em>This email was sent from your portfolio website contact form.</em></p>
    `;

    // Send email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'hylmir25@gmail.com', // Sementara kirim ke Gmail karena iCloud penuh
      subject: `Portfolio Contact: ${subject}`,
      html: emailContent,
      replyTo: from_email,
    });

    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      to: 'hylmir25@gmail.com'
    });
    return NextResponse.json({ 
      message: 'Email sent successfully',
      messageId: result.messageId 
    }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
