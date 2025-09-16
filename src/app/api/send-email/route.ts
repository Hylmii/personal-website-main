import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { insertContact, initializeDatabase, testConnection } from '@/lib/database';
import { insertSQLiteContact, initSQLiteDatabase, testSQLiteConnection } from '@/lib/sqlite';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { from_name, from_email, company, subject, message } = await request.json();

    // Validate required fields
    if (!from_name || !from_email || !subject || !message) {
      return NextResponse.json({ 
        message: 'Missing required fields: name, email, subject, and message are required' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
      return NextResponse.json({ 
        message: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if email credentials are available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email credentials missing');
      return NextResponse.json({ 
        message: 'Email service temporarily unavailable. Please try again later.' 
      }, { status: 503 });
    }

    // Get client IP and User Agent for logging
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log('🔧 Email send attempt:', {
      from_name,
      from_email, 
      subject,
      clientIP,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? '***set***' : 'missing'
    });

    // Save to database with fallback to SQLite
    let contactId: number | null = null;
    let databaseType = 'MySQL';
    
    try {
      // Try MySQL first
      const mysqlConnected = await testConnection();
      
      if (mysqlConnected) {
        await initializeDatabase();
        contactId = await insertContact({
          name: from_name,
          email: from_email,
          company: company || null,
          subject,
          message,
          ip_address: clientIP,
          user_agent: userAgent,
          status: 'new'
        });
        console.log('💾 Contact saved to MySQL with ID:', contactId);
      } else {
        throw new Error('MySQL connection failed');
      }
    } catch (dbError) {
      console.log('⚠️ MySQL failed, falling back to SQLite...');
      
      try {
        // Fallback to SQLite
        initSQLiteDatabase(); // Always initialize SQLite
        
        contactId = insertSQLiteContact({
          name: from_name,
          email: from_email,
          company: company || null,
          subject,
          message,
          ip_address: clientIP,
          user_agent: userAgent,
          status: 'new'
        });
        databaseType = 'SQLite';
        console.log('💾 Contact saved to SQLite with ID:', contactId);
      } catch (sqliteError) {
        console.error('❌ Both MySQL and SQLite failed:', { dbError, sqliteError });
        // Continue with email even if database fails
        databaseType = 'None (Database failed)';
      }
    }

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

    // Test the connection first
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (smtpError) {
      console.error('❌ SMTP connection failed:', smtpError);
      return NextResponse.json({ 
        message: 'Email service connection failed. Please try again later.' 
      }, { status: 503 });
    }

    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Database ID:</strong> ${contactId || 'Not saved'}</p>
      <p><strong>Database Type:</strong> ${databaseType}</p>
      <p><strong>Name:</strong> ${from_name}</p>
      <p><strong>Email:</strong> ${from_email}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><strong>Technical Details:</strong></p>
      <p><em>IP Address:</em> ${clientIP}</p>
      <p><em>User Agent:</em> ${userAgent}</p>
      <p><em>Timestamp:</em> ${new Date().toISOString()}</p>
      <p><em>This email was sent from your portfolio website contact form.</em></p>
    `;

    // Send email
    try {
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
        to: 'hylmir25@gmail.com',
        databaseId: contactId
      });

      return NextResponse.json({ 
        message: 'Email sent successfully and saved to database',
        messageId: result.messageId,
        databaseId: contactId,
        databaseType: databaseType
      }, { status: 200 });

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // Still return success if database save worked
      if (contactId) {
        return NextResponse.json({ 
          message: 'Message saved but email delivery failed. We will contact you soon!',
          databaseId: contactId,
          databaseType: databaseType
        }, { status: 202 }); // 202 Accepted
      }
      
      return NextResponse.json({ 
        message: 'Failed to send email. Please try again or contact directly via email.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ General error:', error);
    return NextResponse.json({ 
      message: 'An unexpected error occurred. Please try again later.' 
    }, { status: 500 });
  }
}
