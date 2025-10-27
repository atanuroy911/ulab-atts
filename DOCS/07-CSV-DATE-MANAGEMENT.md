# CSV & Date Management Guide

## 📅 Understanding Date-Wise Attendance Tracking

This system uses a unique approach: **one CSV file tracks attendance for an entire semester** with date-wise columns.

---

## 🔄 How Date-Based Tracking Works

### Traditional Approach (❌ Not Used)
```
Session 1 → attendance_oct27.csv
Session 2 → attendance_oct28.csv
Session 3 → attendance_oct29.csv
...
Problem: 30+ separate files per semester!
```

### Our Approach (✅ Used)
```
Session 1 → attendance.csv (has 2025-10-27 column)
Session 2 → Upload CSV → New column 2025-10-28 added
Session 3 → Upload CSV → New column 2025-10-29 added
...
Result: ONE file with all semester data!
```

---

## 📊 CSV Structure

### Initial Export (First Class)
```csv
Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27
S001,Alice Johnson,Intro CS,CS101,Fall 2025,A,Present
S002,Bob Smith,Intro CS,CS101,Fall 2025,A,Absent
S003,Charlie Brown,Intro CS,CS101,Fall 2025,A,Present
```

### After Second Class
```csv
Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27,2025-10-29
S001,Alice Johnson,Intro CS,CS101,Fall 2025,A,Present,Absent
S002,Bob Smith,Intro CS,CS101,Fall 2025,A,Absent,Present
S003,Charlie Brown,Intro CS,CS101,Fall 2025,A,Present,Present
```

### After Full Semester
```csv
Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27,2025-10-29,2025-10-30,...,2025-12-15
S001,Alice Johnson,Intro CS,CS101,Fall 2025,A,Present,Absent,Present,...,Present
S002,Bob Smith,Intro CS,CS101,Fall 2025,A,Absent,Present,Absent,...,Absent
S003,Charlie Brown,Intro CS,CS101,Fall 2025,A,Present,Present,Present,...,Present
```

**Result:** Complete semester attendance in ONE file with 30+ date columns!

---

## 🗓️ Date Detection Logic

### When You Upload a CSV:

The system checks if **today's date** exists in the CSV:

#### Scenario A: Same Day Resume
```
Today: 2025-10-27
CSV has column: 2025-10-27 ✓

Action: Resume session
Effect: Load existing attendance for today
Allows: Adding more students
```

#### Scenario B: Different Day
```
Today: 2025-10-28
CSV has columns: 2025-10-27 ✓ (but not 2025-10-28)

Action: Create fresh session
Effect: New column 2025-10-28 added
Preserves: All previous date columns
```

---

## 📝 Supported Date Formats

The system now accepts **ANY common date format** in CSV column headers!

### Fully Supported Formats:

| Format | Example | Description |
|--------|---------|-------------|
| **YYYY-MM-DD** | `2025-10-27` | ISO standard (recommended) |
| **M/D/YYYY** | `10/27/2025` | US format (Excel default) |
| **MM/DD/YYYY** | `10/09/2025` | US format with padding |
| **DD/MM/YYYY** | `27/10/2025` | European format |
| **DD-MM-YYYY** | `27-10-2025` | European format with dashes |
| **YYYY/MM/DD** | `2025/10/27` | ISO with slashes |
| **DD.MM.YYYY** | `27.10.2025` | European with dots |
| **YYYYMMDD** | `20251027` | Compact format |
| **Month DD, YYYY** | `October 27, 2025` | Full month name |
| **Mon DD, YYYY** | `Oct 27, 2025` | Abbreviated month |
| **DD Month YYYY** | `27 October 2025` | Day-first with month name |
| **DD Mon YYYY** | `27 Oct 2025` | Day-first with abbrev |

### Automatic Normalization

All formats are automatically converted to `YYYY-MM-DD` internally:

```
Input:     10/27/2025
Normalized: 2025-10-27

Input:     27.10.2025
Normalized: 2025-10-27

Input:     October 27, 2025
Normalized: 2025-10-27
```

---

## 🔧 Excel Compatibility

### The Excel Problem:

When you edit a CSV in Excel and save:

```
Before Excel:  2025-10-27, 2025-10-28, 2025-10-29
After Excel:   10/27/2025, 10/28/2025, 10/29/2025
```

Excel automatically reformats dates!

### Our Solution:

✅ **Automatic Detection & Conversion**

The system detects both formats and normalizes them:

```
📥 Upload: attendance_edited_in_excel.csv
🔍 Detect: 10/27/2025, 10/28/2025, ...
🔄 Convert: 2025-10-27, 2025-10-28, ...
✅ Load: All dates recognized!
```

### No Action Needed!

Just upload your Excel-edited CSV. The system handles it automatically.

---

## 📋 CSV Format Requirements

### Required Columns (Exact Names):

Must have these columns in your CSV:

1. **Student ID** - Student identifier
2. **Student Name** - Full name
3. **Course Name** - Course title
4. **Course ID** - Course code
5. **Semester** - Semester/term
6. **Section** - Section identifier

### Date Columns:

- **Format:** Any supported format (see above)
- **Location:** After the 6 required columns
- **Order:** Chronological recommended
- **Quantity:** Unlimited

### Attendance Values:

| Value | Interpreted As |
|-------|---------------|
| `Present` | Present ✅ |
| `Yes` | Present ✅ |
| `1` | Present ✅ |
| `true` | Present ✅ |
| `Absent` | Absent ❌ |
| `No` | Absent ❌ |
| `0` | Absent ❌ |
| `false` | Absent ❌ |
| (empty) | No data |

**Case insensitive:** `PRESENT`, `present`, `Present` all work.

---

## 🛠️ Editing CSVs Safely

### Option 1: Excel (Recommended for Most)

1. **Open CSV** in Microsoft Excel
2. **Edit as needed** (add students, fix names, etc.)
3. **Save** → Format: CSV (Comma delimited)
4. **Upload** → System auto-detects Excel date format

✅ **Pros:** Easy, familiar interface  
⚠️ **Note:** Dates will be reformatted (system handles it)

### Option 2: Google Sheets

1. **Upload CSV** to Google Sheets
2. **Edit** data
3. **Download** → CSV format
4. **Upload** to system

✅ **Pros:** Cloud-based, collaboration  
✅ **Bonus:** Better date format preservation

### Option 3: Text Editor (Advanced)

1. **Open CSV** in Notepad/VS Code/Sublime
2. **Edit carefully** (maintain structure)
3. **Save** with UTF-8 encoding
4. **Upload**

✅ **Pros:** Full control, no auto-formatting  
⚠️ **Cons:** Easy to break structure

---

## 🔍 Debugging CSV Issues

### Enable Debug Logs:

1. **Open browser console** (F12 → Console)
2. **Upload your CSV**
3. **Watch the logs**:

```
📁 [File Upload] File selected
📄 [File Upload] Content loaded: 5000 chars
🔍 [CSV Parser] Starting...
📊 [CSV Parser] Papa Parse: 20 rows, 0 errors
📋 [CSV Parser] Columns: Student ID, Student Name, ...
📅 [CSV Parser] Raw date columns: [10/27/2025, 10/28/2025, ...]
📅 [CSV Parser] Date mapping: {
  "10/27/2025": "2025-10-27",
  "10/28/2025": "2025-10-28"
}
📅 [CSV Parser] Normalized dates: [2025-10-27, 2025-10-28]
✅ [CSV Parser] Complete: 20 students, 2 dates
```

### Common Issues:

| Issue | Debug Log Shows | Solution |
|-------|----------------|----------|
| No dates found | `Date columns: []` | Check date format |
| Missing students | `dataRows: 0` | Check CSV not empty |
| Wrong course info | `Course info: {}` | Verify column names |
| Parse errors | `errors: [...}` | Check CSV structure |

See [Debug Guide](./08-DEBUG-GUIDE.md) for detailed troubleshooting.

---

## 📚 CSV Workflows

### Workflow 1: Standard Semester

```
Week 1 Monday:
  Create session → Students attend → Export
  File: attendance_CS101_Fall2025_A_2025-10-27.csv
  Columns: [Student ID, Name, ..., 2025-10-27]

Week 1 Wednesday:
  Upload Monday's CSV → Students attend → Export
  File: attendance_CS101_Fall2025_A_2025-10-29.csv
  Columns: [Student ID, Name, ..., 2025-10-27, 2025-10-29]

Week 2 Monday:
  Upload Week 1's CSV → Students attend → Export
  Columns: [..., 2025-10-27, 2025-10-29, 2025-11-03]

Continue each class...

End of Semester:
  One CSV with 30+ date columns
  Complete attendance history
  Ready for analysis!
```

### Workflow 2: Adding Students Mid-Semester

```
1. Export current CSV
2. Open in Excel
3. Add new row at bottom:
   S021,New Student,CS101,CS101,Fall 2025,A,Absent,Absent,Absent,...
4. Fill "Absent" for all past dates
5. Save and upload next class
6. New student can now attend
```

### Workflow 3: Correcting Errors

```
Option A: Use Manual Control (Recommended)
  - Use instructor dashboard
  - Search student
  - Toggle attendance
  - No CSV editing needed

Option B: Edit CSV
  - Open last export
  - Find student row
  - Change "Absent" → "Present" (or vice versa)
  - Save
  - Upload next class
  - Correction applied
```

---

## 💡 Best Practices

### File Naming:

```
Good:
  attendance_CS101_Fall2025_A_2025-10-27.csv
  CS101_Section_A_Fall2025_Latest.csv
  
Avoid:
  attendance.csv (too generic)
  final.csv (not descriptive)
  untitled.csv (no information)
```

### Organization:

```
Course Folder/
├── CS101_Fall2025_SectionA/
│   ├── attendance_2025-10-27.csv
│   ├── attendance_2025-10-29.csv
│   ├── attendance_2025-11-03.csv
│   └── attendance_LATEST.csv (always most recent)
```

### Backup Strategy:

1. **Keep all exports** - Disk space is cheap
2. **Cloud backup** - Google Drive, OneDrive, Dropbox
3. **Version control** - Keep dated versions
4. **Final archive** - End of semester, archive all

---

## 🔢 Data Analysis Tips

### Excel Formulas:

**Count Present Days:**
```excel
=COUNTIF(G2:Z2,"Present")
```

**Calculate Attendance %:**
```excel
=COUNTIF(G2:Z2,"Present")/COUNTA(G2:Z2)*100
```

**Find Students with >6 Absences:**
```excel
=IF(COUNTIF(G2:Z2,"Absent")>6,"AT RISK","OK")
```

### Conditional Formatting:

- **Green:** Present
- **Red:** Absent
- **Yellow:** >6 absences

### Pivot Tables:

- Analyze attendance by date
- Find patterns (Mondays vs Fridays)
- Track improvement over time

---

## 📖 Related Documentation

- [Excel Fix Details](./09-EXCEL-FIX.md) - Deep dive into Excel compatibility
- [Debug Guide](./08-DEBUG-GUIDE.md) - Troubleshooting CSV issues
- [Instructor Guide](./03-INSTRUCTOR-GUIDE.md) - Using the system
- [Sample Data](./11-SAMPLE-DATA.md) - Example CSVs

---

**Key Takeaway:** Upload your CSV (any date format), system handles the rest! One file tracks your entire semester. 🎉
