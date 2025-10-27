# System Architecture Diagram

## 🏗️ Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ATTENDANCE MANAGEMENT SYSTEM                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐          ┌──────────────────────┐
│   INSTRUCTOR VIEW    │          │    STUDENT VIEW      │
│  (Dashboard Page)    │          │  (Attendance Page)   │
└──────────────────────┘          └──────────────────────┘
         │                                   │
         │                                   │
    ┌────▼─────────────────────────────────▼────┐
    │         NEXT.JS APPLICATION                │
    │         (Frontend + Backend)               │
    └────────────────┬───────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────┐
    │ /api/   │ │ /api/  │ │ /api/  │
    │ course  │ │ attend │ │ export │
    └────┬────┘ └───┬────┘ └───┬────┘
         │          │           │
         └──────────┼───────────┘
                    │
         ┌──────────▼──────────┐
         │  MONGODB DATABASE   │
         │   (Temporary)       │
         │                     │
         │  ┌───────────────┐  │
         │  │   courses     │  │
         │  │   collection  │  │
         │  └───────────────┘  │
         │                     │
         │  ┌───────────────┐  │
         │  │  attendance_  │  │
         │  │   records     │  │
         │  └───────────────┘  │
         └─────────────────────┘
                    │
                    │ (On Export)
                    │
         ┌──────────▼──────────┐
         │   COMPLETE DELETE   │
         │   ALL COLLECTIONS   │
         └─────────────────────┘
                    
         ┌─────────────────────┐
         │  PERMANENT STORAGE  │
         │  (File System)      │
         │                     │
         │  public/exports/    │
         │  ├─ CS101_*.json    │
         │  ├─ CS201_*.json    │
         │  └─ ...             │
         │                     │
         │  Downloads/         │
         │  ├─ attendance_*.json│
         │  ├─ attendance_*.csv │
         │  └─ ...             │
         └─────────────────────┘
```

## 🔄 Data Flow Diagram

```
╔════════════════════════════════════════════════════════════════╗
║                    SESSION LIFECYCLE                           ║
╚════════════════════════════════════════════════════════════════╝

OPTION A: Create New Session
─────────────────────────────
┌────────────┐
│ Instructor │
│  Enters    │
│  Manual    │
│   CSV      │
└──────┬─────┘
       │
       ▼
┌─────────────────┐
│  Parse CSV      │
│  Validate       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate        │
│ Session ID      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in        │
│ MongoDB         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate        │
│ QR Code         │
└────────┬────────┘
         │
         └──────────────┐
                        │
OPTION B: Resume Session│
─────────────────────────│
┌────────────┐           │
│ Instructor │           │
│  Uploads   │           │
│  JSON/CSV  │           │
└──────┬─────┘           │
       │                 │
       ▼                 │
┌─────────────────┐      │
│  Parse File     │      │
│  Detect Type    │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ Extract Data    │      │
│ Reset Attend.   │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ Generate NEW    │      │
│ Session ID      │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ Store in        │      │
│ MongoDB         │      │
└────────┬────────┘      │
         │               │
         ▼               │
┌─────────────────┐      │
│ Generate NEW    │      │
│ QR Code         │      │
└────────┬────────┘      │
         │               │
         └───────────────┘
                 │
         ┌───────▼────────┐
         │ ACTIVE SESSION │
         │   IN MONGODB   │
         └───────┬────────┘
                 │
         ┌───────▼────────────────┐
         │ Students Scan QR       │
         │ Mark Attendance        │
         │ (Real-time Updates)    │
         └───────┬────────────────┘
                 │
         ┌───────▼────────┐
         │ Export & End   │
         │   Session      │
         └───────┬────────┘
                 │
         ┌───────▼────────────┐
         │ Download JSON      │
         │ Download CSV       │
         └───────┬────────────┘
                 │
         ┌───────▼────────────┐
         │ Save to            │
         │ public/exports/    │
         └───────┬────────────┘
                 │
         ┌───────▼────────────┐
         │ DELETE FROM        │
         │ MONGODB            │
         │ (Complete Clean)   │
         └────────────────────┘
```

## 🔐 Duplicate Prevention System

```
┌──────────────────────────────────────────────────────────┐
│              ATTENDANCE REQUEST                          │
└─────────────────┬────────────────────────────────────────┘
                  │
       ┌──────────▼──────────┐
       │ Extract:            │
       │ • Student ID        │
       │ • IP Address        │
       │ • User-Agent        │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────────────┐
       │ Check #1: Session Active?   │
       │ ┌────┐           ┌────┐     │
       │ │ NO │ ────────> │REJECT│   │
       │ └────┘           └────┘     │
       │ ┌────┐                      │
       │ │YES │ ──────────────────┐  │
       │ └────┘                    │  │
       └───────────────────────────┼──┘
                                   │
       ┌───────────────────────────▼──┐
       │ Check #2: Student Exists?    │
       │ ┌────┐           ┌────┐      │
       │ │ NO │ ────────> │REJECT│    │
       │ └────┘           └────┘      │
       │ ┌────┐                       │
       │ │YES │ ──────────────────┐   │
       │ └────┘                    │   │
       └────────────────────────────┼──┘
                                    │
       ┌────────────────────────────▼───┐
       │ Check #3: Already Attended?    │
       │ ┌────┐           ┌────┐        │
       │ │YES │ ────────> │REJECT│      │
       │ └────┘           └────┘        │
       │ ┌────┐                         │
       │ │ NO │ ──────────────────┐     │
       │ └────┘                    │     │
       └────────────────────────────┼────┘
                                    │
       ┌────────────────────────────▼────────┐
       │ Check #4: Same IP + User-Agent      │
       │          with Different ID?         │
       │ ┌────┐              ┌────┐          │
       │ │YES │ ──────────>  │REJECT│        │
       │ └────┘              └────┘          │
       │ ┌────┐                              │
       │ │ NO │ ──────────────────┐          │
       │ └────┘                    │          │
       └────────────────────────────┼─────────┘
                                    │
       ┌────────────────────────────▼─────┐
       │ ✅ ATTENDANCE APPROVED           │
       │                                  │
       │ 1. Record in attendance_records  │
       │ 2. Update student in courses     │
       │ 3. Return success message        │
       └──────────────────────────────────┘
```

## 📊 Real-time Update Flow

```
┌─────────────┐
│  Dashboard  │
│   (Browser) │
└──────┬──────┘
       │
       │ Every 5 seconds
       │
       ▼
┌──────────────────┐
│ GET /api/course  │
│ ?sessionId=XXX   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Fetch from       │
│ MongoDB          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Return Updated   │
│ Student List     │
│ with Attendance  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Update UI        │
│ • Green rows     │
│ • Count (X/Y)    │
│ • Timestamps     │
└──────────────────┘
```

## 🗄️ MongoDB Collections Structure

```
DATABASE: attendance_system
│
├─ COLLECTION: courses
│  │
│  ├─ DOCUMENT (Active Session)
│  │  {
│  │    _id: ObjectId("..."),
│  │    sessionId: "abc123...",
│  │    courseName: "Intro to CS",
│  │    courseId: "CS101",
│  │    semester: "Fall 2025",
│  │    section: "A",
│  │    students: [
│  │      {
│  │        id: "S001",
│  │        name: "Alice Johnson",
│  │        attended: true,
│  │        attendedAt: ISODate("..."),
│  │        ipAddress: "192.168.1.100",
│  │        userAgent: "Mozilla/5.0..."
│  │      },
│  │      { id: "S002", ... }
│  │    ],
│  │    createdAt: ISODate("..."),
│  │    active: true
│  │  }
│  │
│  └─ After Export: DELETED ✓
│
└─ COLLECTION: attendance_records
   │
   ├─ DOCUMENT (Per Attendance)
   │  {
   │    sessionId: "abc123...",
   │    studentId: "S001",
   │    ipAddress: "192.168.1.100",
   │    userAgent: "Mozilla/5.0...",
   │    timestamp: ISODate("...")
   │  }
   │
   └─ After Export: ALL DELETED ✓
```

## 📱 QR Code Flow

```
┌──────────────────┐
│  Generate QR     │
│  Code            │
│                  │
│  Contains:       │
│  {SITE_URL}/     │
│  attend?         │
│  sessionId=XXX   │
└────────┬─────────┘
         │
         │ Display on Screen
         │
┌────────▼─────────┐
│  Student Scans   │
│  with Phone      │
└────────┬─────────┘
         │
         │ Opens URL
         │
┌────────▼─────────┐
│  /attend Page    │
│  Loads           │
│                  │
│  Shows:          │
│  • Course Info   │
│  • Input Field   │
└────────┬─────────┘
         │
         │ Student Enters ID
         │
┌────────▼─────────┐
│  Submit Request  │
│  to /api/attend  │
└────────┬─────────┘
         │
         ▼
   [Validation Flow]
         │
         ▼
┌────────────────┐
│  Success!      │
│  Welcome,      │
│  [Name]        │
└────────────────┘
```

This diagram shows the complete architecture and data flow of your attendance management system!
