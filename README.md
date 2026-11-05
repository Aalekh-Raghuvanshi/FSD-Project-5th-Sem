# CarePoint — Smart Hospital Management & Patient Intelligence

CarePoint is a college project for managing fictional hospital records and presenting simple, explainable patient insights. It combines a React dashboard with an Express REST API.

> **Patient intelligence is for demonstration only.** Risk labels and alerts use simple rules applied to sample records. They are not clinically validated and must not be used for diagnosis or treatment.

## Features

- Hospital overview with live patient, doctor, appointment, department, and alert data.
- Patient registration, editing, search, filters, and patient profiles.
- Doctor directory with add, edit, availability, and department filters.
- Appointment scheduling, status updates, cancellation, and conflict checks.
- Department summaries with live doctor and patient counts.
- Explainable patient risk categories, health alerts, and individual summaries.
- Reports with registration, department, appointment, and patient-status charts.
- Local hospital, administrator, and dashboard preferences.
- Responsive navigation and layouts for desktop and mobile.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, JavaScript, Tailwind CSS, React Router DOM |
| Charts and icons | Recharts, Lucide React |
| API requests | Axios |
| Backend | Node.js, Express, CORS |
| Data | In-memory JavaScript arrays and objects; no database |

## Requirements

- Node.js 18 or later
- npm

## Install and run

From the project root, install the dependencies for the root scripts, backend, and frontend:

```bash
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Start the frontend and backend together:

```bash
npm run dev
```

Open the frontend at [http://localhost:5173](http://localhost:5173). The API listens on port `5001`, and Vite forwards `/api` requests to it. The backend port can be changed with `PORT`, but update the Vite proxy in `frontend/vite.config.js` to match.

Useful checks:

```bash
npm run build
curl http://localhost:5001/api/health
```

To run one server on its own:

```bash
npm run dev:frontend
npm run dev:backend
```

## Data storage

Patients, doctors, appointments, and departments live in JavaScript arrays in `backend/data/sampleData.js`. Changes remain available while the backend process is running and reset to the sample data when it restarts. There is no database, ORM, or external storage service.

Settings are saved in the browser's local storage and are separate from hospital records managed by the API.

## Project structure

```text
backend/
  data/
    sampleData.js
  routes/
    appointmentRoutes.js
    departmentRoutes.js
    doctorRoutes.js
    intelligenceRoutes.js
    patientRoutes.js
  server.js
frontend/
  src/
    App.jsx
    Appointments.jsx
    Dashboard.jsx
    Departments.jsx
    Doctors.jsx
    Intelligence.jsx
    Patients.jsx
    Reports.jsx
    SettingsPage.jsx
    settings.js
    index.css
    main.jsx
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
package.json
README.md
```

## REST API

The API base URL is `http://localhost:5001`. JSON request bodies are used for create and update operations.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `GET` | `/api/patients` | List patients; optional `q`, `gender`, and `status` filters |
| `GET` | `/api/patients/:id` | Get one patient |
| `POST` | `/api/patients` | Register a patient |
| `PUT` | `/api/patients/:id` | Update a patient |
| `DELETE` | `/api/patients/:id` | Delete a patient and their appointments |
| `GET` | `/api/doctors` | List doctors; optional `q`, `departmentId`, and `availability` filters |
| `GET` | `/api/doctors/:id` | Get one doctor |
| `POST` | `/api/doctors` | Add a doctor |
| `PUT` | `/api/doctors/:id` | Update a doctor |
| `DELETE` | `/api/doctors/:id` | Delete an unassigned doctor |
| `GET` | `/api/appointments` | List appointments; optional `q`, `status`, and `date` filters |
| `POST` | `/api/appointments` | Schedule an appointment |
| `PUT` | `/api/appointments/:id` | Update an appointment or its status |
| `DELETE` | `/api/appointments/:id` | Delete an appointment |
| `GET` | `/api/departments` | List departments with doctor and patient counts |
| `GET` | `/api/intelligence/overview` | Get risk totals and patient follow-up insights |
| `GET` | `/api/intelligence/alerts` | Get rule-generated health alerts |
| `GET` | `/api/intelligence/patients/:id` | Get one patient's intelligence summary |

Appointment creation checks that the patient and doctor exist, validates the date and time, and prevents the same doctor from being scheduled for two active appointments at the same time. Patient and doctor deletion also preserve record relationships.

## Sample data

The backend starts with 18 fictional patients, 8 fictional doctors, 7 departments, and 14 appointments. Contact information uses fictional numbers and `.example.test` email addresses.

## Screenshots

Capture screenshots while the app is running and place them in `docs/screenshots/` before submitting or presenting the project. Suggested screens:

- Dashboard overview
- Patient management and patient profile
- Doctor and appointment management
- Patient intelligence dashboard
- Reports and analytics

## Notes for the demo

- Start both servers with `npm run dev` before opening the frontend.
- Keep the backend running while demonstrating create, edit, delete, and status updates; restarting it restores the initial sample records.
- The patient intelligence rules are intentionally small enough to explain during a project review or viva.
