

# ULab Attendance Tracking System

> A comprehensive Next.js application for managing student attendance with QR codes, date-wise CSV tracking, and MongoDB storage.

-----

## 🚀 Quick Links

  - **📚 [Complete Documentation](./DOCS/README.md)** - Full documentation index
  - **⚡ [Quick Start Guide](./DOCS/01-QUICK-START.md)** - Get running in 5 minutes
  - **👨‍🏫 [Instructor Guide](./DOCS/03-INSTRUCTOR-GUIDE.md)** - For teachers
  - **👨‍🎓 [Student Guide](./DOCS/04-STUDENT-GUIDE.md)** - For students

-----

## ✨ Key Features

| Feature | Description |
|---|---|
| 📊 **CSV Import/Export** | Paste student lists, export with date-wise columns |
| 🔲 **QR Code Generation** | Automatic QR codes for contactless attendance |
| 🗄️ **MongoDB Storage** | Temporary session storage with auto-cleanup |
| 🛡️ **Duplicate Prevention** | IP/User-Agent tracking prevents proxy attendance |
| 📅 **Date-Based Tracking** | One CSV file tracks entire semester |
| 🌓 **Light/Dark Theme** | Toggle themes with persistent storage |
| 📝 **Manual Control** | Teachers can manually adjust attendance |
| 🎓 **Semester Review** | Identify students with excessive absences |
| 📋 **View All Attendance** | Comprehensive grid for all dates |
| 🔧 **Universal Date Support** | Accepts all common date formats (Excel compatible\!) |

-----

## 🎯 What's Special?

### Date-Wise Semester Tracking

Unlike traditional systems with separate files for each day, this system uses **one CSV file for the entire semester**:

```csv
Student ID,Name,...,2025-10-27,2025-10-29,2025-10-30,...,2025-12-15
S001,Alice,...,Present,Absent,Present,...,Present
S002,Bob,...,Absent,Present,Absent,...,Present
```

**Benefits:**

  - ✅ One file per course per semester
  - ✅ Easy to analyze attendance patterns
  - ✅ No file management headaches
  - ✅ Excel/Google Sheets compatible

### Excel-Friendly

Edit CSVs in Excel without worries\! The system automatically handles:

  - ✅ `2025-10-27` (YYYY-MM-DD)
  - ✅ `10/27/2025` (M/D/YYYY - Excel format)
  - ✅ `27/10/2025` (DD/MM/YYYY - European)
  - ✅ `October 27, 2025` (Full month name)
  - ✅ And 10+ other date formats\!

-----

## 🛠️ Technology Stack

  - **Frontend:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
  - **Backend:** Next.js API Routes, Node.js 18+
  - **Database:** MongoDB
  - **Libraries:** qrcode, papaparse
  - **Deployment:** Vercel-ready

-----

## 🚀 Getting Started

### Prerequisites

  - Node.js 18+ installed
  - MongoDB instance (local or cloud, e.g., MongoDB Atlas)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/atanuroy911/ulab-atts.git
cd ulab-atts

# 2. Install dependencies
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root and add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Example MongoDB URI:
# Local: mongodb://localhost:27017
# Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/
```

**4. Start MongoDB (if running locally)**

Make sure your local MongoDB service is running.

```bash
# Windows (if installed as service)
net start MongoDB

# Or start mongod manually on macOS/Linux/Windows
mongod --dbpath /path/to/data
```

**5. Run the development server**

```bash
npm run dev
```

**6. Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

-----

## 📊 Typical Usage

```
1. Instructor creates session (or uploads previous CSV)
2. System generates QR code
3. Students scan and enter ID
4. Real-time dashboard shows attendance
5. Export CSV at end of class
6. MongoDB automatically cleared
7. Next class: Upload CSV to continue
```

**Time Investment:** \~5-10 minutes overhead per class

-----

## Example Workflow

**Week 1 - Monday (2025-10-27):**

  - Create new session with 20 students
  - 15 students attend
  - Export → CSV has column "2025-10-27"
    ```csv
    Student ID,Student Name,...,2025-10-27
    S001,Alice,...,Present
    S002,Bob,...,Absent
    ```

**Week 1 - Wednesday (2025-10-29):**

  - Upload Monday's CSV
  - System sees new date (10-29), creates fresh session
  - 18 students attend
  - Export → CSV has TWO date columns
    ```csv
    Student ID,Student Name,...,2025-10-27,2025-10-29
    S001,Alice,...,Present,Present
    S002,Bob,...,Absent,Present
    ```

**Week 2 - Monday (2025-11-03):**

  - Upload previous CSV
  - System sees new date (11-03), creates fresh session
  - 20 students attend
  - Export → CSV has THREE date columns
    ```csv
    Student ID,Student Name,...,2025-10-27,2025-10-29,2025-11-03
    S001,Alice,...,Present,Present,Absent
    S002,Bob,...,Absent,Present,Present
    ```

**End Result**: One CSV file with complete semester attendance history\!

-----

## Data Persistence

  - **Temporary Storage**: MongoDB stores active session data.
  - **Permanent Storage**: The exported CSV file serves as the permanent, cumulative record.
  - **Auto-Cleanup**: The MongoDB database is completely cleared after you export, ensuring no stale data remains.

## 🔒 Security Features

  - ✅ **Duplicate Prevention**: Tracks a combination of IP address and User-Agent **per date** to prevent proxy attendance and multiple entries on the same day.
  - ✅ **Session Validation**: Verifies student ID exists in the course roster for the active session.
  - ✅ **One-time Attendance**: Students cannot mark attendance twice on the same day.
  - ✅ **Active Session Check**: Only active, valid sessions can accept attendance.
  - ✅ **Input Sanitization**: Cleans inputs to prevent issues.
  - ✅ **TypeScript Type Safety**: Reduces runtime errors.

-----

## 📖 Documentation

### Getting Started

1.  [Quick Start Guide](./DOCS/01-QUICK-START.md) - Installation and first run
2.  [System Overview](./DOCS/02-SYSTEM-OVERVIEW.md) - What is this system?

### User Guides

3.  [Instructor Guide](./DOCS/03-INSTRUCTOR-GUIDE.md) - For teachers
4.  [Student Guide](./DOCS/04-STUDENT-GUIDE.md) - For students

### Technical Documentation

5.  [System Architecture](./DOCS/05-ARCHITECTURE.md) - Complete diagrams
6.  [Features Reference](./DOCS/06-FEATURES.md) - All features explained
7.  [CSV & Date Management](./DOCS/07-CSV-DATE-MANAGEMENT.md) - Date-wise tracking

### Troubleshooting

8.  [Debug Guide](./DOCS/08-DEBUG-GUIDE.md) - Solve CSV issues
9.  [Excel CSV Fix](./DOCS/09-EXCEL-FIX.md) - Excel compatibility

### Deployment

10. [Deployment Guide](./DOCS/10-DEPLOYMENT.md) - Production setup

### Testing

11. [Sample Data](./DOCS/11-SAMPLE-DATA.md) - Test data and scenarios

**📚 [Full Documentation Index](./DOCS/README.md)**

-----

## Troubleshooting

### MongoDB Connection Issues

  - Verify MongoDB is running.
  - Check `MONGODB_URI` in `.env.local` is correct.
  - Ensure your firewall allows connections to the MongoDB port (default 27017).

### QR Code Not Working

  - Verify `NEXT_PUBLIC_SITE_URL` in `.env.local` is correct and accessible from a student's device.
  - Use HTTPS in production, as some mobile browsers require it for camera/location features.

### CSV Upload Issues

  - Ensure CSV has the minimum required headers (e.g., `Student ID`, `Student Name`).
  - Check for special characters or formatting issues.
  - Use the [Debug Guide](./DOCS/08-DEBUG-GUIDE.md) for detailed logs.

### Attendance Not Persisting

  - Make sure you **exported** after the previous session. The exported CSV is the *only* long-term storage.
  - Verify the CSV you are uploading contains the previous dates' attendance columns.

## Production Deployment

1.  **Environment Variables**

      - Set a production `MONGODB_URI` (e.g., from MongoDB Atlas).
      - Set the production `NEXT_PUBLIC_SITE_URL` (must be HTTPS for mobile QR scanning to work reliably).

2.  **Build Application**

    ```bash
    npm run build
    npm start
    ```

3.  **Considerations**

      - Use a managed database like MongoDB Atlas for reliability.
      - Enable HTTPS on your deployment.
      - Set up regular backups of your exported CSV files.
      - Configure proper CORS if your API is accessed from a different domain.

-----

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit issues and enhancement requests.

## 🆘 Support

  - **Documentation:** [DOCS folder](./DOCS/README.md)
  - **Debug Issues:** [Debug Guide](./DOCS/08-DEBUG-GUIDE.md)
  - **Contact:** Please open an issue in the repository for bugs or feature requests.

## 🙏 Acknowledgments

Built with Next.js, MongoDB, and modern web technologies for educational institutions worldwide.

## 📄 License

MIT License - See LICENSE file for details.

-----

**Status:** ✅ Production Ready | **Version:** 2.0.0 | **Last Updated:** October 27, 2025

**Start Here:** [Quick Start Guide](./DOCS/01-QUICK-START.md) 🚀
