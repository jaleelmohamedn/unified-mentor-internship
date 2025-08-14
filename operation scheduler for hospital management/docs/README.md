# Operation Scheduler for Hospital Management

A modular web app to manage Operation Theater (OT) schedules, monitor activities, and analyze efficiency.
Built with **HTML, CSS, JavaScript, and Firebase**.

## Features
- Admin & User roles (email/password auth)
- OT scheduling: add, edit, cancel, reschedule, mark emergency
- Real-time updates (Firestore onSnapshot)
- Attach surgical reports (Firebase Storage)
- Daily/Range views, historical & upcoming
- Doctor & Patient management
- Materials & resources planning per surgery
- Action logging for every critical event
- Analytics: counts, durations, cancellations
- Portable: runs in any modern browser

## Setup
1. Create a Firebase project ⇒ enable **Auth (Email/Password)**, **Firestore**, **Storage**.
2. Paste your web config into `js/firebase-config.js` and include Firebase SDK script tags (see file header).
3. (Optional) Apply `firestore.rules` and `storage.rules` via Firebase CLI.
4. Serve locally (for Storage/Auth): `npx serve` (or any static server) and open the site.

## Pages
- `index.html` (landing)
- `login.html`, `register.html`
- `dashboard.html`
- `ot-schedule.html` (main OT activity module)
- `doctors.html`, `patients.html` (CRUD)
- `surgical-info.html` (range view)
- `admin-analytics.html` (summaries)

## Firestore Collections
- `users/{uid}`: `{ email, role }` (role ∈ {admin,user})
- `doctors/{id}`: `{ name, speciality, phone }`
- `patients/{id}`: `{ name, mrn, age, sex, phone }`
- `otSchedules/{id}`: see `LLD.md`

## Logging
Every action is appended to Firestore `logs` with `{ actionType, details, user, timestamp }`.

## Deployment
- **Firebase Hosting** recommended for a secure, CDN-backed deployment.

