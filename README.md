# Mini E-Commerce

A full-stack mini e-commerce application built with React, Node.js, Express, PostgreSQL, and Prisma.

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios
- React Hot Toast
- CSS3

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Helmet
- CORS
- Express Rate Limit

## Project Structure

```
mini-ecommerce/
├── backend/
│   ├── config/         # Database & app configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, validation, error handling
│   ├── routes/         # API routes
│   ├── prisma/         # Prisma schema & migrations
│   ├── utils/          # Helper functions
│   ├── uploads/        # File uploads
│   ├── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   ├── assets/         # Images, fonts, etc.
│   ├── styles/         # CSS files
│   ├── public/         # Static files
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm

### Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Health Check
```
GET /health
Response: { "success": true, "message": "Mini Ecommerce API Running" }
```
