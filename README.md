# ULab Attendance Tracking System# ULab Attendance Tracking System# Attendance Management System



> A comprehensive Next.js application for managing student attendance with QR codes, date-wise CSV tracking, and MongoDB storage.



![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)A comprehensive Next.js application for managing student attendance with QR code generation, **date-wise CSV tracking**, and MongoDB temporary storage.A comprehensive web-based attendance management system built with Next.js, MongoDB, and QR code technology.

![Version](https://img.shields.io/badge/version-2.0.0-blue)

![License](https://img.shields.io/badge/license-MIT-green)



---## Features## Features



## 🚀 Quick Links



- **📚 [Complete Documentation](./DOCS/README.md)** - Full documentation index1. **CSV Import**: Paste CSV data with student information to create a new session- **CSV Student Import**: Paste student data (ID, Name) to quickly create course rosters

- **⚡ [Quick Start Guide](./DOCS/01-QUICK-START.md)** - Get running in 5 minutes

- **👨‍🏫 [Instructor Guide](./DOCS/03-INSTRUCTOR-GUIDE.md)** - For teachers2. **QR Code Generation**: Automatically generates a QR code for students to scan and mark attendance- **QR Code Generation**: Automatically generate QR codes for easy attendance marking

- **👨‍🎓 [Student Guide](./DOCS/04-STUDENT-GUIDE.md)** - For students

3. **MongoDB Storage**: Temporarily stores session data in MongoDB (cleared on export)- **Real-time Updates**: Dashboard updates every 5 seconds to show current attendance

---

4. **Student Attendance**: Students can mark attendance by entering their ID on a dedicated page- **Duplicate Prevention**: Prevents multiple attendance attempts using IP and User-Agent tracking

## ✨ Key Features

5. **Duplicate Prevention**: Prevents multiple attendance entries using IP address and User-Agent tracking **per date**- **Session Management**: Create temporary sessions stored in MongoDB

| Feature | Description |

|---------|-------------|6. **Date-Wise CSV Export**: Export attendance data with columns for each date, accumulating across multiple sessions- **Export Functionality**: Export attendance data to JSON with historical tracking

| 📊 **CSV Import/Export** | Paste student lists, export with date-wise columns |

| 🔲 **QR Code Generation** | Automatic QR codes for contactless attendance |- **Responsive Design**: Works on desktop and mobile devices

| 🗄️ **MongoDB Storage** | Temporary session storage with auto-cleanup |

| 🛡️ **Duplicate Prevention** | IP/User-Agent tracking prevents proxy attendance |## Key Innovation: Date-Based Attendance Tracking

| 📅 **Date-Based Tracking** | One CSV file tracks entire semester |

| 🌓 **Light/Dark Theme** | Toggle themes with persistent storage |## Prerequisites

| 📝 **Manual Control** | Teachers can manually adjust attendance |

| 🎓 **Semester Review** | Identify students with excessive absences |This system uses a **semester-long CSV file** that accumulates attendance across multiple class sessions:

| 📋 **View All Attendance** | Comprehensive grid for all dates |

| 🔧 **Universal Date Support** | Accepts all common date formats (Excel compatible!) |- Node.js 18+ installed



---- **First Export**: CSV has columns for student info + today's date (e.g., `2025-10-27`)- MongoDB instance (local or cloud, e.g., MongoDB Atlas)



## 🎯 What's Special?- **Next Session (Same Day)**: Upload CSV → system restores today's attendance



### Date-Wise Semester Tracking- **Next Session (Different Day)**: Upload CSV → system creates NEW column for new date, preserves old dates## Setup Instructions



Unlike traditional systems with separate files for each day, this system uses **one CSV file for the entire semester**:- **Result**: One CSV file tracks attendance for entire semester with date-wise columns



```csv### 1. Install Dependencies

Student ID,Name,...,2025-10-27,2025-10-29,2025-10-30,...,2025-12-15

S001,Alice,...,Present,Absent,Present,...,Present## Tech Stack

S002,Bob,...,Absent,Present,Absent,...,Present

``````bash



**Benefits:**- **Framework**: Next.js 16.0.0 (App Router)npm install

- ✅ One file per course per semester

- ✅ Easy to analyze attendance patterns- **Language**: TypeScript 5```

- ✅ No file management headaches

- ✅ Excel/Google Sheets compatible- **Database**: MongoDB (with official driver)



### Excel-Friendly- **Styling**: Tailwind CSS 4### 2. Configure Environment Variables



Edit CSVs in Excel without worries! The system automatically handles:- **Libraries**:

- ✅ `2025-10-27` (YYYY-MM-DD)

- ✅ `10/27/2025` (M/D/YYYY - Excel format)  - `qrcode`: QR code generationEdit the `.env.local` file in the project root:

- ✅ `27/10/2025` (DD/MM/YYYY - European)

- ✅ `October 27, 2025` (Full month name)  - `papaparse`: CSV parsing and generation

- ✅ And 10+ other date formats!

```env

---

## Getting StartedMONGODB_URI=mongodb://localhost:27017

## 🏃 Quick Start

NEXT_PUBLIC_SITE_URL=http://localhost:3000

### Prerequisites

- Node.js 18+### Prerequisites```

- MongoDB (local or Atlas)



### Installation

- Node.js 18+ installed**MongoDB Options:**

```bash

# 1. Clone the repository- MongoDB instance (local or cloud)- **Local MongoDB**: `mongodb://localhost:27017`

git clone https://github.com/atanuroy911/ulab-atts.git

cd ulab-atts- **MongoDB Atlas**: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`



# 2. Install dependencies### Installation

npm install

### 3. Start MongoDB (if running locally)

# 3. Set up environment variables

# Edit .env.local with your MongoDB URI1. Clone the repository



# 4. Start MongoDB (if local)2. Install dependencies:Make sure MongoDB is running on your system:

net start MongoDB  # Windows

# or   ```bash

mongod  # macOS/Linux

   npm install```bash

# 5. Run development server

npm run dev   ```# Windows (if installed as service)



# 6. Open browsernet start MongoDB

# Visit http://localhost:3000

```3. Create a `.env.local` file in the root directory:



**Detailed Instructions:** [Quick Start Guide](./DOCS/01-QUICK-START.md)   ```env# Or start mongod manually



---   MONGODB_URI=your_mongodb_connection_stringmongod --dbpath /path/to/data



## 📖 Documentation   NEXT_PUBLIC_SITE_URL=http://localhost:3000```



### Getting Started   ```

1. [Quick Start Guide](./DOCS/01-QUICK-START.md) - Installation and first run

2. [System Overview](./DOCS/02-SYSTEM-OVERVIEW.md) - What is this system?### 4. Run the Development Server



### User Guides4. Run the development server:

3. [Instructor Guide](./DOCS/03-INSTRUCTOR-GUIDE.md) - For teachers

4. [Student Guide](./DOCS/04-STUDENT-GUIDE.md) - For students   ```bash```bash



### Technical Documentation   npm run devnpm run dev

5. [System Architecture](./DOCS/05-ARCHITECTURE.md) - Complete diagrams

6. [Features Reference](./DOCS/06-FEATURES.md) - All features explained   ``````

7. [CSV & Date Management](./DOCS/07-CSV-DATE-MANAGEMENT.md) - Date-wise tracking



### Troubleshooting

8. [Debug Guide](./DOCS/08-DEBUG-GUIDE.md) - Solve CSV issues5. Open [http://localhost:3000](http://localhost:3000) in your browserOpen [http://localhost:3000](http://localhost:3000) in your browser.

9. [Excel CSV Fix](./DOCS/09-EXCEL-FIX.md) - Excel compatibility



### Deployment

10. [Deployment Guide](./DOCS/10-DEPLOYMENT.md) - Production setup## Usage## Usage Guide



### Testing

11. [Sample Data](./DOCS/11-SAMPLE-DATA.md) - Test data and scenarios

### Creating a New Session (First Day of Semester)### For Instructors (Dashboard)

**📚 [Full Documentation Index](./DOCS/README.md)**



---

1. Navigate to the "Create New Session" section1. **Create a New Session**

## 🛠️ Technology Stack

2. Fill in course information (Course Name, ID, Semester, Section)   - Fill in course details (Name, ID, Semester, Section)

- **Frontend:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4

- **Backend:** Next.js API Routes, Node.js 18+3. Paste CSV data in the format: `StudentID,StudentName`   - Paste student data in CSV format:

- **Database:** MongoDB

- **Libraries:** qrcode, papaparse4. Click "Start Attendance Session"     ```

- **Deployment:** Vercel-ready

5. QR code will be generated - share it with students     S001,John Doe

---

6. Export when done - CSV will have one date column     S002,Jane Smith

## 🔒 Security Features

     S003,Bob Johnson

- ✅ Duplicate prevention (IP + User-Agent tracking)

- ✅ Session validation### Resuming Session (Same Day)     ```

- ✅ Student ID verification

- ✅ Input sanitization   - Click "Start Attendance Session"

- ✅ TypeScript type safety

1. Navigate to the "Resume Previous Session" section

---

2. Upload the previously exported CSV file2. **Share QR Code**

## 📊 Typical Usage

3. **System detects today's date exists in CSV**   - Display the generated QR code to students

```

1. Instructor creates session (or uploads previous CSV)4. Restores attendance from earlier today   - Students can scan it with their phones

2. System generates QR code

3. Students scan and enter ID5. Students who already attended show as "Present"

4. Real-time dashboard shows attendance

5. Export CSV at end of class6. Export again - same date column gets updated3. **Monitor Attendance**

6. MongoDB automatically cleared

7. Next class: Upload CSV to continue   - Watch real-time updates as students mark attendance

```

### Resuming Session (Different Day)   - See who attended and when

**Time Investment:** ~5-10 minutes overhead per class

   - View attendance count (e.g., 15/30)

---

1. Upload the previously exported CSV file

## 🌟 Recent Updates

2. **System detects today's date is NOT in CSV**4. **Export Data**

### Version 2.0.0 (Latest)

- ✅ Universal date format support (all common formats)3. Creates fresh session with empty attendance for today   - Click "Export & End Session" when done

- ✅ Enhanced CSV debugging with detailed logs

- ✅ Excel compatibility improvements4. Previous dates' attendance preserved   - Download JSON file with attendance records

- ✅ View all attendance feature with comprehensive grid

- ✅ Light/dark theme with persistent toggle5. Students mark attendance for new day   - Data is automatically saved in `public/exports/` for future reference

- ✅ Manual attendance control with search

- ✅ Semester end review modal6. Export - CSV now has MULTIPLE date columns

- ✅ Leave approval system (convert absences to present)

- ✅ Improved UI/UX throughout### For Students (Attendance Page)



---### Student Attendance



## 🤝 Contributing1. **Scan QR Code**



Contributions are welcome! Please feel free to submit issues and enhancement requests.1. Students scan the QR code or visit the attendance URL   - Use your phone camera or QR scanner app



---2. Enter their Student ID   - Opens the attendance page automatically



## 📄 License3. Click "Mark Attendance"



MIT License - See LICENSE file for details4. System validates ID and prevents duplicate entries (per date)2. **Enter Student ID**



---   - Type your student ID exactly as registered



## 🆘 Support### Exporting Data   - Click "Mark Attendance"



- **Documentation:** [DOCS folder](./DOCS/README.md)

- **Debug Issues:** [Debug Guide](./DOCS/08-DEBUG-GUIDE.md)

- **Contact:** Check repository issues1. Click "Export & End Session" on the dashboard3. **Confirmation**



---2. CSV file downloads with date-wise columns   - See success message with your name



## 🙏 Acknowledgments3. MongoDB is completely cleared   - You cannot mark attendance twice



Built with Next.js, MongoDB, and modern web technologies for educational institutions worldwide.4. Use exported CSV to resume sessions on different days



---## System Architecture



## 📝 Quick Reference## Project Structure



| Task | Link |### Data Flow

|------|------|

| Install | [Quick Start](./DOCS/01-QUICK-START.md) |```

| Teacher Guide | [Instructor Guide](./DOCS/03-INSTRUCTOR-GUIDE.md) |

| Student Help | [Student Guide](./DOCS/04-STUDENT-GUIDE.md) |ulab-atts/1. **Session Creation**: Instructor creates session → Data stored in MongoDB

| CSV Issues | [Debug Guide](./DOCS/08-DEBUG-GUIDE.md) |

| Excel Problems | [Excel Fix](./DOCS/09-EXCEL-FIX.md) |├── app/2. **QR Code**: Generated with URL: `{SITE_URL}/attend?sessionId={sessionId}`

| Deploy | [Deployment](./DOCS/10-DEPLOYMENT.md) |

| All Docs | [Documentation Index](./DOCS/README.md) |│   ├── api/3. **Student Attendance**: Student scans → Enters ID → Validated against course roster



---│   │   ├── attend/route.ts       # Student attendance endpoint (date-aware)4. **Duplicate Check**: System checks IP/User-Agent to prevent proxy attendance



**Status:** ✅ Production Ready | **Version:** 2.0.0 | **Last Updated:** October 27, 2025│   │   ├── course/route.ts       # Create new course session5. **Real-time Updates**: Dashboard polls every 5 seconds for updates



**Start Here:** [Quick Start Guide](./DOCS/01-QUICK-START.md) 🚀│   │   ├── export/route.ts       # Export and clear database6. **Export**: Attendance saved to JSON → MongoDB session cleared


│   │   ├── load/route.ts         # Load from CSV (date detection)

│   │   └── status/route.ts       # Real-time attendance status### Database Collections

│   ├── attend/

│   │   └── page.tsx              # Student attendance page- **courses**: Active course sessions with student rosters

│   ├── globals.css- **attendance_records**: Individual attendance records with IP/User-Agent

│   ├── layout.tsx

│   └── page.tsx                  # Main instructor dashboard### File Structure

├── lib/

│   ├── csv-utils.ts              # CSV parsing with date column support```

│   ├── mongodb.ts                # MongoDB connectionapp/

│   └── types.ts                  # TypeScript interfaces├── api/

├── public/                       # Static assets│   ├── attend/route.ts      # Student attendance endpoint

├── .env.local                    # Environment variables (not committed)│   ├── course/route.ts      # Course management

├── next.config.ts│   └── export/route.ts      # Export attendance data

├── package.json├── attend/page.tsx          # Student attendance page

├── README.md└── page.tsx                 # Instructor dashboard

├── SAMPLE_DATA.md               # Sample CSV data for testinglib/

└── tsconfig.json├── mongodb.ts               # MongoDB connection

```└── types.ts                 # TypeScript interfaces

public/

## API Routes└── exports/                 # Exported attendance JSON files

```

- `POST /api/course` - Create a new attendance session

- `POST /api/load` - Load session from CSV file (with date detection)## API Endpoints

- `POST /api/attend` - Mark student attendance for current date

- `GET /api/status?sessionId=xxx` - Get real-time attendance status### POST /api/course

- `GET /api/export?sessionId=xxx` - Export data and clear databaseCreate a new course session

```json

## Database Schema{

  "csvData": "S001,John Doe\nS002,Jane Smith",

### Course Document  "courseName": "CS 101",

```typescript  "courseId": "CS101",

{  "semester": "Fall 2025",

  sessionId: string;        // Unique session identifier  "section": "A"

  courseName: string;       // Course name}

  courseId: string;         // Course ID```

  semester: string;         // Semester

  section: string;          // Section### GET /api/course?sessionId={id}

  currentDate: string;      // Today's date (YYYY-MM-DD)Retrieve course data

  createdAt: Date;          // Session creation time

  students: Student[];      // Array of students### POST /api/attend

}Mark student attendance

``````json

{

### Student Object (Date-Based Attendance)  "sessionId": "abc123...",

```typescript  "studentId": "S001"

{}

  studentId: string;        // Student ID```

  studentName: string;      // Student name

  attendance: {             // Date-based attendance record### GET /api/attend?sessionId={id}

    [date: string]: {       // Date key (YYYY-MM-DD)Get course info for students

      attended: boolean;

      attendedAt?: Date;### POST /api/export

      ipAddress?: string;Export and end session

      userAgent?: string;```json

    }{

  }  "sessionId": "abc123..."

}}

``````



## Environment Variables## Security Features



- `MONGODB_URI`: MongoDB connection string- **Duplicate Prevention**: Tracks IP address and User-Agent

- `NEXT_PUBLIC_SITE_URL`: Base URL of the application (for QR code generation)- **Session Validation**: Verifies student ID exists in course roster

- **One-time Attendance**: Students cannot mark attendance twice

## Features in Detail- **Active Session Check**: Only active sessions accept attendance



### Date-Based Duplicate Prevention## Data Persistence

- Uses combination of IP address and User-Agent **per date**

- Prevents students from marking attendance multiple times **on the same day**- **Temporary Storage**: MongoDB stores active session data

- Students can attend on different days without issues- **Permanent Storage**: Exported JSON files in `public/exports/`

- **Historical Data**: Each export appends to existing course file

### Real-time Updates- **Filename Format**: `{courseId}_{semester}_{section}.json`

- Dashboard auto-refreshes every 5 seconds

- Shows live attendance count **for current date**## Troubleshooting

- Updates student list in real-time

### MongoDB Connection Issues

### Smart CSV Handling- Verify MongoDB is running

- **Exported CSV Format**:- Check `MONGODB_URI` in `.env.local`

  ```csv- Ensure firewall allows connections

  Student ID,Student Name,Course Name,Course ID,Semester,Section,2025-10-27,2025-10-28,2025-10-29

  S001,Alice,Intro CS,CS101,Fall 2025,A,Present,Absent,Present### QR Code Not Working

  ```- Verify `NEXT_PUBLIC_SITE_URL` is correct

- **Date Column Detection**: System scans for YYYY-MM-DD format columns- Use HTTPS in production

- **Conditional Resume**:- Check network accessibility

  - If today exists → restore attendance

  - If today doesn't exist → create new empty session### Students Can't Mark Attendance

- **Cumulative Tracking**: Each export builds on previous dates- Verify session is active

- Check student ID matches exactly

### Data Persistence- Ensure not behind VPN/proxy (may trigger duplicate detection)

- MongoDB stores data temporarily during a session

- Export creates CSV with all dates## Production Deployment

- Database is completely cleared after export

- Exported CSV accumulates attendance across semester1. **Environment Variables**

   - Set production MongoDB URI

## Example Workflow   - Set production site URL (HTTPS)



**Week 1 - Monday (2025-10-27)**:2. **Build Application**

- Create new session with 20 students   ```bash

- 15 students attend   npm run build

- Export → CSV has column "2025-10-27"   npm start

  ```csv   ```

  Student ID,Student Name,...,2025-10-27

  S001,Alice,...,Present3. **Considerations**

  S002,Bob,...,Absent   - Use MongoDB Atlas or managed database

  ```   - Enable HTTPS

   - Configure proper CORS if needed

**Week 1 - Wednesday (2025-10-29)**:   - Set up backup for exports directory

- Upload Monday's CSV

- System sees new date (10-29), creates fresh session## License

- 18 students attend

- Export → CSV has TWO date columnsMIT

  ```csv
  Student ID,Student Name,...,2025-10-27,2025-10-29
  S001,Alice,...,Present,Present
  S002,Bob,...,Absent,Present
  ```

**Week 2 - Monday (2025-11-03)**:
- Upload previous CSV
- System sees new date (11-03), creates fresh session
- 20 students attend
- Export → CSV has THREE date columns
  ```csv
  Student ID,Student Name,...,2025-10-27,2025-10-29,2025-11-03
  S001,Alice,...,Present,Present,Absent
  S002,Bob,...,Absent,Present,Present
  ```

**End Result**: One CSV file with complete semester attendance history!

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Ensure firewall allows connections

### QR Code Not Working
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check network accessibility for students

### CSV Upload Issues
- Ensure CSV has proper headers (Student ID, Student Name, etc.)
- Date columns must be in YYYY-MM-DD format
- Check for special characters in student names

### Attendance Not Persisting
- Make sure you exported after the previous session
- Verify uploaded CSV has the previous date columns
- Check that file upload completed successfully

## Production Deployment

1. **Environment Variables**
   - Set production MongoDB URI (use MongoDB Atlas)
   - Set production site URL with HTTPS

2. **Build Application**
   ```bash
   npm run build
   npm start
   ```

3. **Considerations**
   - Use MongoDB Atlas or managed database
   - Enable HTTPS for QR codes to work on mobile
   - Set up regular backups of exported CSV files
   - Configure proper CORS if API accessed from different domain

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
#   u l a b - a t t s 
 
 