# UniRide - University Transport Management System

**Smarter Campus Travel, Connected Everywhere.**

UniRide is a university transport management platform that brings real-time bus tracking, seat booking, route management and analytics into one system for students, faculty and transport staff.

- **Live site:** https://abdullahal-shehab.github.io/UniRide-University-Transport-Management-System/
- **Repository:** https://github.com/abdullahal-shehab/UniRide-University-Transport-Management-System

## Features

| Module | Description |
| --- | --- |
| Student & Faculty Management | Registration, profiles, roles, booking history, account status |
| Bus Booking & Seat Management | Interactive seat maps, real-time availability, cancellations, PDF tickets |
| Trip & Schedule Management | Create, edit and reschedule trips with conflict detection |
| Transport Officer Dashboard | Bus count, active trips, occupancy, attendance, announcements |
| Driver & Helper Management | Profiles, licenses, duty rosters, trip assignments |
| Route & Stop Management | Routes, stops, pickup/drop-off points, map visualization |
| Live Bus Tracking | Driver GPS via Firebase Realtime Database, Leaflet maps, ETA |
| Bus Delay Notifications | Delay, cancellation and route-change alerts (in-app and FCM) |
| Transport Analytics | Route demand, occupancy, utilization trends with Chart.js |
| Route Subscription | Save preferred routes and receive route-specific alerts |
| Reports & Export | PDF and Excel reports for ridership, rosters and bookings |
| Security & Administration | Role-based access, audit logs, rate limiting, backup/restore |

## User Roles

Student, Faculty, Transport Officer, Driver, Helper and Administrator, each with a dedicated dashboard.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Leaflet, Chart.js
- **Backend:** Node.js, Express
- **Database & Services:** Firebase (Auth, Firestore, Realtime Database, Cloud Messaging)
- **Routing:** OSRM and OpenStreetMap
- **Platforms:** Web, Windows desktop (Electron), Android

## Project Structure

```
UniRide/
├── android/          # Android app
├── backend/
│   ├── config/       # Firebase and app configuration
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── validators/
├── desktop/          # Electron desktop app
├── docs/             # Project documentation
├── frontend/
│   ├── admin/        # Administrator dashboard
│   ├── staff/        # Officer, driver and helper dashboards
│   ├── student/      # Student and faculty dashboards
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── index.html    # Landing page
│   └── login.html    # Sign in / register
├── postman/          # API collections
├── .env.example
├── .gitignore
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A Firebase project

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/abdullahal-shehab/UniRide-University-Transport-Management-System.git
cd UniRide-University-Transport-Management-System/UniRide

# 2. Create your environment file
cp .env.example .env
# Fill in your Firebase credentials and a JWT secret (32+ characters)

# 3. Install dependencies
npm run install:all

# 4. Start backend and frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1

> Never commit `.env` or your Firebase service account JSON. Both are already listed in `.gitignore`.

## Project Status

The landing page and login/register pages are complete. The backend API, role dashboards, and the desktop and Android apps are in development.

## Team

| Name | ID |
| --- | --- |
| Sarkar Rafia Tasnim Ripa | 2023100000384 |
| Mst. Rubiya Nusrat Riya | 2023100000382 |
| Farjana Binte Anis | 2023200000101 |
| Abdullah Al Shehab | 2023200000471 |

## License

MIT
