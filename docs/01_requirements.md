# HealthSlot — Software Requirements Specification (SRS)

**Version:** 1.1  
**Project:** HealthSlot — Clinic Appointment and Management System  
**Status:** Initial requirements baseline

---

## 1. Project Overview

HealthSlot is a web-based clinic management application for a single clinic with multiple departments and doctors.

It provides four independent portals:

1. Patient
2. Doctor
3. Receptionist
4. Hospital Management (single Administrator)

All four portals use one shared Flask backend and one SQLite database.

The application must support two modes:

- **Full local application:** All implemented features work on a computer without requiring an internet connection after installation and dependency setup.
- **Public demonstration:** A UI-only version can be hosted through GitHub Pages. It does not require a live backend or database.

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python Flask |
| Database | SQLite |
| Python environment | venv |
| Version control | Git |
| Source repository | GitHub |
| Public UI demo | GitHub Pages |

SQLite database file: `healthslot.db`

The database must be created and initialized through an initialization script. A database containing real user data must not be committed to GitHub.

## 3. Application Architecture

- One application, not four separate applications.
- Four separate portal entry points and login screens.
- One shared Flask backend.
- One shared SQLite database.
- Role-based access control.
- Each user can access only the features and records permitted for their role.
- All dashboard information must come from database records through backend functionality.
- No hardcoded dashboard statistics or fake production records.

## 4. User Roles and Portals

### 4.1 Patient Portal

Separate entry point and login page.

**Registration and profile**
- Self-registration.
- Login and logout.
- View and update permitted profile details.
- View personal appointment and prescription records.

**Appointment booking**
- Browse departments.
- Browse available doctors.
- View available appointment dates and slots.
- Book an appointment.
- View booking confirmation and token details.
- View appointment history.
- View appointment status.

**Queue tracking**
- View current token.
- View own token.
- View queue position.
- View estimated waiting time.
- View status: Waiting, Now Serving or Completed.
- Receive updated queue information without manually refreshing the page.

**Digital prescriptions**
- View saved prescriptions.
- Download prescriptions.

**Medicine catalogue and bill generation**
- Browse the medicine catalogue.
- View medicine names, descriptions and reference prices.
- Independently select medicines, including medicines not listed in the doctor's prescription.
- Add selected medicines to a cart.
- Change quantities and remove cart items.
- View cart subtotal and estimated total.
- Generate and download a bill based on catalogue prices.
- View personal generated bills.

Prescription-required medicines must be clearly identified. HealthSlot must not imply that selecting a medicine authorizes its use. External pharmacy and applicable prescription checks remain necessary.

Patients must not be able to view another patient's profile, prescriptions, cart or bills.

### 4.2 Doctor Portal

Separate doctor login page.

Multiple doctors must be supported.

**Doctor profile and schedule**
- Secure login and logout.
- View assigned department and profile.
- View permitted availability and schedule information.

**Appointments**
- View assigned appointments.
- View daily patient list.
- View appointment details.
- Update permitted appointment and consultation statuses.

**Patient consultation**
- Access relevant patient information and history when authorized.
- Start consultation.
- Complete consultation.
- Record consultation details and appropriate treatment categories.

**Digital prescription**
- Create prescriptions.
- Select medicines from the medicine catalogue.
- Enter dosage, frequency, duration and instructions.
- Save prescriptions against the relevant patient and consultation.
- Allow the patient to view and download the saved prescription.

**Queue**
- View assigned doctor's queue.
- Identify the current and next eligible patient.
- Update consultation and queue status.
- Advance the queue after consultation completion.

Doctors must not access unrelated doctors' restricted records.

### 4.3 Receptionist Portal

Separate receptionist login page.

The receptionist's primary purpose is to assist patients who cannot comfortably use the technology themselves, including elderly patients and walk-in visitors.

**Patient assistance**
- Register new walk-in patients.
- Help patients create accounts.
- Search for existing patients.
- Update permitted patient information.
- Avoid creating duplicate patient records.

**Appointment management**
- Book appointments on behalf of patients.
- View appointment records.
- View department-wise and doctor-wise schedules.
- Assist with walk-in appointments.
- Manage permitted appointment changes.

**Queue assistance**
- View doctor-wise queues.
- Monitor waiting patients.
- Assist with permitted queue operations.
- View appointment and patient flow information.

**Explicit exclusion:** Receptionists have no responsibility for medicine catalogues, medicine prices, prescriptions, medicine carts or patient bills.

### 4.4 Hospital Management Portal — Single Administrator

Separate management login page.

Exactly one administrator account is permitted.

**Account rules**
- No public management registration.
- Administrator account is created through a controlled initial setup process.
- The application must prevent creation of additional administrator accounts through ordinary application functionality.
- Administrator credentials must be securely stored and protected.

**Clinic management**
- Manage departments.
- Manage doctor records and permitted account details.
- Manage medicine catalogue entries.
- Add new medicines.
- Edit medicine names, descriptions, reference prices and prescription-required classifications.
- Mark discontinued medicines as inactive rather than destroying historical references.

**Operational analytics**
- Monthly patient visit counts.
- Department-wise patient counts.
- Frequently requested treatment categories.
- Doctor-wise appointment statistics.
- Completed, pending and cancelled appointment counts.
- Aggregate medicine-demand statistics.

Reports must be calculated from database records.

**Privacy restriction**
- Administrator must not access individual patients' medicine carts or generated medicine bills.
- Administrator must not browse individual patients' selected medicine purchases.
- Medicine catalogue management and aggregate medicine-demand reporting must not expose individual patient purchases.

### 4.5 Access Control Summary

| Function | Patient | Doctor | Receptionist | Administrator |
|---|---|---|---|---|
| Self-registration | Yes | No | No | No |
| Walk-in registration assistance | No | No | Yes | No |
| Appointment booking | Yes | View assigned | Yes | Overview |
| Consultation | No | Yes | No | No |
| Create prescription | No | Yes | No | No |
| View own prescription | Yes | Yes, as authorized | No | No |
| Browse medicine catalogue | Yes | As needed | No | Yes |
| Manage medicine catalogue | No | No | No | Yes |
| Own cart and bill | Yes | No | No | No |
| View queue | Own queue | Assigned queue | Clinic queues | Overview |
| Operational analytics | No | Limited assigned data | Operational data | Yes |

## 5. Core Modules

### M1 — Patient and Service Management
- Patient registration.
- Patient profile management.
- Department and doctor information.
- Receptionist-assisted registration.

### M2 — Appointment Booking
- Doctor availability.
- Appointment slot management.
- Patient appointment booking.
- Appointment confirmation.
- Appointment status management.
- Prevention of duplicate bookings for the same slot.

### M3 — Queue and Appointment Tracking
- Token assignment.
- Current token.
- Patient token.
- Queue position.
- Estimated waiting time.
- Waiting, Now Serving and Completed statuses.
- Queue advancement after consultation completion.
- Automatic or periodic frontend updates.

Queue calculations must account for skipped, cancelled and completed appointments. Estimated waiting times should be clearly labelled as estimates and should use a configurable or calculated consultation duration.

### M4 — Digital Prescription, Medicine Catalogue and Bill Generation
- Doctor-created digital prescriptions.
- Central medicine catalogue.
- Independent patient medicine selection.
- Shopping cart.
- Quantity management.
- Reference-price calculation.
- Downloadable bill.
- Downloadable prescription.
- Patient-specific purchase and bill privacy.

The generated bill is only an estimate based on HealthSlot catalogue prices. An external pharmacy confirms actual availability and final prices.

## 6. Explicitly Out of Scope

The initial version will not include:

- Separate pharmacy dashboard.
- Online pharmacy ordering or order confirmation.
- Medicine delivery or delivery tracking.
- External pharmacy integration.
- UPI integration.
- Online payment gateway.
- Payment processing.
- Pharmacy stock confirmation.
- Multiple administrator accounts.

## 7. Functional and Technical Requirements

### Authentication and security
- Separate login screens for each portal.
- Secure password hashing.
- Role-based authorization on the backend.
- Secure session handling.
- Input validation.
- SQL injection protection through parameterized queries.
- Protection against unauthorized access to patient records.
- No passwords, secret keys or database credentials committed to GitHub.

### Database
- SQLite is the application's database.
- Foreign keys must be enabled.
- Appropriate primary keys, foreign keys, unique constraints and indexes must be defined.
- Related database changes must use transactions.
- Database initialization must be repeatable and documented.
- Historical prescription and bill records must retain appropriate references even when catalogue entries are discontinued.

### Interface
- Professional, clean and minimal design.
- Calm light backgrounds with teal/green accents.
- Responsive layouts.
- Consistent navigation.
- Clear status indicators.
- Readable typography.
- Accessible forms and feedback messages.

### Offline operation
- The full application must run locally after installation and dependency setup.
- All core functionality must work without an external database service.
- The application must not require internet access for normal local operation.
- Include setup and run instructions for Windows and Linux.

### Public demonstration
- Provide a UI-only static version for GitHub Pages.
- Demonstrate all four portal interfaces.
- Clearly identify demonstration data and nonfunctional backend features.
- Do not expose real patient data or credentials.
- The public static demo must not be mistaken for the full working application.

## 8. Testing Requirements

Test at least:

- Registration and login for permitted roles.
- Role-based access restrictions.
- Duplicate patient prevention.
- Appointment slot conflict prevention.
- Doctor consultation workflow.
- Prescription creation and retrieval.
- Queue advancement and waiting-time calculation.
- Medicine catalogue management.
- Independent medicine selection.
- Cart quantity and price calculations.
- Bill generation and download.
- Patient-to-patient data isolation.
- Administrator restriction to one account.
- Local offline operation.
- Public UI demonstration.

Use fictional test data only.

## 9. Development Milestones

1. Finalize requirements and architecture.
2. Create project structure and Python environment.
3. Design and initialize SQLite schema.
4. Implement authentication and role permissions.
5. Implement Patient Portal.
6. Implement Doctor Portal.
7. Implement Receptionist Portal.
8. Implement Administrator Portal.
9. Integrate prescriptions, catalogue, cart and bill generation.
10. Implement queue updates and analytics.
11. Test all workflows and access restrictions.
12. Prepare offline setup package and documentation.
13. Prepare static GitHub Pages demonstration.
14. Push the completed project to GitHub.

## 10. Completion Criteria

HealthSlot is considered ready for its initial release when:

- All four portals have independent entry points.
- The full local application works with SQLite.
- Core workflows work end to end.
- Backend access restrictions are enforced.
- Patient-specific records remain private.
- The medicine cart and bill workflow works.
- The application runs offline after setup.
- A separate UI-only public demonstration is available.
- Setup, run and testing instructions are documented.

**This SRS is the baseline specification. Any changes to functionality or architecture must be documented before implementation.**