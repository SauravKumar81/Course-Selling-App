# Course Selling Application

A backend REST API for an online course marketplace where admins can create courses and users can purchase them.

## Features

- User & Admin Authentication
- Course Management
- Purchase System
- JWT-based Authentication
- MongoDB Database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
mongo_uri=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
```

3. Start the server:
```bash
npm start
```

## API Routes

### User Routes

- POST `/api/v1/user/signup` - Register new user
- POST `/api/v1/user/signin` - User login
- GET `/api/v1/user/profile` - Get user profile
- POST `/api/v1/user/logout` - Logout user
- GET `/api/v1/user/purchases` - Get purchase history
- GET `/api/v1/user/purchase/:courseId` - Get specific purchase details

### Admin Routes

- POST `/api/v1/admin/signup` - Register new admin
- POST `/api/v1/admin/signin` - Admin login
- POST `/api/v1/admin/courses` - Create new course
- GET `/api/v1/admin/courses` - List all courses
- PUT `/api/v1/admin/courses/:courseId` - Update course
- DELETE `/api/v1/admin/courses/:courseId` - Delete course
- GET `/api/v1/admin/users` - List all users
- GET `/api/v1/admin/users/:userId` - Get user details
- DELETE `/api/v1/admin/users/:userId` - Delete user

### Course Routes

- GET `/api/v1/course/preview/all` - Get all course previews
- GET `/api/v1/course/preview/:courseId` - Get course preview
- POST `/api/v1/course/purchase/:courseId` - Purchase course
- GET `/api/v1/course/purchased/all` - Get all purchased courses
- GET `/api/v1/course/purchased/:courseId` - Get purchased course content

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- Zod (Validation)
- Cookie Parser

## Data Models

### User
- email (unique)
- password
- firstName
- lastName

### Admin
- email (unique)
- password
- firstName
- lastName

### Course
- title
- description
- price
- imageLink
- creatorID

### Purchase
- userID
- courseID