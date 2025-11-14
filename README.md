# EcoFine — Community Cleanup Platform

EcoFine is a community-driven web app that helps citizens report local environmental and infrastructure issues, collaborate on solutions, contribute resources, and track resolution progress transparently.

## Features
- Report issues with category, location, description, images, budget, and date
- Browse all issues with search and sort controls
- View detailed issue pages, progress, and community contributions
- Manage your issues (Firestore live updates with JSON fallback UX)
- See your contributions, filter, and sort by date/amount
- Secure authentication with Email/Password and Google
- Protected routes that preserve intended navigation after login
- Responsive UI with light/dark theme toggle (DaisyUI + Tailwind)
- Animated interactions and polished design (Framer Motion)
- Toast notifications for clear user feedback
- About page with mission, values, stats, and CTAs

## Tech Stack
- React- 19
- Vite- 7
- Tailwind CSS- 4 + DaisyUI -5
- React Router -7
- Firebase (Auth, Firestore)
- Framer Motion
- Lucide React icons
- React Hot Toast
- jsPDF and jsPDF-AutoTable (for potential export features)

## Environment Variables
Create a `.env` file in the project root for environment configuration.

## Firebase Setup
- Firebase Auth and Firestore are initialized in `src/Firebase/firebase.config.js`
- Auth flows are wrapped by `AuthProvider` and consumed via `useAuth()`
- Protected routes redirect unauthenticated users to `Login` and preserve the original destination

## Theming
- Theme toggle in `Navbar` supports light/dark
- Tailwind `dark` class toggled at the document root
- DaisyUI theme variables applied via `data-theme`
