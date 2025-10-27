# Instructor Guide

## Overview

This guide will help you manage attendance sessions from creation to export. Follow these steps for smooth attendance tracking.

---

## 📋 Creating Your First Session

### Option 1: Create New Session (Recommended for First Class)

1. **Navigate to Dashboard**
   - Open `http://localhost:3000` (or your deployment URL)

2. **Scroll to "Create New Session"**

3. **Fill in Course Information:**
   ```
   Course Name: Introduction to Computer Science
   Course ID: CS101
   Semester: Fall 2025
   Section: A
   ```

4. **Paste Student List:**
   - Format: `StudentID,StudentName`
   - One student per line
   - Example:
     ```
     S001,Alice Johnson
     S002,Bob Smith
     S003,Charlie Brown
     ```
   - See [Sample Data](./11-SAMPLE-DATA.md) for test data

5. **Click "Start Attendance Session"**
   - QR code generates instantly
   - Session is now active

### Option 2: Resume from Previous Export

1. **Go to "Resume Previous Session"**

2. **Click "Choose File"**

3. **Select your previous CSV export**
   - Example: `attendance_CS101_Fall2025_A_2025-10-27.csv`

4. **Session Loads**
   - All students restored
   - New QR code generated
   - Attendance starts fresh for today

---

## 🔲 Displaying QR Code

### Best Practices:

1. **Project on Screen**
   - Large display for entire class to see
   - Keep visible throughout attendance period

2. **Share URL** (Alternative)
   - URL shown below QR code
   - Can be shared via chat/email
   - Format: `{SITE_URL}/attend?sessionId=XXX`

3. **Timing**
   - Display for 5-10 minutes
   - Enough time for all students

---

## 📊 Monitoring Attendance

### Real-time Dashboard

The dashboard updates every 5 seconds automatically.

**What You'll See:**

1. **Attendance Count**
   - Example: "15/30 students attended"
   - Updates live as students mark attendance

2. **Student List Table**
   - ✅ Green highlight = Present
   - White/Gray = Not yet attended
   - Shows timestamp for each attendance

3. **Student Information**
   - Student ID
   - Student Name
   - Attendance Status
   - Time Attended

### Manual Attendance Control

**When to Use:**
- Student's phone not working
- Technical issues
- Late arrivals after QR removed
- Corrections needed

**How to Use:**

1. **Search for Student**
   - Type name or ID in search box
   - List filters automatically

2. **Toggle Attendance**
   - Click "Mark Present" or "Mark Absent"
   - Changes apply immediately
   - Updates in real-time

---

## 📅 Date-Wise Tracking

### How It Works:

#### First Session (Day 1)
```
Create session → Students attend → Export
CSV has: 2025-10-27 column
```

#### Same Day Resume
```
Upload CSV → System sees today's date exists
Loads existing attendance → Can add more students
```

#### Different Day (Day 2)
```
Upload CSV → System sees new date
Creates fresh session → New column: 2025-10-28
Previous dates preserved
```

### Result:
One CSV file tracks entire semester with date-wise columns!

---

## 💾 Exporting Data

### When to Export:
- End of each class session
- When attendance complete
- Before closing browser

### How to Export:

1. **Click "Export & End Session"**
   
2. **CSV Downloads Automatically**
   - Filename: `attendance_{CourseID}_{Semester}_{Section}_{Date}.csv`
   - Example: `attendance_CS101_Fall2025_A_2025-10-27.csv`

3. **CSV Format:**
   ```csv
   Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27,2025-10-28,...
   S001,Alice,CS101,CS101,Fall 2025,A,Present,Absent,...
   ```

4. **MongoDB Cleared**
   - All session data removed
   - Database is clean
   - CSV is permanent record

### File Management:
- Save in organized folder
- Name clearly with dates
- Keep backups
- Use for next session

---

## 🎓 Semester End Review

### Finding Students with Excessive Absences

1. **Click "Semester End Review" Button**

2. **Modal Shows:**
   - Students with >6 absences
   - Complete attendance grid
   - Dates of absences

3. **Review Each Student**
   - See all dates present/absent
   - Red dot = Absent
   - Green dot = Present

### Leave Approval

**When students have medical/approved leaves:**

1. **Find Student in Review Modal**

2. **Click "Approve Leave (Convert 6 Absences)"**

3. **System Automatically:**
   - Finds 6 random absent days
   - Converts them to "Present"
   - Updates database
   - Shows which dates changed

4. **Effect:**
   - Reduces absence count
   - Fair distribution across semester
   - Maintains attendance percentage

---

## 📋 View All Attendance

### Comprehensive Attendance Grid

1. **Click "View All Attendance" Button**

2. **Modal Displays:**
   - All students (rows)
   - All dates (columns)
   - Complete attendance history

3. **Features:**
   - ✅ Checkmark = Present
   - ❌ X mark = Absent
   - Color-coded badges:
     - Green: Total Present
     - Red: >6 Absences
     - Yellow: ≤6 Absences

4. **Scrollable Grid:**
   - Sticky headers
   - Sticky first column (names)
   - Horizontal scroll for many dates
   - Vertical scroll for many students

---

## 🎨 Theme Toggle

### Light/Dark Mode

1. **Click Sun/Moon Icon** in navbar

2. **Theme Switches:**
   - Light Mode: White background
   - Dark Mode: Dark background

3. **Preference Saved:**
   - Remembers your choice
   - Applies on next visit

---

## 🔧 Common Tasks

### Adding New Students Mid-Semester

1. **Export current CSV**
2. **Open in Excel/Text Editor**
3. **Add new rows:**
   ```csv
   S021,New Student,CS101,CS101,Fall 2025,A,Absent,Absent,...
   ```
4. **Fill absent for past dates**
5. **Save and upload**

### Correcting Mistakes

1. **Use Manual Attendance Control**
2. **Search for student**
3. **Toggle attendance**
4. **Or edit CSV directly before export**

### Handling Technical Issues

1. **Student can't scan QR:**
   - Use manual attendance control
   - Or share URL directly

2. **Session lost:**
   - Upload last export
   - Resume from there

3. **Wrong attendance marked:**
   - Use manual toggle
   - Changes save immediately

---

## ✅ Best Practices

### Before Class:
- [ ] Have previous CSV ready (if resuming)
- [ ] Test QR code display
- [ ] Ensure internet connection

### During Class:
- [ ] Display QR for 5-10 minutes
- [ ] Monitor real-time count
- [ ] Handle technical issues promptly
- [ ] Use manual control as needed

### After Class:
- [ ] Verify attendance count
- [ ] Export and save CSV
- [ ] Keep organized records
- [ ] Note any issues for next time

---

## 🆘 Troubleshooting

### QR Not Scanning
- Increase brightness
- Make QR code larger
- Share URL as alternative

### Student Can't Mark Attendance
- Check student ID is correct
- Ensure session is active
- Use manual control if needed

### Dashboard Not Updating
- Refresh page
- Check internet connection
- Verify session is active

---

## 📚 Related Guides

- [CSV & Date Management](./07-CSV-DATE-MANAGEMENT.md) - Understanding date-wise tracking
- [View All Attendance Feature](./06-FEATURES.md#view-all-attendance) - Detailed grid view
- [Debug Guide](./08-DEBUG-GUIDE.md) - Solving CSV issues
- [Sample Data](./11-SAMPLE-DATA.md) - Test your system

---

**Need Help?** Check the [Debug Guide](./08-DEBUG-GUIDE.md) or [System Overview](./02-SYSTEM-OVERVIEW.md)
