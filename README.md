# Aurelia Hotel Backend

Serverless backend API for Aurelia Hotel website using Vercel Functions.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

3. Run locally:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
npm run deploy
```

## API Endpoints

### GET /api
Server information and available endpoints

### POST /api/contact
Send booking requests via email

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I want to book a room",
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-17",
  "roomType": "Deluxe King"
}
```

### GET /api/rooms
Get all available rooms

### GET /api/rooms?id={id}
Get specific room details

### POST /api/rooms
Check room availability

**Body:**
```json
{
  "roomId": 1,
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-17"
}
```

### POST /api/newsletter
Subscribe to newsletter

**Body:**
```json
{
  "email": "user@example.com"
}
```

## Environment Variables

- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password/app password
- `CONTACT_EMAIL` - Contact email address

## Deployment

This backend is designed for Vercel serverless deployment. Simply connect your GitHub repository to Vercel and configure the environment variables in the Vercel dashboard.
