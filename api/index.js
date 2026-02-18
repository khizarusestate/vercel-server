export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Aurelia Hotel API Server',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact - Send booking requests',
      rooms: 'GET /api/rooms - Get all rooms',
      room: 'GET /api/rooms?id={id} - Get specific room',
      newsletter: 'POST /api/newsletter - Subscribe to newsletter'
    }
  });
}
