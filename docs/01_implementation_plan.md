# HealthSlot — Implementation Plan

**Version:** 1.0  
**Project:** HealthSlot Clinic Management System

## 1. Development Strategy

HealthSlot will be developed incrementally using a modular architecture.

The application must be functional at every major milestone. Each phase must be implemented, tested and verified before moving to the next phase.

Claude Code must:
- Read all existing planning documents before implementation.
- Follow the approved architecture and database design.
- Avoid unnecessary technologies and dependencies.
- Explain major implementation decisions.
- Never replace working features without a reason.
- Keep the project runnable throughout development.

## 2. Development Phases

### Phase 1 — Project Foundation

**Objective:** Establish the Flask application structure.

Tasks:
- Create the Flask application.
- Implement the application factory pattern.
- Configure environment variables.
- Set up SQLite.
- Configure the Python virtual environment.
- Create database initialization scripts.
- Set up modular blueprints.
- Create shared templates and static directories.
- Add error handling and logging.

**Completion criteria:**
- Flask application starts successfully.
- SQLite database initializes.
- Application structure is modular.
- Windows and Linux startup instructions work.

### Phase 2 — Authentication and Authorization

**Objective:** Establish secure access to all four portals.

Tasks:
- Implement patient registration and login.
- Implement doctor login.
- Implement receptionist login.
- Implement administrator login.
- Implement logout and session management.
- Add password hashing.
- Add role-based authorization.
- Protect portal routes.
- Prevent unauthorized cross-portal access.

**Completion criteria:**
- Each portal has its own login page.
- Users can access only their permitted portal.
- Invalid or inactive accounts cannot log in.
- Doctor and receptionist accounts must already exist.
- Exactly one administrator account is supported.
- Patient registration works.

### Phase 3 — Patient Portal

**Objective:** Implement the patient-facing appointment experience.

Tasks:
- Create patient dashboard.
- Implement patient profile management.
- Display departments and doctors.
- Display doctor availability.
- Implement appointment booking.
- Generate appointment tokens.
- Display appointment history.
- Implement appointment cancellation.
- Add suitable empty states and validation.

**Completion criteria:**
- Patients can book appointments.
- Duplicate slot bookings are prevented.
- Patients can view only their own records.
- Appointment status is displayed correctly.

### Phase 4 — Doctor Portal

**Objective:** Implement consultation and prescription management.

Tasks:
- Create doctor dashboard.
- Display assigned appointments.
- Display daily patient lists.
- Implement authorized patient information access.
- Implement consultation creation and updates.
- Implement digital prescription creation.
- Save prescriptions and prescription items.
- Implement consultation completion.

**Completion criteria:**
- Doctors see only their assigned work.
- Consultations are linked to appointments.
- Prescriptions are linked to the correct patient and doctor.
- Completed consultations update appointment status appropriately.

### Phase 5 — Queue Management

**Objective:** Implement real-time-style queue tracking.

Tasks:
- Generate doctor-specific daily tokens.
- Maintain queue status.
- Calculate queue position.
- Calculate estimated waiting time.
- Implement queue advancement.
- Record queue status history.
- Add periodic frontend refresh.

**Completion criteria:**
- Patients can track their own queue.
- Doctors can monitor their assigned queues.
- Receptionists can monitor clinic queues.
- Completed and cancelled appointments are excluded from waiting counts.
- Queue advancement works correctly.

### Phase 6 — Receptionist Portal

**Objective:** Support walk-in patients and appointment assistance.

Tasks:
- Create receptionist dashboard.
- Search existing patients.
- Register walk-in patients.
- Prevent duplicate patient records.
- Update permitted patient information.
- Book appointments on behalf of patients.
- View appointment schedules.
- Monitor doctor-wise queues.
- Implement permitted appointment and queue operations.

**Completion criteria:**
- Receptionists can assist walk-in patients.
- Existing patients can be identified.
- Appointment assistance works.
- Receptionists cannot access medicine management, carts or bills.

### Phase 7 — Medicine Catalogue, Cart and Bills

**Objective:** Implement the patient medicine-selection workflow.

Tasks:
- Implement administrator medicine catalogue management.
- Display active medicines to patients.
- Implement medicine search.
- Implement patient cart.
- Add, update and remove cart items.
- Calculate estimated totals.
- Generate downloadable bills.
- Preserve historical medicine names and price snapshots.
- Clearly label bills as estimates.

**Completion criteria:**
- Only administrators can modify the catalogue.
- Patients can independently select catalogue medicines.
- Patients can access only their own carts and bills.
- Bills are generated correctly.
- No online payment or pharmacy integration exists.

### Phase 8 — Management Dashboard and Analytics

**Objective:** Provide clinic-level operational insights.

Tasks:
- Create administrator dashboard.
- Display monthly patient visits.
- Display department-wise statistics.
- Display doctor workload.
- Display appointment statistics.
- Display aggregate medicine-demand statistics.
- Use database-driven calculations.

**Completion criteria:**
- Analytics reflect actual database records.
- Empty databases display appropriate empty states.
- Individual patient carts and bills remain private.
- No hardcoded production statistics are displayed.

### Phase 9 — Interface Refinement

**Objective:** Improve usability and consistency.

Tasks:
- Establish consistent visual styling.
- Improve dashboard layouts.
- Make interfaces responsive.
- Add navigation and clear feedback.
- Add loading, empty and error states.
- Improve form validation.
- Ensure accessibility basics.

**Completion criteria:**
- All four portals have consistent visual language.
- Interfaces work on desktop and mobile screens.
- Navigation is clear.
- Forms provide understandable feedback.

### Phase 10 — Testing and Security

**Objective:** Verify the complete application.

Tasks:
- Test authentication.
- Test role permissions.
- Test appointment conflicts.
- Test queue calculations.
- Test prescription access.
- Test cart and bill calculations.
- Test administrator restrictions.
- Test invalid inputs.
- Test database relationships.
- Test file downloads.
- Test session and CSRF protection.

**Completion criteria:**
- Critical workflows pass.
- Unauthorized access is blocked.
- Patient data isolation works.
- Database integrity is maintained.
- No critical errors remain.

### Phase 11 — Local Application Packaging

**Objective:** Make HealthSlot downloadable and runnable.

Tasks:
- Prepare Windows setup scripts.
- Prepare Linux setup scripts.
- Add dependency installation instructions.
- Add database initialization instructions.
- Add application startup scripts.
- Document environment configuration.
- Document backup and restore procedures.
- Provide an offline dependency installation option where practical.

**Completion criteria:**
- A new user can set up the application.
- SQLite initializes correctly.
- The application runs locally.
- Core functionality works without an internet connection after installation.

### Phase 12 — GitHub Pages UI Demonstration

**Objective:** Publish a static demonstration of all four portals.

Tasks:
- Create a separate static demonstration build.
- Reproduce the four portal interfaces.
- Add navigation between portal screens.
- Use fictional demonstration data.
- Simulate interface interactions using JavaScript.
- Clearly identify nonfunctional backend features.
- Configure GitHub Pages deployment.

**Completion criteria:**
- All four portals can be demonstrated through a public link.
- Navigation and frontend interactions work.
- No real patient data or credentials are exposed.
- No claim is made that the static demo provides real authentication or database persistence.

## 3. Development Rules

1. Do not implement all phases simultaneously.
2. Complete and test each phase before proceeding.
3. Maintain compatibility with existing modules.
4. Do not introduce Java or an unapproved framework.
5. Use Flask, SQLite, HTML, CSS and JavaScript.
6. Keep secrets outside the repository.
7. Never commit a populated database containing private information.
8. Use fictional data only for demonstrations.
9. Do not remove previously working functionality without approval.
10. Update documentation when implementation decisions change.

## 4. Final Project Deliverables

The completed HealthSlot project must contain:

- Full Flask application.
- Four independent portals.
- SQLite database and initialization scripts.
- Authentication and authorization.
- Appointment booking.
- Consultation and prescription management.
- Queue tracking.
- Medicine catalogue.
- Patient cart and estimated bill generation.
- Administrator analytics.
- Automated tests.
- Windows and Linux setup instructions.
- Offline installation guidance.
- GitHub repository.
- GitHub Pages UI demonstration.

## 5. Final Acceptance Criteria

HealthSlot is considered complete when:

- All four portals function independently.
- Core workflows operate correctly.
- Role-based access control is enforced.
- Patient information is protected.
- Appointment and queue workflows are consistent.
- Prescription and bill generation work.
- Administrator analytics use actual database records.
- Local installation works on Windows and Linux.
- The application works offline after installation.
- The static public demonstration works independently.
- Documentation is sufficient for another developer to install and understand the project.