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

## Development Phases

1. ✅ **Phase 1**: Project Setup + PostgreSQL + Prisma
2. ⏳ **Phase 2**: Authentication (Register, Login, JWT)
3. ⏳ **Phase 3**: User Profile
4. ⏳ **Phase 4**: Navbar & Layout
5. ⏳ **Phase 5**: Product Listing
6. ⏳ **Phase 6**: Cart
7. ⏳ **Phase 7**: Orders & Checkout
8. ⏳ **Phase 8**: Admin Dashboard
9. ⏳ **Phase 9**: UI Polish & Validation
10. ⏳ **Phase 10**: Deployment (Render + Netlify)