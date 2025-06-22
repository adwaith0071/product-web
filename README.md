# Product Management Frontend

A React TypeScript application for product management with authentication.

## Features

- User authentication (signup/login)
- Product browsing and management
- Wishlist functionality
- Responsive design
- Redux state management

## API Integration

This frontend is integrated with a Node.js/Express backend API. The API endpoints are:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

- `VITE_API_URL`: The base URL of your backend API (default: http://localhost:5000/api)

## Backend API Requirements

Make sure your backend API is running and has the following endpoints:

### Authentication Endpoints

#### POST /api/auth/signup

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /api/auth/me

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### POST /api/auth/logout

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Features

### Authentication

- User registration with name, email, and password
- User login with email and password
- JWT token-based authentication
- Automatic token storage in localStorage
- Protected routes
- Automatic authentication check on app load

### Error Handling

- Form validation
- API error messages display
- Loading states
- Network error handling

### State Management

- Redux Toolkit for state management
- Async thunks for API calls
- Persistent authentication state
- Automatic token management

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── store/              # Redux store and slices
├── services/           # API services
├── hooks/              # Custom hooks
├── config/             # Configuration files
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Lucide React (icons)
