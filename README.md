# Showcase Platform

A full-stack web application built with MongoDB, Express.js, React, and Node.js for showcasing projects and client testimonials. The platform features a public-facing landing page and a secure administrative panel for content management.

## Features

### Public Features
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Project Showcase** - Display portfolio projects with images and descriptions
- 💬 **Client Testimonials** - Showcase client feedback in the "Happy Clients" section
- 📧 **Contact Form** - Allow visitors to submit inquiries with validation
- 📰 **Newsletter Subscription** - Collect email addresses for newsletter updates
- ⚡ **Fast Loading** - Optimized images and efficient data fetching

### Admin Features
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📊 **Project Management** - Create, read, update, and delete projects
- 👥 **Client Management** - Manage client testimonials with full CRUD operations
- 📬 **Contact Submissions** - View and manage contact form submissions
- 📮 **Newsletter Management** - View and manage newsletter subscriptions
- 🖼️ **Automatic Image Processing** - Images automatically cropped to 450x350 pixels
- 🎯 **Intuitive Interface** - Clean and professional admin panel design

## Technology Stack

**Frontend:**
- React 19.2+ - UI library
- React Router v7 - Client-side routing
- Vite - Build tool and development server
- Axios - HTTP client
- React Cropper - Image cropping functionality
- TypeScript - Type safety
- Tailwind CSS - Styling

**Backend:**
- Node.js v18+ - Runtime environment
- Express.js 4.18+ - Web framework
- MongoDB - NoSQL database
- Mongoose 8.0+ - MongoDB ODM
- JWT - Authentication tokens
- bcrypt - Password hashing
- Multer - File upload handling
- Sharp - Image processing
- Express Validator - Input validation

**Development Tools:**
- Jest - Testing framework
- Supertest - API testing
- Nodemon - Auto-restart development server

## Project Structure

```
.
├── backend/                    # Backend API
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── scripts/               # Utility scripts (seeding)
│   ├── tests/                 # Test files
│   ├── uploads/               # Uploaded images
│   ├── utils/                 # Helper utilities
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Backend dependencies
│   └── server.js              # Entry point
│
├── frontend/                   # Frontend application
│   ├── app/                   # Application code
│   │   ├── components/        # React components
│   │   ├── routes/            # Route components
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── styles/            # CSS files
│   │   └── utils/             # Helper utilities
│   ├── public/                # Static assets
│   ├── .env.example           # Environment variables template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
│
├── .kiro/                     # Kiro specs and documentation
│   └── specs/
│       └── mern-showcase-platform/
│           ├── requirements.md # Feature requirements
│           ├── design.md      # Design document
│           └── tasks.md       # Implementation tasks
│
├── API_DOCUMENTATION.md       # Detailed API documentation
└── README.md                  # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher) 
- **npm** (comes with Node.js) or **yarn**
- **Git** 

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-showcase-platform
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration 

The backend will be ready to run after configuration.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your API URL 

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/showcase

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Configuration Details:**

- `PORT` - Port number for the backend server (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
  - Local: `mongodb://localhost:27017/showcase`
  - Atlas: `mongodb+srv://<username>:<password>@cluster.mongodb.net/showcase`
- `JWT_SECRET` - Secret key for JWT token generation (use a strong random string in production)
- `JWT_EXPIRE` - Token expiration time (e.g., 7d, 24h, 30m)
- `MAX_FILE_SIZE` - Maximum upload file size in bytes (default: 5MB)
- `UPLOAD_PATH` - Directory for uploaded images

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development
```

**Configuration Details:**

- `VITE_API_URL` - Backend API base URL
  - Development: `http://localhost:5000/api`
  - Production: `https://your-domain.com/api`
- `VITE_NODE_ENV` - Environment mode (development/production)

## Running the Application

### Start MongoDB

If using a local MongoDB instance, ensure it's running:

```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

Or use MongoDB Atlas (cloud) - no local installation needed.

### Seed the Database

Before first run, seed the database with an admin user:

```bash
cd backend
npm run seed
```

Or seed with sample data (admin + projects + clients):

```bash
npm run seed:samples
```

**Default Admin Credentials:**

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@showcase.com`

⚠️ **Security Warning:** Change these credentials immediately in production!

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Start the Frontend Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Access the Application

- **Landing Page:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Login Page:** http://localhost:5173/login

## Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run tests
npm run seed       # Seed database with admin user only
npm run seed:samples # Seed database with admin + sample data
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run typecheck  # Run TypeScript type checking
```

## Database Seeding

The project includes a seeding script to populate the database with initial data.

### Seed Admin User Only

To create just the default admin user:

```bash
cd backend
npm run seed
```

This creates an admin user with the default credentials.

### Seed with Sample Data

To create the admin user along with sample projects and clients:

```bash
cd backend
npm run seed:samples
```

This will create:
- 1 admin user
- 3 sample projects
- 3 sample client testimonials

### Notes

- The seed script is idempotent - it won't create duplicate data if run multiple times
- Sample data uses placeholder images from placeholder.com
- You can modify the sample data in `backend/scripts/seed.js`


### Quick API Reference

**Public Endpoints:**
- `GET /api/projects` - Get all projects
- `GET /api/clients` - Get all clients
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/auth/login` - Admin login

**Protected Admin Endpoints:**
- `GET/POST/PUT/DELETE /api/admin/projects` - Manage projects
- `GET/POST/PUT/DELETE /api/admin/clients` - Manage clients
- `GET/DELETE /api/admin/contacts` - Manage contact submissions
- `GET/DELETE /api/admin/subscriptions` - Manage newsletter subscriptions


### Landing Page

*Project showcase section displaying portfolio items*

*Client testimonials with images and descriptions*

*Contact form for visitor inquiries*

### Admin Panel

*Secure admin authentication page*

*Admin panel for managing projects*

*Admin panel for managing client testimonials*

*View and manage contact form submissions*


## Contributing

Contributions are welcome! We appreciate your help in making this project better.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request



