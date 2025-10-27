# 📚 ULab Attendance System - Documentation

> **Complete documentation for the ULab Attendance Tracking System**  
> A comprehensive Next.js application for managing student attendance with QR codes, date-wise CSV tracking, and MongoDB storage.

---

## 📖 Table of Contents

### 🚀 Getting Started
1. [**Quick Start Guide**](./01-QUICK-START.md)
   - Prerequisites & installation
   - Environment setup
   - First run
   - Testing the system

2. [**System Overview**](./02-SYSTEM-OVERVIEW.md)
   - What is this system?
   - Key features
   - Technology stack
   - Who should use this?

### 📋 User Guides

3. [**Instructor Guide**](./03-INSTRUCTOR-GUIDE.md)
   - Creating sessions
   - Managing attendance
   - Exporting data
   - Best practices

4. [**Student Guide**](./04-STUDENT-GUIDE.md)
   - How to mark attendance
   - Using QR codes
   - Troubleshooting common issues

### 🔧 Technical Documentation

5. [**System Architecture**](./05-ARCHITECTURE.md)
   - Complete system diagrams
   - Data flow
   - Security model
   - Database structure

6. [**Features Reference**](./06-FEATURES.md)
   - Complete feature list
   - Implementation details
   - API endpoints
   - Database schema

7. [**CSV & Date Management**](./07-CSV-DATE-MANAGEMENT.md)
   - Date-wise tracking
   - CSV format requirements
   - Excel compatibility
   - Supported date formats

### 🐛 Troubleshooting & Debugging

8. [**Debug Guide**](./08-DEBUG-GUIDE.md)
   - Debug logging
   - Common issues
   - Error messages
   - Solutions

9. [**Excel CSV Fix**](./09-EXCEL-FIX.md)
   - Excel date format issues
   - Automatic format detection
   - Supported formats
   - Verification steps

12. [**Netlify 504 Fix**](./12-NETLIFY-FIX.md)
   - Fix timeout errors on Netlify
   - Performance optimization
   - MongoDB configuration
   - Deployment troubleshooting

### 📦 Deployment & Production

10. [**Deployment Guide**](./10-DEPLOYMENT.md)
    - Local development checklist
    - Production deployment
    - Vercel deployment
    - Environment configuration

### 📊 Sample Data & Testing

11. [**Sample Data**](./11-SAMPLE-DATA.md)
    - Test CSV data
    - Sample course information
    - Testing workflows
    - Example scenarios

---

## 🎯 Quick Navigation

### **I'm a teacher and want to...**
- **Get started quickly** → [Quick Start Guide](./01-QUICK-START.md)
- **Create my first session** → [Instructor Guide](./03-INSTRUCTOR-GUIDE.md)
- **Export attendance data** → [Instructor Guide - Exporting](./03-INSTRUCTOR-GUIDE.md#exporting-data)
- **Resume from previous CSV** → [CSV & Date Management](./07-CSV-DATE-MANAGEMENT.md)
- **Fix Excel date issues** → [Excel CSV Fix](./09-EXCEL-FIX.md)
- **Fix Netlify 504 errors** → [Netlify Fix Guide](./12-NETLIFY-FIX.md)

### **I'm a student and want to...**
- **Mark my attendance** → [Student Guide](./04-STUDENT-GUIDE.md)
- **Know what to do if QR doesn't work** → [Student Guide - Troubleshooting](./04-STUDENT-GUIDE.md#troubleshooting)

### **I'm a developer and want to...**
- **Understand the architecture** → [System Architecture](./05-ARCHITECTURE.md)
- **See all features** → [Features Reference](./06-FEATURES.md)
- **Debug issues** → [Debug Guide](./08-DEBUG-GUIDE.md)
- **Deploy to production** → [Deployment Guide](./10-DEPLOYMENT.md)

### **I'm experiencing problems with...**
- **CSV not loading** → [Debug Guide](./08-DEBUG-GUIDE.md)
- **Excel dates not working** → [Excel CSV Fix](./09-EXCEL-FIX.md)
- **MongoDB connection** → [Quick Start - Troubleshooting](./01-QUICK-START.md#troubleshooting)
- **QR code not scanning** → [Student Guide - Troubleshooting](./04-STUDENT-GUIDE.md#troubleshooting)

---

## 📚 Documentation Structure

```
DOCS/
├── README.md (You are here - Table of Contents)
├── 01-QUICK-START.md
├── 02-SYSTEM-OVERVIEW.md
├── 03-INSTRUCTOR-GUIDE.md
├── 04-STUDENT-GUIDE.md
├── 05-ARCHITECTURE.md
├── 06-FEATURES.md
├── 07-CSV-DATE-MANAGEMENT.md
├── 08-DEBUG-GUIDE.md
├── 09-EXCEL-FIX.md
├── 10-DEPLOYMENT.md
└── 11-SAMPLE-DATA.md
```

---

## 🔄 Recent Updates

### Latest Changes
- ✅ Universal date format support (all common formats)
- ✅ Enhanced CSV debugging
- ✅ Excel compatibility improvements
- ✅ View all attendance feature
- ✅ Light/dark theme support
- ✅ Manual attendance control
- ✅ Semester end review
- ✅ Leave approval system

---

## 💡 Key Features at a Glance

| Feature | Description |
|---------|-------------|
| 📊 **CSV Import/Export** | Import student lists, export with date-wise columns |
| 🔲 **QR Code Generation** | Automatic QR codes for easy attendance |
| 🗄️ **MongoDB Storage** | Temporary session storage with auto-cleanup |
| 🛡️ **Duplicate Prevention** | IP/User-Agent tracking prevents proxy attendance |
| 📅 **Date-Based Tracking** | One CSV file tracks entire semester |
| 🌓 **Light/Dark Theme** | Toggle between themes with persistent storage |
| 📝 **Manual Control** | Teachers can manually adjust attendance |
| 🎓 **Semester Review** | Identify students with excessive absences |
| 📋 **View All** | Comprehensive attendance grid for all dates |

---

## 🆘 Getting Help

1. **Check the relevant guide** using the table of contents above
2. **Search for your issue** in the Debug Guide
3. **Review error messages** in browser console (F12)
4. **Check server logs** in your terminal

---

## 📄 License

MIT License - See project root for details

---

## 🙏 Acknowledgments

Built with Next.js, MongoDB, and modern web technologies for educational institutions.

---

**Last Updated**: October 27, 2025  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
