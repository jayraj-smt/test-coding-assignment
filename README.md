# AI Studio - Fashion Image Generation Platform

A full-stack web application for simulating AI-powered fashion image generation. Built with React, TypeScript, Node.js, Express, Sequelize, and PostgreSQL.

## Features

- 🔐 **User Authentication**: JWT-based signup and login
- 🖼️ **Image Upload**: Drag-and-drop or click to upload images (max 10MB, JPEG/PNG)
- 🎨 **Style Selection**: Choose from multiple fashion styles
- ⚡ **Generation Simulation**: Simulated AI generation with 20% error rate
- 🔄 **Retry Logic**: Automatic retry up to 3 times with exponential backoff
- 🛑 **Abort Functionality**: Cancel in-flight generation requests
- 📜 **Generation History**: View and restore last 5 generations
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ♿ **Accessibility**: Keyboard navigation, ARIA labels, focus states
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Axios
- Vitest + React Testing Library

### Backend

- Node.js + Express
- TypeScript
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)
- Zod (validation)
- Multer (file uploads)
- Jest + Supertest

### DevOps

- Docker & Docker Compose
- GitHub Actions CI/CD
- Playwright (E2E testing)

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

## Setup Instructions

### Option 1: Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd test-coding-assignment
```

2. Create a `.env` file in the root directory:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ai_studio
JWT_SECRET=your-secret-key-change-in-production
```

3. Start all services:

```bash
docker-compose up
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432

### Option 2: Local Development

#### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://user:password@localhost:5432/ai_studio
UPLOAD_DIR=./uploads
```

4. Create PostgreSQL database:

```bash
createdb ai_studio
```

5. Run migrations:

```bash
npm run db:migrate
```

6. Start the backend server:

```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional):

```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:

```bash
npm run dev
```

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Backend tests
│   │   ├── controllers/         # Route controllers
│   │   ├── db/                  # Database configuration
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Sequelize models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── validators/          # Zod validation schemas
│   ├── uploads/                 # Uploaded images
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── __tests__/           # Frontend tests
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   └── test/                # Test setup
│   └── package.json
├── tests/
│   └── e2e.spec.ts              # E2E tests
├── .github/
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
├── docker-compose.yml
├── OPENAPI.yaml                 # API specification
├── EVAL.md                      # Evaluation checklist
├── AI_USAGE.md                  # AI usage documentation
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email and password

### Generations

- `POST /api/generations` - Create a new generation (requires auth)
- `GET /api/generations?limit=5` - Get recent generations (requires auth)

See `OPENAPI.yaml` for complete API documentation.

## Environment Variables

### Backend

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `DATABASE_URL` - PostgreSQL connection string
- `UPLOAD_DIR` - Directory for uploaded files

### Frontend

- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

## Development Scripts

### Root

- `npm run dev` - Start both backend and frontend
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run db:migrate` - Run database migrations

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Backend (Jest) and Frontend (Vitest)
- **Integration Tests**: API endpoint testing with Supertest
- **E2E Tests**: Full user flow testing with Playwright
- **Coverage Reports**: Generated for both backend and frontend

## CI/CD

GitHub Actions workflow runs on every push and PR:

- Backend tests with PostgreSQL service
- Frontend tests
- E2E tests with Playwright
- Coverage reports uploaded to Codecov

## Known Limitations / TODOs

1. **Image Resizing**: Image resizing before upload (max width 1920px) is planned but not yet implemented. Can be added using Canvas API.

2. **Error Rate**: The 20% error simulation is random. For more realistic testing, consider making it configurable.

3. **File Cleanup**: Uploaded files are not automatically cleaned up. Consider adding a cleanup job.

4. **Rate Limiting**: No rate limiting implemented. Consider adding for production.

5. **Image Storage**: Currently using local file system. Consider cloud storage (S3, etc.) for production.

## License

This project is part of a coding assignment.

## Contact

For questions or issues, please contact the development team.
