# Sample CSV Data for Testing

You can copy and paste the following data into the Student List textarea on the dashboard:

```csv
S001,Alice Johnson
S002,Bob Smith
S003,Charlie Brown
S004,Diana Prince
S005,Edward Norton
S006,Fiona Apple
S007,George Martin
S008,Hannah Montana
S009,Isaac Newton
S010,Julia Roberts
S011,Kevin Hart
S012,Laura Palmer
S013,Michael Jordan
S014,Nancy Drew
S015,Oliver Twist
S016,Patricia Lee
S017,Quincy Jones
S018,Rachel Green
S019,Steve Rogers
S020,Tina Turner
```

## Sample Course Information

- **Course Name**: Introduction to Computer Science
- **Course ID**: CS101
- **Semester**: Fall 2025
- **Section**: A

## Testing Workflow

### Option 1: Create New Session (First Day)

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Scroll to "Create New Session" section
4. Fill in the course information
5. Paste the sample CSV data above
6. Click "Start Attendance Session"
7. Note the sessionId from the QR code URL
8. Open http://localhost:3000/attend?sessionId=YOUR_SESSION_ID in another browser/incognito window
9. Enter a student ID (e.g., S001)
10. Mark attendance
11. Return to dashboard to see real-time update
12. Test duplicate prevention by trying to attend again
13. Click "Export & End Session" - downloads CSV file with date column (e.g., 2025-10-27)

### Option 2: Resume Session (Next Day - Same Date)

1. Open http://localhost:3000
2. In "Resume Previous Session" section, click "Choose File"
3. Upload the previously exported CSV file
4. **If today's date matches a date in the CSV:**
   - Session loads with existing attendance for today
   - Students who already attended show as "Present"
   - Other students can still mark attendance
5. Export again when done - CSV will have the same date column updated

### Option 3: Resume Session (Different Date)

1. Open http://localhost:3000
2. Upload the previously exported CSV file
3. **If today's date is NOT in the CSV:**
   - Session loads with all students
   - A NEW date column will be created for today
   - All attendance for today starts empty
   - Previous dates' attendance is preserved in the CSV
4. Students mark attendance for the new day
5. Export - CSV now has MULTIPLE date columns (one per day)

## How It Works - Date-Based Attendance

### CSV Structure

The exported CSV has date columns for each session:

```csv
Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27,2025-10-28,2025-10-29
S001,Alice Johnson,Intro to CS,CS101,Fall 2025,A,Present,Absent,Present
S002,Bob Smith,Intro to CS,CS101,Fall 2025,A,Present,Present,Absent
...
```

### Smart Date Detection

- **Same Date**: If you upload a CSV and today's date exists as a column, the system restores that day's attendance
- **New Date**: If today's date doesn't exist, a fresh session starts for the new date
- **MongoDB Cleanup**: MongoDB is completely cleared on export - only the CSV persists
- **Cumulative Tracking**: Each export adds to the CSV, building a complete attendance history

### Example Scenario

**Monday (2025-10-27)**:
1. Create session, students attend
2. Export → CSV has column "2025-10-27"

**Monday Later (same day)**:
1. Upload CSV
2. System sees "2025-10-27" exists
3. Shows existing attendance from earlier session
4. Can add more students if needed

**Tuesday (2025-10-28)**:
1. Upload Monday's CSV
2. System sees "2025-10-28" doesn't exist
3. Creates NEW column for today
4. All students start with empty attendance for today
5. Export → CSV now has "2025-10-27" AND "2025-10-28" columns

**Result**: One CSV file tracks attendance across multiple days!
