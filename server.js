const dotenv = require('dotenv');

dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });
dotenv.config({ path: '.env.example', override: false });

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = new Set(
  [
    process.env.ALLOWED_ORIGIN,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
  ].filter(Boolean)
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

app.get('/api', (req, res) => {
  res.json({
    message: 'Aurelia Hotel API Server (Local Express)',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact',
      rooms: 'GET /api/rooms',
      room: 'GET /api/rooms/:id',
      newsletter: 'POST /api/newsletter'
    }
  });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, checkIn, checkOut, roomType } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const transporter = nodemailer.createTransport({
      host: getRequiredEnv('EMAIL_HOST'),
      port: Number(getRequiredEnv('EMAIL_PORT')),
      secure: false,
      auth: {
        user: getRequiredEnv('EMAIL_USER'),
        pass: getRequiredEnv('EMAIL_PASS'),
      },
    });

    const fromEmail = getRequiredEnv('EMAIL_USER');

    const safe = (v) => (v ? String(v) : '');

    const subject = 'Aurelia Booking Request Confirmation';
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 8px">Booking Request Received</h2>
        <p style="margin:0 0 16px">Thanks for your request. Here are your submitted details:</p>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse">
          <tr><td><strong>Name</strong></td><td>${safe(name) || '—'}</td></tr>
          <tr><td><strong>Email</strong></td><td>${safe(email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${safe(phone) || '—'}</td></tr>
          <tr><td><strong>Room Type</strong></td><td>${safe(roomType) || '—'}</td></tr>
          <tr><td><strong>Check-in</strong></td><td>${safe(checkIn) || '—'}</td></tr>
          <tr><td><strong>Check-out</strong></td><td>${safe(checkOut) || '—'}</td></tr>
        </table>
        <p style="margin:16px 0 0"><strong>Message</strong></p>
        <p style="margin:6px 0 0">${safe(message) || '—'}</p>
        <hr style="margin:18px 0;border:none;border-top:1px solid #eee" />
        <p style="margin:0;color:#666;font-size:12px">Aurelia Grand Collection</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: email,
      replyTo: fromEmail,
      subject,
      html,
    });

    res.json({ success: true, message: 'Booking request sent. Check your email inbox/spam.' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to send booking request',
    });
  }
});

const roomsData = [
  {
    id: 1,
    tag: 'Deluxe King',
    title: 'City View Suite',
    description: 'Elegant room with king bed, work lounge, marble bathroom, and skyline windows.',
    price: 'From $220 / night',
    available: true,
    amenities: ['King Bed', 'Work Lounge', 'Marble Bathroom', 'Skyline View', 'Mini Bar', 'WiFi']
  },
  {
    id: 2,
    tag: 'Family Wing',
    title: 'Grand Family Room',
    description: 'Spacious stay for families with twin zones, smart TV wall, and curated comfort set.',
    price: 'From $280 / night',
    available: true,
    amenities: ['Twin Zones', 'Smart TV', 'Mini Bar', 'WiFi', 'Kids Area', 'Kitchenette']
  },
  {
    id: 3,
    tag: 'Executive Class',
    title: 'Presidential Loft',
    description: 'Exclusive top-floor suite with private lounge, dining corner, and premium service.',
    price: 'From $450 / night',
    available: true,
    amenities: ['Private Lounge', 'Dining Corner', 'Butler Service', 'Jacuzzi', 'Balcony', 'Premium WiFi']
  }
];

app.get('/api/rooms', (req, res) => {
  res.json({ success: true, data: roomsData });
});

app.get('/api/rooms/:id', (req, res) => {
  const id = Number(req.params.id);
  const room = roomsData.find((r) => r.id === id);

  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

  res.json({ success: true, data: room });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  res.json({ success: true, message: 'Subscribed (local server).' });
});

app.listen(PORT, () => {
  console.log(`Aurelia backend running on http://localhost:${PORT}`);
  console.log('Allowed CORS origins:', Array.from(allowedOrigins));
});
