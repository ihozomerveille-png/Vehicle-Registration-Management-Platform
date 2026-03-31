# Vehicle Registration & Management Platform

Frontend for Vehicle Registration API (assignment requirements). 

## Features implemented
- Client-side mock auth with `test@gmail.com` / `Password!234`.
- Public Home list from `GET /vehicle`.
- Protected routes: `/dashboard`, `/vehicle/new`, `/vehicle/:id`.
- Multi-step vehicle registration form with strict Zod validation (mirrors the backend constraints).
- Segmented detail view for `/vehicle/:id/info`, `/owner`, `/registration`, `/insurance`.
- Axios API utility with base URL from Swagger service.
- React Query caching and mutation invalidation.

## Architecture
- `src/context/AuthContext.jsx` for AuthContext and localStorage persistence.
- `src/services/api.js` for centralized Axios calls.
- `src/pages/*` for view components.
- `src/components/ProtectedRoute.jsx` for guarding private routes.

## How to run locally
1. Open terminal in `Vehicle Registration`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Visit `http://localhost:5173`.

## Auth values
- Email: `test@gmail.com`
- Password: `Password!234`

## Deployment
- Deploy to Vercel/Netlify/Render using this repo.
- Ensure `npm run build` succeeds.

## Notes
- When the backend returns `422`, the React Query mutation will set `isError` and display it in the form.
- Add production error boundary and toasts as an improvement.
