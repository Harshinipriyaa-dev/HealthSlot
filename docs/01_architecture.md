# HealthSlot — Technical Architecture

**Version:** 1.1  
**Project:** HealthSlot Clinic Management System

## 1. System Overview

HealthSlot is a clinic management web application designed for one clinic with multiple doctors and departments.

It consists of four independent portals:

1. Patient Portal
2. Doctor Portal
3. Receptionist Portal
4. Hospital Management Portal

The application supports two deployment modes:

- A complete downloadable local application.
- A separate static UI demonstration hosted through GitHub Pages.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python Flask |
| Database | SQLite |
| Python environment | venv |
| Version control | Git and GitHub |
| Public UI demonstration | GitHub Pages |

No MySQL or PostgreSQL server is required.

## 3. Application Architecture

Use the Flask application factory pattern with modular blueprints.

Suggested structure:

```text
HealthSlot/
│
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── extensions.py
│   │
│   ├── auth/
│   ├── patient/
│   ├── doctor/
│   ├── receptionist/
│   ├── management/
│   ├── appointments/
│   ├── queue/
│   ├── prescriptions/
│   ├── medicines/
│   ├── cart/
│   ├── bills/
│   │
│   ├── services/
│   ├── models/
│   ├── templates/
│   └── static/
│
├── instance/
│   └── healthslot.db
│
├── scripts/
│   ├── init_db.py
│   └── setup_staff.py
│
├── tests/
├── docs/
├── requirements.txt
├── .env.example
├── .gitignore
├── run.py
└── README.md
```

The final structure may be refined during implementation without changing the approved architecture.

## 4. Database Architecture

Use a single SQLite database file.

Requirements:

- Database initialization through a setup script.
- Foreign-key constraints enabled.
- Appropriate indexes and unique constraints.
- Parameterized queries or a suitable ORM.
- Database transactions for multi-step operations.
- Database backups and restore instructions.

The database must not be committed with private patient information.

## 5. Portal Architecture

### 5.1 Patient Portal

Entry point:

`/patient/login`

Responsibilities:

- Patient registration and authentication.
- Profile management.
- Department and doctor browsing.
- Appointment booking and history.
- Queue tracking.
- Prescription viewing and downloading.
- Medicine catalogue browsing.
- Independent medicine selection.
- Cart management.
- Estimated bill generation and download.

Patients can access only their own private records, prescriptions, carts and bills.

### 5.2 Doctor Portal

Entry point:

`/doctor/login`

Responsibilities:

- Doctor authentication.
- Assigned appointment management.
- Daily patient lists.
- Authorized patient information access.
- Consultation management.
- Digital prescription creation.
- Assigned queue management.
- Consultation completion.

Doctor accounts must already exist in the database.

No public doctor registration or automatic account creation is allowed.

### 5.3 Receptionist Portal

Entry point:

`/receptionist/login`

Responsibilities:

- Receptionist authentication.
- Walk-in patient registration.
- Existing patient search.
- Permitted patient information updates.
- Appointment booking on behalf of patients.
- Appointment assistance.
- Clinic-wide queue monitoring and management.

Receptionists can manage queues across the clinic, including updating permitted queue statuses and advancing queues.

Receptionists do not perform medical consultations or create prescriptions.

Receptionist accounts must already exist in the database.

No public receptionist registration or account-creation interface is required.

Receptionists have no medicine catalogue, cart or bill management responsibilities.

### 5.4 Hospital Management Portal

Entry point:

`/management/login`

Responsibilities:

- Department management.
- Doctor record management within approved permissions.
- Medicine catalogue management.
- Clinic-level operational analytics.

Exactly one administrator account is allowed.

The administrator account is created through controlled initial setup. No public registration or additional administrator creation is allowed.

The administrator manages the medicine catalogue but cannot access individual patient carts, bills or medicine-selection histories.

## 6. Staff Account Provisioning

Doctor and receptionist accounts are pre-registered in the SQLite database.

Account rules:

- Accounts must exist before login.
- Login succeeds only if the account exists, is active and has valid credentials.
- No public staff registration.
- No automatic account creation during login.
- No staff account-creation dashboard in the current scope.
- Passwords must be securely hashed.
- Initial account provisioning must use a controlled setup or database-seeding process.

## 7. Authentication and Authorization

Use secure session-based authentication.

Every protected backend route must verify:

1. User authentication.
2. Account status.
3. User role.
4. Resource ownership or assigned responsibility.

Hiding frontend buttons is not sufficient authorization.

Use password hashing, CSRF protection, input validation and secure session configuration.

## 8. Appointment and Queue Architecture

Appointments are linked to patients, doctors and departments.

Queue records are associated with individual appointments and doctor-specific daily queues.

Permissions:

- Doctors manage their assigned queues.
- Receptionists manage clinic queues.
- Doctors are responsible for medical consultation completion.
- Authorized queue actions must update queue history.
- Patients can only view their own queue information.

Queue position must be calculated from active waiting entries, not merely by subtracting token numbers.

Estimated waiting time is calculated using the remaining queue position and an estimated consultation duration.

Patient queue information can refresh periodically through frontend polling.

## 9. Prescription and Medicine Workflow

The workflow is:

1. Doctor completes a consultation and creates a digital prescription.
2. Prescription is stored in the database.
3. Patient views or downloads the prescription.
4. Patient independently browses the medicine catalogue.
5. Patient selects desired medicines, whether or not they appear in the prescription.
6. Patient adds medicines to their cart and adjusts quantities.
7. HealthSlot generates an estimated bill.
8. Patient takes the prescription and estimated bill to an external pharmacy and purchases manually.

The generated bill is not proof of purchase.

There is no pharmacy integration, online ordering, online payment or delivery tracking.

## 10. Cart and Bill Architecture

- Each patient can have only one active cart at a time.
- A patient can add, update and remove cart items.
- Generating a bill closes the current cart.
- The generated bill is retained in the patient's history.
- A new active cart can be created for future selections.
- Bill items preserve medicine names, quantities and price snapshots.
- Patients can view and download their own historical bills.
- The administrator cannot view individual carts or bills.

All generated bills must clearly state that prices are estimates and may differ from external pharmacy prices.

## 11. Deployment Architecture

### 11.1 Local Application

The complete application runs locally through Flask and SQLite.

Requirements:

- Windows setup instructions.
- Linux setup instructions.
- Python virtual environment.
- Dependency installation.
- Database initialization.
- Startup scripts.
- Backup and restore guidance.

After installation and dependency setup, the application must work without an internet connection.

For fully offline installation on a new computer, provide an offline dependency bundle or documented wheel-based installation method.

### 11.2 GitHub Pages Demonstration

The public demonstration is a separate static frontend.

It must:

- Display all four portal interfaces.
- Support navigation and simulated frontend interactions.
- Use fictional demonstration data.
- Clearly identify nonfunctional backend features.
- Never expose real credentials or patient information.

GitHub Pages will not host the Flask backend or SQLite database.

## 12. Security and Privacy

- Store password hashes, never plain-text passwords.
- Protect all portal routes.
- Enforce role-based authorization.
- Enforce patient record ownership.
- Protect prescription and bill downloads.
- Validate all user inputs.
- Use secure database operations.
- Keep secrets outside GitHub.
- Do not expose individual patient purchase information to management.

## 13. Architectural Constraints

The project must not introduce:

- Java.
- MySQL or PostgreSQL as the main database.
- A separate pharmacy portal.
- Online payment processing.
- Online medicine ordering.
- Delivery tracking.
- External pharmacy integration.
- Multiple administrator accounts.
- Public doctor or receptionist registration.

Any major architectural change requires approval before implementation.