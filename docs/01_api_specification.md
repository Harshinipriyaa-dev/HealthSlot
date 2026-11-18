# HealthSlot — API Specification

**Version:** 1.1  
**Backend:** Python Flask  
**Database:** SQLite

## 1. API Architecture

The Flask backend exposes routes for four independent portals:

- Patient
- Doctor
- Receptionist
- Hospital Management

All protected endpoints must enforce authentication, role permissions and resource ownership.

Use consistent JSON responses.

Success:

```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "The selected appointment slot is unavailable"
}
```

## 2. Authentication APIs

### Patient

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/patient/register | Patient registration |
| POST | /api/patient/login | Patient login |
| POST | /api/patient/logout | Patient logout |
| GET | /api/patient/profile | View own profile |
| PUT | /api/patient/profile | Update own profile |

### Doctor

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/doctor/login | Doctor login |
| POST | /api/doctor/logout | Doctor logout |
| GET | /api/doctor/profile | View doctor profile |

Doctor accounts must already exist in the database. There is no public registration or account-creation endpoint.

### Receptionist

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/receptionist/login | Receptionist login |
| POST | /api/receptionist/logout | Receptionist logout |
| GET | /api/receptionist/profile | View receptionist profile |

Receptionist accounts must already exist in the database. There is no public registration or account-creation endpoint.

### Administrator

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/management/login | Administrator login |
| POST | /api/management/logout | Administrator logout |
| GET | /api/management/profile | View administrator profile |

Exactly one administrator account is supported. Its initial creation is handled through controlled setup.

## 3. Patient APIs

### Departments and Doctors

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/departments | List active departments |
| GET | /api/doctors | List active doctors |
| GET | /api/doctors/{id} | View permitted doctor details |
| GET | /api/doctors/{id}/availability | View available slots |

### Appointments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/patient/appointments | Book appointment |
| GET | /api/patient/appointments | View own appointments |
| GET | /api/patient/appointments/{id} | View own appointment |
| PUT | /api/patient/appointments/{id}/cancel | Cancel eligible appointment |

The backend must validate slot availability and prevent conflicting bookings.

### Queue Tracking

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/patient/queue | View own queue information |
| GET | /api/patient/appointments/{id}/queue | View appointment queue information |

Responses should include:

- Patient token.
- Current token.
- Queue position.
- Estimated waiting time.
- Queue status.

The patient can view queue information but cannot modify it.

The frontend may refresh queue information periodically.

### Prescriptions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/patient/prescriptions | List own prescriptions |
| GET | /api/patient/prescriptions/{id} | View own prescription |
| GET | /api/patient/prescriptions/{id}/download | Download prescription PDF |

Patients must not access another patient's prescriptions.

### Medicine Catalogue

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/medicines | Browse active medicines |
| GET | /api/medicines/{id} | View medicine details |
| GET | /api/medicines/search | Search medicines |

Patients can browse the catalogue but cannot modify it.

### Cart

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/patient/cart | View own active cart |
| POST | /api/patient/cart/items | Add medicine |
| PUT | /api/patient/cart/items/{id} | Update quantity |
| DELETE | /api/patient/cart/items/{id} | Remove medicine |

Rules:

- Each patient has one active cart at a time.
- Only the owning patient can modify it.
- Quantities must be positive integers.
- Inactive catalogue medicines cannot be added.
- Prices must be validated on the backend.

### Bill Generation

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/patient/bills | Generate bill from active cart |
| GET | /api/patient/bills | List own historical bills |
| GET | /api/patient/bills/{id} | View own bill |
| GET | /api/patient/bills/{id}/download | Download bill PDF |

Bill generation must:

1. Validate the active cart.
2. Calculate totals on the backend.
3. Preserve medicine names and price snapshots.
4. Create a bill record.
5. Change the cart status from active to generated.
6. Preserve the generated bill in patient history.

A new active cart can be created for future selections.

Bills are estimates, not confirmed pharmacy invoices or proof of purchase.

## 4. Doctor APIs

### Dashboard and Appointments

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/doctor/dashboard | Retrieve dashboard information |
| GET | /api/doctor/appointments | View assigned appointments |
| GET | /api/doctor/appointments/today | View today's patients |

### Consultation

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/doctor/patients/{id} | View authorized patient information |
| POST | /api/doctor/consultations | Start consultation |
| GET | /api/doctor/consultations/{id} | View consultation |
| PUT | /api/doctor/consultations/{id} | Update consultation |
| POST | /api/doctor/consultations/{id}/complete | Complete consultation |

Only the assigned doctor can perform medical consultation operations.

### Prescriptions

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/doctor/consultations/{id}/prescriptions | Create prescription |
| GET | /api/doctor/prescriptions | View created prescriptions |
| GET | /api/doctor/prescriptions/{id} | View prescription details |

Prescription creation must validate medicine references and required dosage information.

### Doctor Queue

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/doctor/queue | View assigned queue |
| PUT | /api/doctor/queue/{id}/status | Update assigned queue status |
| POST | /api/doctor/queue/{id}/complete | Complete eligible queue entry |

Doctors can manage only their assigned queues.

Completing a consultation must update the corresponding appointment and queue records consistently.

## 5. Receptionist APIs

### Patient Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/receptionist/patients | Register walk-in patient |
| GET | /api/receptionist/patients | Search patients |
| GET | /api/receptionist/patients/{id} | View permitted patient details |
| PUT | /api/receptionist/patients/{id} | Update permitted details |

Registration must check for existing patient records to prevent duplicates.

### Appointment Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/receptionist/appointments | Book appointment for patient |
| GET | /api/receptionist/appointments | View clinic appointments |
| GET | /api/receptionist/appointments/{id} | View appointment details |
| PUT | /api/receptionist/appointments/{id} | Update permitted appointment details |

### Queue Management

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/receptionist/queues | View clinic queues |
| GET | /api/receptionist/queues/{doctor_id} | View doctor-specific queue |
| PUT | /api/receptionist/queues/{id}/status | Update queue status |
| POST | /api/receptionist/queues/{id}/advance | Advance eligible queue |

Receptionists can manage queues across the clinic.

They can perform permitted queue operations, including status updates and queue advancement.

However:

- Receptionists cannot perform medical consultations.
- Receptionists cannot create prescriptions.
- Consultation completion remains the doctor's medical responsibility.
- Every queue action must be recorded in queue history.

Receptionists cannot access medicine catalogue management, patient carts or generated bills.

## 6. Administrator APIs

### Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/management/dashboard | Retrieve management dashboard |
| GET | /api/management/analytics | Retrieve aggregate analytics |

### Department Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/management/departments | Add department |
| GET | /api/management/departments | List departments |
| PUT | /api/management/departments/{id} | Update department |
| PUT | /api/management/departments/{id}/status | Activate/deactivate department |

### Doctor Records

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/management/doctors | List doctor records |
| PUT | /api/management/doctors/{id} | Update permitted doctor details |
| PUT | /api/management/doctors/{id}/status | Activate/deactivate doctor |

These endpoints do not create doctor login accounts.

Doctor accounts must already be registered in the database through controlled setup.

### Receptionist Records

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/management/receptionists | List receptionist records |
| PUT | /api/management/receptionists/{id} | Update permitted receptionist details |
| PUT | /api/management/receptionists/{id}/status | Activate/deactivate receptionist |

These endpoints do not create receptionist login accounts.

Receptionist accounts must already be registered in the database through controlled setup.

### Medicine Catalogue Management

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/management/medicines | Add medicine |
| GET | /api/management/medicines | View catalogue |
| PUT | /api/management/medicines/{id} | Update medicine |
| PUT | /api/management/medicines/{id}/status | Activate/deactivate medicine |

Only the administrator can modify catalogue entries.

### Analytics

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/management/analytics/patients | Aggregate patient visits |
| GET | /api/management/analytics/departments | Department statistics |
| GET | /api/management/analytics/doctors | Doctor workload statistics |
| GET | /api/management/analytics/appointments | Appointment statistics |
| GET | /api/management/analytics/medicines | Aggregate medicine-demand statistics |

Analytics must not expose individual patient carts, bills or purchase histories.

## 7. API Security Requirements

Every protected endpoint must verify:

1. Authentication.
2. Account status.
3. User role.
4. Resource ownership.
5. Assigned responsibility where applicable.

Implement:

- Secure session authentication.
- CSRF protection.
- Input validation.
- Parameterized database queries.
- Appropriate HTTP status codes.
- Authorization checks.
- Safe file downloads.
- Consistent error responses.

Never rely on frontend role checks alone.

## 8. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Conflict |
| 500 | Internal server error |

Do not expose passwords, session secrets, SQL errors or sensitive patient information in error responses.

## 9. Implementation Notes

Implement endpoints using modular Flask blueprints.

Keep:

- Business logic in service modules.
- Database operations in the data-access layer.
- Authentication and authorization in reusable middleware or decorators.
- Request validation separate from business logic.

Exact request and response schemas must be documented during implementation.

Any API changes must remain consistent with the requirements, architecture and database design documents.