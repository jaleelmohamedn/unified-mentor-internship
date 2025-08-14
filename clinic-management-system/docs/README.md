# Direction — Clinic Management System

A modular, testable, maintainable, portable web app for small clinics to coordinate **reception** and **doctor** workflows:
- Token generation & queue
- Patient records & history
- Doctor prescriptions
- Billing
- **Full audit logging** using Firestore

## Tech
- HTML, CSS, JavaScript
- Firebase Auth (Email/Password), Firestore
- No frameworks; runs in any modern browser

## Quick Start
1. Create a Firebase project → enable **Auth** (email/password) & **Firestore**.
2. Copy your Firebase config into `public/js/firebase.js`.
3. (Optional) Set Firestore rules from `docs/SECURITY.md`.
4. Serve the `public/` folder (e.g., VS Code Live Server) and open `index.html`.
5. Register two users (roles: `receptionist`, `doctor`). Role stored in `users/{uid}`.
6. Use Reception page to create patients + tokens; Doctor page to record diagnosis & prescriptions; Billing page to create bills.
