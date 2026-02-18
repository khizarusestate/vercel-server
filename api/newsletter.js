const subscribers = [];

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      if (subscribers.includes(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already subscribed' 
        });
      }

      subscribers.push(email);
      
      res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter!' 
      });
      break;

    case 'GET':
      res.status(200).json({ 
        success: true, 
        data: subscribers 
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ 
        success: false, 
        message: `Method ${method} Not Allowed` 
      });
      break;
  }
}
