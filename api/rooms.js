const roomsData = [
  {
    id: 1,
    tag: "Deluxe King",
    title: "City View Suite",
    description: "Elegant room with king bed, work lounge, marble bathroom, and skyline windows.",
    price: "From $220 / night",
    image: "/assets/room1.png",
    available: true,
    amenities: ["King Bed", "Work Lounge", "Marble Bathroom", "Skyline View", "Mini Bar", "WiFi"]
  },
  {
    id: 2,
    tag: "Family Wing",
    title: "Grand Family Room",
    description: "Spacious stay for families with twin zones, smart TV wall, and curated comfort set.",
    price: "From $280 / night",
    image: "/assets/room2.png",
    available: true,
    amenities: ["Twin Zones", "Smart TV", "Mini Bar", "WiFi", "Kids Area", "Kitchenette"]
  },
  {
    id: 3,
    tag: "Executive Class",
    title: "Presidential Loft",
    description: "Exclusive top-floor suite with private lounge, dining corner, and premium service.",
    price: "From $450 / night",
    image: "/assets/room3.png",
    available: true,
    amenities: ["Private Lounge", "Dining Corner", "Butler Service", "Jacuzzi", "Balcony", "Premium WiFi"]
  }
];

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { id } = req.query;
      if (id) {
        const room = roomsData.find(room => room.id === parseInt(id));
        if (!room) {
          return res.status(404).json({ success: false, message: 'Room not found' });
        }
        return res.status(200).json({ success: true, data: room });
      }
      res.status(200).json({ success: true, data: roomsData });
      break;

    case 'POST':
      const { roomId, checkIn, checkOut } = req.body;
      const room = roomsData.find(r => r.id === parseInt(roomId));
      
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      
      res.status(200).json({ 
        success: true, 
        available: room.available,
        room: room,
        message: 'Room available for selected dates'
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}
