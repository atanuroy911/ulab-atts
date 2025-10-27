# System Workflow Guide

## 📋 Complete Usage Workflow

### Scenario 1: First Class Session (New Course)

```
Day 1 - First Class
├─ 1. Open Dashboard (http://localhost:3000)
├─ 2. Scroll to "Create New Session"
├─ 3. Enter Course Details:
│     ├─ Course Name: "Introduction to Computer Science"
│     ├─ Course ID: "CS101"
│     ├─ Semester: "Fall 2025"
│     └─ Section: "A"
├─ 4. Paste Student List:
│     S001,Alice Johnson
│     S002,Bob Smith
│     S003,Charlie Brown
│     ... (all students)
├─ 5. Click "Start Attendance Session"
├─ 6. QR Code Generated ✓
├─ 7. Display QR to Students
├─ 8. Students Scan & Mark Attendance
├─ 9. Monitor Real-time Updates
└─ 10. Click "Export & End Session"
      ├─ Downloads: attendance_CS101_Fall2025_A_2025-10-27.json
      └─ Downloads: attendance_CS101_Fall2025_A_2025-10-27.csv
      └─ MongoDB Cleared ✓
```

### Scenario 2: Same Class, Different Day (Resume Session)

```
Day 2 - Same Class, New Session
├─ 1. Open Dashboard (http://localhost:3000)
├─ 2. "Resume Previous Session" Section
├─ 3. Click "Choose File"
├─ 4. Upload: attendance_CS101_Fall2025_A_2025-10-27.json
│     (or the CSV file)
├─ 5. Session Loaded ✓
│     ├─ All students restored
│     ├─ Attendance reset to zero
│     └─ New QR code generated
├─ 6. Display QR to Students
├─ 7. Students Mark Today's Attendance
├─ 8. Monitor Real-time Updates
└─ 9. Click "Export & End Session"
      ├─ Downloads: attendance_CS101_Fall2025_A_2025-10-28.json
      └─ Downloads: attendance_CS101_Fall2025_A_2025-10-28.csv
      └─ MongoDB Cleared ✓
```

### Scenario 3: Multiple Classes

```
Same Day - Multiple Classes
├─ Class 1 (CS101 - Section A)
│   ├─ Create/Resume Session
│   ├─ Students Mark Attendance
│   └─ Export & End Session
│
├─ Class 2 (CS101 - Section B)
│   ├─ Create/Resume Session
│   ├─ Students Mark Attendance
│   └─ Export & End Session
│
└─ Class 3 (CS201 - Section A)
    ├─ Create/Resume Session
    ├─ Students Mark Attendance
    └─ Export & End Session
```

## 🔄 Data Lifecycle

### MongoDB (Temporary Storage)
```
Active Session:
┌─────────────────────────────────┐
│ MongoDB Database                │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Collection: courses         │ │
│ │ • sessionId                 │ │
│ │ • course info               │ │
│ │ • students array            │ │
│ │ • active: true              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Collection: attendance_rec  │ │
│ │ • sessionId                 │ │
│ │ • studentId                 │ │
│ │ • IP + User-Agent           │ │
│ │ • timestamp                 │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

After Export & End:
┌─────────────────────────────────┐
│ MongoDB Database                │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ EMPTY - All data deleted    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Exported Files (Permanent Storage)
```
public/exports/
├─ CS101_Fall2025_A.json (Historical - All Sessions)
│  [
│    { sessionDate: "2025-10-27", students: [...] },
│    { sessionDate: "2025-10-28", students: [...] },
│    { sessionDate: "2025-10-29", students: [...] }
│  ]
│
Downloads/ (User's Computer)
├─ attendance_CS101_Fall2025_A_2025-10-27.json
├─ attendance_CS101_Fall2025_A_2025-10-27.csv
├─ attendance_CS101_Fall2025_A_2025-10-28.json
├─ attendance_CS101_Fall2025_A_2025-10-28.csv
└─ ...
```

## 📊 Student Experience Flow

```
Student Workflow:
1. Professor displays QR code on screen
   ↓
2. Student scans with phone camera
   ↓
3. Opens: /attend?sessionId=abc123...
   ↓
4. Sees course information:
   - Course Name
   - Course ID
   - Semester
   - Section
   ↓
5. Enters Student ID (e.g., S001)
   ↓
6. Clicks "Mark Attendance"
   ↓
7. System validates:
   ├─ Session is active? ✓
   ├─ Student ID exists? ✓
   ├─ Already attended? ✗
   └─ Same IP/device used? ✗
   ↓
8. Success! Shows:
   "Attendance marked successfully!
    Welcome, Alice Johnson"
```

## 🔒 Security & Validation Flow

```
Attendance Request:
├─ 1. Receive: { sessionId, studentId }
├─ 2. Check: Session exists & active
├─ 3. Check: Student ID in roster
├─ 4. Check: Student not already attended
├─ 5. Check: IP + User-Agent combination
│     ├─ Same device different ID? → REJECT
│     └─ Different device same ID? → REJECT
├─ 6. Record in attendance_records
├─ 7. Update student in courses
└─ 8. Return success
```

## 📁 File Format Examples

### JSON Export Format
```json
{
  "courseName": "Introduction to Computer Science",
  "courseId": "CS101",
  "semester": "Fall 2025",
  "section": "A",
  "sessionDate": "2025-10-27T10:30:00.000Z",
  "students": [
    {
      "id": "S001",
      "name": "Alice Johnson",
      "attended": true,
      "attendedAt": "2025-10-27T10:35:22.000Z"
    },
    {
      "id": "S002",
      "name": "Bob Smith",
      "attended": false
    }
  ]
}
```

### CSV Export Format
```csv
Student ID,Student Name,Course Name,Course ID,Semester,Section,Attended,Attendance Time
S001,Alice Johnson,Introduction to Computer Science,CS101,Fall 2025,A,Yes,10/27/2025 10:35:22 AM
S002,Bob Smith,Introduction to Computer Science,CS101,Fall 2025,A,No,
S003,Charlie Brown,Introduction to Computer Science,CS101,Fall 2025,A,Yes,10/27/2025 10:36:15 AM
```

## 🎯 Best Practices

### For Instructors

1. **Start of Semester**
   - Create first session with complete student roster
   - Export at end of first class
   - Keep the JSON/CSV file safe

2. **Each Class Session**
   - Upload previous export to resume
   - New QR code generated automatically
   - Export at end of class

3. **File Organization**
   - Name files clearly with dates
   - Keep backups of all exports
   - Track attendance trends over time

4. **Troubleshooting**
   - If session lost, upload last export
   - Students can't attend twice in same session
   - MongoDB auto-clears on export

### For Students

1. **Scan QR code** displayed by instructor
2. **Enter exact Student ID** (case-sensitive)
3. **One device per student** (duplicate prevention active)
4. **Immediate confirmation** shown on screen

## 🚀 Quick Reference

| Action | Location | Result |
|--------|----------|--------|
| Create New | Dashboard → Create New Session | Fresh session, manual entry |
| Resume | Dashboard → Upload File | Restored roster, attendance reset |
| Attend | /attend?sessionId=XXX | Student marks present |
| Export | Dashboard → Export & End | JSON + CSV download, MongoDB cleared |
| View Live | Dashboard → Student List Table | Real-time updates every 5s |

## ⚡ Time Estimates

- Create new session: ~2 minutes
- Resume from file: ~30 seconds
- Student attendance: ~10 seconds per student
- Export & end: ~10 seconds
- Total per class: ~5-10 minutes overhead
