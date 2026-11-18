
# HealthSlot — SQLite Database Design

**Version:** 1.1  
**Database:** SQLite

## 1. Database Overview

HealthSlot uses one SQLite database file:

`instance/healthslot.db`

The database stores:

- User accounts and roles.
- Patient, doctor and receptionist profiles.
- Administrator information.
- Departments and doctor availability.
- Appointments and appointment history.
- Consultations.
- Queue entries and queue history.
- Prescriptions and prescription items.
- Medicine catalogue.
- Patient carts and cart items.
- Generated bills and bill items.

Enable SQLite foreign-key enforcement for every database connection.

## 2. Users and Authentication

### 2.1 `users`

Stores authentication information for all four roles.

| Column | Type | Constraints |
|---|---|---|
| user_id | INTEGER | Primary Key |
| username | TEXT | Unique, Not Null |
| email | TEXT | Unique, Not Null |
| password_hash | TEXT | Not Null |
| role | TEXT | Not Null |
| account_status | TEXT | Not Null |
| created_at | DATETIME | Not Null |
| updated_at | DATETIME | Not Null |

Allowed roles:

- patient
- doctor
- receptionist
- administrator

Passwords must be stored as secure hashes.

### 2.2 `patients`

| Column | Type | Constraints |
|---|---|---|
| patient_id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key, Unique |
| full_name | TEXT | Not Null |
| date_of_birth | DATE | Optional |
| phone | TEXT | Optional |
| address | TEXT | Optional |
| created_at | DATETIME | Not Null |

Each patient profile belongs to one user account.

### 2.3 `doctors`

| Column | Type | Constraints |
|---|---|---|
| doctor_id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key, Unique |
| department_id | INTEGER | Foreign Key |
| full_name | TEXT | Not Null |
| specialization | TEXT | Optional |
| qualification | TEXT | Optional |
| consultation_duration | INTEGER | Not Null |
| availability_status | TEXT | Not Null |

Doctor accounts must already exist in the database before login.

No public doctor registration is required.

### 2.4 `receptionists`

| Column | Type | Constraints |
|---|---|---|
| receptionist_id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key, Unique |
| full_name | TEXT | Not Null |

Receptionist accounts must already exist in the database before login.

No public receptionist registration is required.

### 2.5 `administrators`

| Column | Type | Constraints |
|---|---|---|
| administrator_id | INTEGER | Primary Key |
| user_id | INTEGER | Foreign Key, Unique |
| singleton_key | INTEGER | Unique, Not Null, Default 1 |

Enforce the singleton rule so that exactly one administrator account can be associated with the application.

The initial administrator account is created through controlled setup.

## 3. Department and Availability Tables

### 3.1 `departments`

| Column | Type | Constraints |
|---|---|---|
| department_id | INTEGER | Primary Key |
| department_name | TEXT | Unique, Not Null |
| description | TEXT | Optional |
| status | TEXT | Not Null |

### 3.2 `doctor_availability`

| Column | Type | Constraints |
|---|---|---|
| availability_id | INTEGER | Primary Key |
| doctor_id | INTEGER | Foreign Key |
| available_date | DATE | Not Null |
| start_time | TIME | Not Null |
| end_time | TIME | Not Null |
| slot_duration | INTEGER | Not Null |
| status | TEXT | Not Null |

This table defines doctor availability and appointment slots.

## 4. Appointment Tables

### 4.1 `appointments`

| Column | Type | Constraints |
|---|---|---|
| appointment_id | INTEGER | Primary Key |
| patient_id | INTEGER | Foreign Key |
| doctor_id | INTEGER | Foreign Key |
| department_id | INTEGER | Foreign Key |
| appointment_date | DATE | Not Null |
| appointment_time | TIME | Not Null |
| token_number | INTEGER | Not Null |
| booking_source | TEXT | Not Null |
| status | TEXT | Not Null |
| created_at | DATETIME | Not Null |
| updated_at | DATETIME | Not Null |

Booking sources:

- patient
- receptionist

Appointment statuses:

- booked
- confirmed
- cancelled
- completed
- no_show

Prevent conflicting bookings through appropriate database constraints and transactional validation.

Token numbers must be unique within the relevant doctor and appointment date.

### 4.2 `appointment_status_history`

| Column | Type | Constraints |
|---|---|---|
| history_id | INTEGER | Primary Key |
| appointment_id | INTEGER | Foreign Key |
| previous_status | TEXT | Optional |
| new_status | TEXT | Not Null |
| changed_by | INTEGER | Foreign Key to users |
| changed_at | DATETIME | Not Null |

Maintains appointment status history.

## 5. Consultation Tables

### 5.1 `consultations`

| Column | Type | Constraints |
|---|---|---|
| consultation_id | INTEGER | Primary Key |
| appointment_id | INTEGER | Foreign Key, Unique |
| patient_id | INTEGER | Foreign Key |
| doctor_id | INTEGER | Foreign Key |
| consultation_notes | TEXT | Optional |
| treatment_category | TEXT | Optional |
| started_at | DATETIME | Optional |
| completed_at | DATETIME | Optional |
| status | TEXT | Not Null |

A consultation belongs to an appointment.

Only the assigned doctor can perform medical consultation operations.

Receptionists cannot create prescriptions or complete medical consultations.

## 6. Queue Tables

### 6.1 `queue`

| Column | Type | Constraints |
|---|---|---|
| queue_id | INTEGER | Primary Key |
| appointment_id | INTEGER | Foreign Key, Unique |
| patient_id | INTEGER | Foreign Key |
| doctor_id | INTEGER | Foreign Key |
| queue_date | DATE | Not Null |
| token_number | INTEGER | Not Null |
| status | TEXT | Not Null |
| joined_at | DATETIME | Not Null |
| updated_at | DATETIME | Not Null |

Queue statuses:

- waiting
- now_serving
- completed
- skipped
- cancelled

Token numbers must be unique per doctor per queue date.

### 6.2 `queue_history`

| Column | Type | Constraints |
|---|---|---|
| history_id | INTEGER | Primary Key |
| queue_id | INTEGER | Foreign Key |
| previous_status | TEXT | Optional |
| new_status | TEXT | Not Null |
| changed_by | INTEGER | Foreign Key to users |
| changed_at | DATETIME | Not Null |

Both doctors and receptionists can perform authorized queue-management actions.

Permission rules:

- Doctors can manage their assigned queues.
- Receptionists can manage clinic-wide queues.
- Doctors are responsible for completing medical consultations.
- Every queue change must be recorded in queue history.

Queue position must be calculated from eligible waiting entries rather than simply subtracting token numbers.

Estimated waiting time:

`Queue Position × Estimated Consultation Duration`

The result is an estimate, not a guaranteed waiting time.

## 7. Prescription Tables

### 7.1 `prescriptions`

| Column | Type | Constraints |
|---|---|---|
| prescription_id | INTEGER | Primary Key |
| consultation_id | INTEGER | Foreign Key, Unique |
| patient_id | INTEGER | Foreign Key |
| doctor_id | INTEGER | Foreign Key |
| prescribed_at | DATETIME | Not Null |
| general_instructions | TEXT | Optional |

A prescription is linked to a consultation.

### 7.2 `prescription_items`

| Column | Type | Constraints |
|---|---|---|
| item_id | INTEGER | Primary Key |
| prescription_id | INTEGER | Foreign Key |
| medicine_id | INTEGER | Optional Foreign Key |
| medicine_name_snapshot | TEXT | Not Null |
| dosage | TEXT | Not Null |
| frequency | TEXT | Not Null |
| duration | TEXT | Not Null |
| instructions | TEXT | Optional |

Preserve medicine name information even if the catalogue entry changes later.

## 8. Medicine Catalogue

### 8.1 `medicines`

| Column | Type | Constraints |
|---|---|---|
| medicine_id | INTEGER | Primary Key |
| medicine_name | TEXT | Not Null |
| description | TEXT | Optional |
| dosage_form | TEXT | Optional |
| strength | TEXT | Optional |
| reference_price | REAL | Not Null |
| prescription_required | INTEGER | Not Null |
| status | TEXT | Not Null |
| created_at | DATETIME | Not Null |
| updated_at | DATETIME | Not Null |

Rules:

- Only administrators can add or modify catalogue entries.
- Inactive medicines cannot be newly added to carts.
- Discontinued medicines should be deactivated rather than deleted.
- Historical prescription and bill records must remain intact.
- Prescription-required classification must be displayed to patients.

## 9. Cart Tables

### 9.1 `carts`

| Column | Type | Constraints |
|---|---|---|
| cart_id | INTEGER | Primary Key |
| patient_id | INTEGER | Foreign Key |
| status | TEXT | Not Null |
| created_at | DATETIME | Not Null |
| updated_at | DATETIME | Not Null |
| closed_at | DATETIME | Optional |

Cart statuses:

- active
- generated
- abandoned

**Important constraint:** Each patient can have only one active cart at a time.

Implement this using a SQLite partial unique index on `patient_id` for rows whose status is `active`.

When a bill is generated, the cart changes from `active` to `generated`.

A new active cart can be created for the patient's next selection session.

### 9.2 `cart_items`

| Column | Type | Constraints |
|---|---|---|
| cart_item_id | INTEGER | Primary Key |
| cart_id | INTEGER | Foreign Key |
| medicine_id | INTEGER | Foreign Key |
| quantity | INTEGER | Not Null |
| unit_price_snapshot | REAL | Not Null |
| added_at | DATETIME | Not Null |

Rules:

- Quantity must be a positive integer.
- Only the owning patient can modify their cart.
- Store a price snapshot when an item is added.
- Validate the current catalogue status before adding an item.
- Recalculate totals on the backend.

## 10. Bill Tables

### 10.1 `bills`

| Column | Type | Constraints |
|---|---|---|
| bill_id | INTEGER | Primary Key |
| patient_id | INTEGER | Foreign Key |
| cart_id | INTEGER | Foreign Key, Unique |
| bill_number | TEXT | Unique, Not Null |
| subtotal | REAL | Not Null |
| total_amount | REAL | Not Null |
| generated_at | DATETIME | Not Null |
| status | TEXT | Not Null |

Generated bills must be retained in the patient's history.

### 10.2 `bill_items`

| Column | Type | Constraints |
|---|---|---|
| bill_item_id | INTEGER | Primary Key |
| bill_id | INTEGER | Foreign Key |
| medicine_id | INTEGER | Optional Foreign Key |
| medicine_name_snapshot | TEXT | Not Null |
| quantity | INTEGER | Not Null |
| unit_price | REAL | Not Null |
| line_total | REAL | Not Null |

Bill item information must be preserved independently of future catalogue changes.

Bills are estimates based on catalogue reference prices.

No payment or purchase confirmation is recorded.

## 11. Relationships

- One user has one role-specific profile.
- One department can have multiple doctors.
- One doctor can have multiple availability records.
- One patient can have multiple appointments.
- One doctor can have multiple appointments.
- One appointment can have one consultation.
- One appointment can have one queue entry.
- One consultation can have one prescription.
- One prescription can have multiple prescription items.
- One patient can have multiple historical carts.
- One patient can have only one active cart.
- One cart can have multiple cart items.
- One generated cart can have one bill.
- One bill can have multiple bill items.

## 12. Privacy and Integrity Rules

1. Patients can access only their own records.
2. Doctors can access records relevant to their assigned work.
3. Receptionists can access information required for appointment and queue operations.
4. Administrators can access aggregate operational analytics.
5. Administrators cannot view individual patient carts or bills.
6. Receptionists cannot access medicine catalogue management or patient bills.
7. Historical prescriptions and bills must remain consistent.
8. Foreign-key relationships must be enforced.
9. Multi-step operations must use database transactions.
10. Sensitive data must not be exposed through API responses or logs.

## 13. Database Initialization

The initialization process must:

- Create all tables.
- Create indexes and constraints.
- Enable foreign-key enforcement.
- Create the initial administrator account through controlled setup.
- Support pre-registration of doctor and receptionist accounts.
- Never insert duplicate staff accounts on repeated initialization.
- Avoid inserting fake production records.

Use separate development/demo seed data when sample records are needed.

**The database implementation must remain consistent with the requirements and architecture documents.**