# FareFair - MERN Stack Ride Fare Comparison App

FareFair is a comprehensive web application that allows users to compare ride fares and estimated arrival times from popular ride-hailing services including Uber, Ola, and Rapido. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Real-time Fare Comparison**: Compare prices across multiple ride-hailing providers
- **Vehicle Type Selection**: Choose from bikes, auto-rickshaws, and cars
- **User Authentication**: Secure login and registration system
- **Ride History**: Track your past searches and bookings
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Mock API Integration**: Includes realistic mock data for demonstration

## Quick Start

### Prerequisites

- Node.js (v16 or later)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Extract the project files**
   ```bash
   # Navigate to the project directory
   cd FareFair-Complete-MERN-App
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the environment template
   cp backend/.env.example backend/.env

   # Edit the .env file with your configuration
   # Minimum required: MONGODB_URI
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## Project Structure

```
FareFair-Complete-MERN-App/
├── backend/                 # Node.js + Express backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── .env.example        # Environment variables template
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── utils/          # Frontend utilities
│   └── public/             # Static assets
└── package.json            # Root package.json for scripts
```

## Available Scripts

### Development
```bash
npm run dev          # Start both frontend and backend concurrently
npm run server       # Start backend only
npm run client       # Start frontend only
```

### Installation
```bash
npm run install:all  # Install dependencies for root, backend, and frontend
```

### Production
```bash
npm run build        # Build frontend for production
npm start           # Start backend server
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/farefair

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Rides
- `POST /api/rides/search` - Search for ride fares
- `GET /api/rides/history` - Get user ride history
- `POST /api/rides/book` - Book a ride

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Features

### Frontend Features
- Modern React 18 with functional components and hooks
- React Router for navigation
- Context API for state management
- Responsive design with CSS Grid and Flexbox
- Loading states and error handling
- Form validation

### Backend Features
- RESTful API design
- JWT authentication
- MongoDB integration with Mongoose
- Request validation with express-validator
- Security middleware (helmet, CORS, rate limiting)
- Error handling and logging

## Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting platform
3. Update environment variables

### Backend (Heroku/Render)
1. Push the `backend` folder to your hosting platform
2. Set environment variables
3. Ensure MongoDB connection is configured

### Full Stack (Railway/Render)
1. Deploy the entire repository
2. Configure build commands for both frontend and backend
3. Set up environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please create an issue on GitHub or contact the development team.

## Roadmap

- [ ] Real API integration with ride providers
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Route optimization
- [ ] Price predictions using machine learning
- [ ] Mobile application
