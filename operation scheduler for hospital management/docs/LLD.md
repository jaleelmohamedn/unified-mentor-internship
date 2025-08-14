# LLD: Operation Scheduler

## Entities
- User: `{ uid, email, role }`
- Doctor: `{ id, name, speciality, phone }`
- Patient: `{ id, name, mrn, age, sex, phone }`
- OTSchedule:
  ```json
  {
    "otId": "OT-101",
    "surgeryDate": "YYYY-MM-DD",
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "surgeon": "Dr. X",
    "assistantSurgeon": "Dr. Y",
    "anesthesiologist": "Dr. Z",
    "anesthesiaType": "General",
    "nurses": ["A","B"],
    "materialsNeeded": ["Scalpel","Sutures"],
    "preOpNotes": "string",
    "postOpNotes": "string",
    "surgeryReportURL": "https://...",
    "patientId": "patients/{id}",
    "remarks": "string",
    "status": "Scheduled|Completed|Cancelled|Emergency|Postponed",
    "createdBy": "uid",
    "createdAt": 0,
    "updatedAt": 0
  }
  ```

## Key Flows
### Add Surgery
1. Admin opens form → validate → write `otSchedules`
2. Optional report upload to Storage → URL → update doc
3. Log `ADD_SCHEDULE`

### Reschedule / Status Change
- Update doc fields / status → log accordingly

## Access Patterns
- Filter by `surgeryDate`, `status`, `otId`
- Date range queries (`>= from` and `<= to`) require indexes if large scale

## Security
- Rules enforce: only admins mutate critical collections; all signed-in users can read schedules.
