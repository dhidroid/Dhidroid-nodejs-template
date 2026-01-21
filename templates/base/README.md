# Enterprise Node.js Backend

A robust, scalable, and production-ready Node.js backend application built with TypeScript, Express, and MongoDB. Designed with enterprise best practices including a layered architecture (MVC + Services), centralized error handling, logging, and comprehensive configuration.

## Features

- **Built with TypeScript**: Static typing for better code quality and developer experience.
- **Layered Architecture**: Clear separation of concerns (Controllers, Services, Models).
- **Security**: Implements `helmet` for security headers and `cors` for resource sharing.
- **Authentication**: JWT-based authentication middleware.
- **Database**: MongoDB integration using `mongoose`.
- **Caching**: Redis integration for caching and session management.
- **Validation**: Environment variable validation with `zod`.
- **Logging**: structured logging with `winston`.
- **Global Error Handling**: Centralized error management system.
- **Code Quality**: Pre-configured with `ESLint`, `Prettier`, and `Husky` (Git hooks).
- **Testing**: Setup with `Jest` and `Supertest`.
- **Dockerized**: Includes `Dockerfile` and `docker-compose.yml` for easy deployment.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Cache**: Redis
- **Validation**: Zod
- **Testing**: Jest
- **Tools**: Docker, ESLint, Prettier, Husky

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (running locally or URI)
- Redis (running locally or URI)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy the example environment file and update the values:
   ```bash
   cp .env.example .env
   # Or create .env based on the configuration below
   ```
   
   Ensure your `.env` contains:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/enterprise-node-app
   JWT_SECRET=your_jwt_secret_key
   REDIS_URL=redis://localhost:6379
   LOG_LEVEL=info
   ```

## Running the Application

### Development Mode
Runs the application with `nodemon` for hot-reloading.
```bash
npm run dev
```

### Production Build
Builds the TypeScript code to JavaScript and runs it.
```bash
npm run build
npm start
```

### With Docker
Run the entire stack (App, MongoDB, Redis) using Docker Compose.
```bash
docker-compose up --build
```

## Testing

Run the test suite using Jest.
```bash
npm test
```

## Project Structure

```
src/
├── config/         # Configuration files (DB, Logger, Env)
├── constants/      # Global constants
├── controllers/    # Route handlers (Request/Response logic)
├── middlewares/    # Custom Express middlewares
├── models/         # Mongoose models
├── routes/         # API Route definitions
├── services/       # Business logic layer
├── types/          # Custom TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express App setup
└── server.ts       # Server entry point
```

## API Endpoints

### Auth / Users
- `POST /api/users/register` - Register a new user
- `GET /api/users` - Get all users (Protected, requires Bearer token)

## Git Hooks

This project uses Husky to ensure code quality:
- **Pre-commit**: Runs `lint-staged` (ESLint + Prettier) on staged files.
- **Pre-push**: Runs `npm test` to ensure no failing tests are pushed.
