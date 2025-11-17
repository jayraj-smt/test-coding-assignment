# AI Studio – Fashion Image Generation Platform

Welcome to AI Studio! This is a full-stack web app designed for experimenting with AI-powered fashion image generation. It's built for modern devs using React, TypeScript, Node.js, Express, Sequelize, and PostgreSQL.

---

## What Can You Do Here?

- **Sign up & Sign in:** Secure, JWT-based authentication to keep your account safe.
- **Easy Image Upload:** Drag & drop or select images to upload—JPEG/PNG, up to 10MB each.
- **Choose Your Style:** Play around with a variety of fashion styles before generating images.
- **Generation Sim Demo:** AI-powered image generation is simulated for demo purposes, with an intentional 20% error rate to keep things interesting.
- **Automatic Retry:** Failures? No worries—auto-retries up to 3 times, ramping up the wait each time.
- **Abort When You Like:** Change your mind? You can cancel ongoing image generations anytime.
- **Generation History:** Quickly access or restore your last 5 creations.
- **Dark Mode:** Flip between light & dark themes as you like.
- **Accessible by Design:** Built with keyboard navigation, ARIA labels, and clear focus indicators.
- **Mobile Friendly:** Looks and works great on both desktop and mobile.

---

## Tech in a Nutshell

### Frontend

- React 18 + TypeScript
- Vite, Tailwind CSS
- Animations via Framer Motion
- React Router, Axios for APIs
- Tested with Vitest & React Testing Library

### Backend

- Node.js (Express) + TypeScript
- Sequelize ORM, PostgreSQL
- Auth with JWT & password hashing (bcrypt)
- Request validation (Zod)
- File management (Multer)
- Tested with Jest & Supertest

### Dev & Ops

- Docker + Docker Compose
- GitHub Actions: CI/CD pipeline
- Playwright for end-to-end (E2E) tests

---

## Getting Started

### Option 1: Quickstart with Docker

1. **Clone this repository**:
    ```bash
    git clone <repository-url>
    cd test-coding-assignment
    ```

2. **Add your settings:**  
   Create a `.env` (root directory) and fill in:
    ```env
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=ai_studio
    JWT_SECRET=your-secret-key-change-in-production
    ```

3. **Spin everything up:**
    ```bash
    docker-compose up
    ```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)
- Database: `localhost:5432`


### Option 2: Local Dev (Run Frontend & Backend Yourself)

#### Backend

1. Enter `/backend`:
    ```bash
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create your own `.env`:
    ```env
    NODE_ENV=development
    PORT=3001
    JWT_SECRET=your-secret-key-change-in-production
    JWT_EXPIRES_IN=7d
    DATABASE_URL=postgresql://user:password@localhost:5432/ai_studio
    UPLOAD_DIR=./uploads
    ```

4. Get your database ready:
    ```bash
    createdb ai_studio
    ```

5. Migrate:
    ```bash
    npm run db:migrate
    ```

6. Start backend:
    ```bash
    npm run dev
    ```

#### Frontend

1. Enter `/frontend`:
    ```bash
    cd frontend
    ```

2. Get dependencies:
    ```bash
    npm install
    ```

3. Optionally set API URL in `.env`:
    ```env
    VITE_API_URL=http://localhost:3001/api
    ```

4. Launch frontend:
    ```bash
    npm run dev
    ```

---

## Project Layout

```
.
├── backend/
│   └── src/
│       ├── __tests__/        # Backend tests
│       ├── controllers/      # Route controllers
│       ├── db/               # Database config
│       ├── middleware/       # Express middleware
│       ├── models/           # Sequelize models
│       ├── routes/           # API endpoints
│       ├── services/         # Core logic
│       └── validators/       # Input validation
├── frontend/
│   └── src/
│       ├── __tests__/        # Frontend tests
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       ├── services/
│       └── test/
├── tests/
│   └── e2e.spec.ts           # E2E tests (Playwright)
├── .github/
│   └── workflows/
│       └── ci.yml            # Automated CI pipeline
├── docker-compose.yml
├── OPENAPI.yaml              # API contract
├── EVAL.md                   # Self-eval checklist
├── AI_USAGE.md               # AI design notes
└── README.md
```

---

## API Endpoints Overview

### Auth

- `POST /api/auth/signup` – Register new users
- `POST /api/auth/login` – Log in with email & password

### Fashion Generations

- `POST /api/generations` – Kick off a new image generation (auth required)
- `GET /api/generations?limit=5` – Fetch your latest generations (auth required)

*See the `OPENAPI.yaml` for full API details.*

---

## Environment Variables

**Backend**
- `NODE_ENV`, `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `DATABASE_URL`, `UPLOAD_DIR`

**Frontend**
- `VITE_API_URL`

---

## Commands to Know

At the project **root**:

- `npm run dev` – Start backend & frontend (if script is defined)
- `npm run test` – Run all tests
- `npm run lint` – Lint code

In **backend/**:

- `npm run dev` – Server in watch mode
- `npm run build` – Production build
- `npm test` – Run backend tests
- `npm run lint` – Lint backend code
- `npm run db:migrate` – Run DB migrations

In **frontend/**:

- `npm run dev` – React/Vite dev server
- `npm run build` – Build static site
- `npm test` – Run frontend tests
- `npm run test:coverage` – Test w/ coverage output
- `npm run lint` – Lint frontend code

---

## Testing

All bases are covered:
- **Unit:** Frontend (Vitest) & Backend (Jest)
- **Integration:** API endpoints (Supertest)
- **E2E:** User flows (Playwright)
- **Coverage:** Reports for both client & server

---

## Continuous Integration

- Automated CI pipeline (GitHub Actions) runs on every commit & PR:
    - Backend: Test with PostgreSQL
    - Frontend: Unit & component tests
    - E2E: Playwright
    - Coverage uploaded to Codecov

---

## Known Limitations & Next Steps

- **Image Resizing:** Currently unimplemented, but planned (Canvas API, etc.).
- **Error Simulation:** 20% error rate is hardcoded—making this configurable would be great.
- **File Cleanup:** Uploaded files aren’t yet auto-cleaned. A cleanup cron job could help.
- **Rate Limiting:** Not yet present, consider for production use!
- **Image Storage:** Using local files for now—moving to S3/cloud would be a production upgrade.

---

## License

This project was built as part of a coding challenge.

---

## Need Help?

Feel free to reach out to the dev team if you have questions, issues, or feedback! Contributions and suggestions are always welcome.
