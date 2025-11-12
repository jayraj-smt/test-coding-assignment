# Evaluation Checklist

| Feature/Test                 | Implemented | File/Path                                                                             |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| JWT Auth (signup/login)      | ✅          | /backend/src/routes/auth.ts                                                           |
| Image upload preview         | ✅          | /frontend/src/components/ImageUpload.tsx                                              |
| Abort in-flight request      | ✅          | /frontend/src/pages/Studio.tsx                                                        |
| Exponential retry logic      | ✅          | /frontend/src/pages/Studio.tsx                                                        |
| 20% simulated overload       | ✅          | /backend/src/services/generationService.ts                                            |
| GET last 5 generations       | ✅          | /backend/src/controllers/generationController.ts                                      |
| Unit tests backend           | ✅          | /backend/src/**tests**/auth.test.ts, /backend/src/**tests**/generations.test.ts       |
| Unit tests frontend          | ✅          | /frontend/src/**tests**/ImageUpload.test.tsx, /frontend/src/**tests**/Studio.test.tsx |
| E2E flow                     | ✅          | /tests/e2e.spec.ts                                                                    |
| ESLint + Prettier configured | ✅          | .eslintrc.js, .prettierrc                                                             |
| CI + Coverage report         | ✅          | .github/workflows/ci.yml                                                              |
| OpenAPI spec                 | ✅          | /OPENAPI.yaml                                                                         |
| Dark mode toggle             | ✅          | /frontend/src/contexts/ThemeContext.tsx                                               |
| Image resizing (bonus)       | ✅          | /frontend/src/utils/imageResize.ts                                                    |
| Code splitting (bonus)       | ✅          | Vite handles this automatically                                                       |
| Animations (bonus)           | ✅          | /frontend/src/components (Framer Motion)                                              |
| Docker setup                 | ✅          | /docker-compose.yml                                                                   |
| Accessibility features       | ✅          | ARIA labels, keyboard navigation, focus states                                        |
| Responsive design            | ✅          | Tailwind responsive classes                                                           |
| Error handling               | ✅          | Frontend and backend error handling                                                   |
| Input validation             | ✅          | Zod schemas in /backend/src/validators                                                |
