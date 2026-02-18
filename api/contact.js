const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, checkIn, checkOut, roomType } = req.body;

    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Send confirmation to submitter
      replyTo: process.env.EMAIL_USER,
      subject: 'Aurelia Booking Request Confirmation',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2 style="margin:0 0 8px">Booking Request Received</h2>
          <p style="margin:0 0 16px">Thanks for your request. Here are your submitted details:</p>
          <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
            <tr><td><strong>Name</strong></td><td>${name || '—'}</td></tr>
            <tr><td><strong>Email</strong></td><td>${email}</td></tr>
            <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
            <tr><td><strong>Room Type</strong></td><td>${roomType || '—'}</td></tr>
            <tr><td><strong>Check-in</strong></td><td>${checkIn || '—'}</td></tr>
            <tr><td><strong>Check-out</strong></td><td>${checkOut || '—'}</td></tr>
          </table>
          <p style="margin:16px 0 0"><strong>Message</strong></p>
          <p style="margin:6px 0 0">${message || '—'}</p>
          <hr style="margin:18px 0;border:none;border-top:1px solid #eee" />
          <p style="margin:0;color:#666;font-size:12px">Aurelia Grand Collection</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Booking request sent. Check your email inbox/spam.' 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send booking request' 
    });
  }
}
