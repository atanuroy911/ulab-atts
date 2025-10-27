import { ObjectId } from 'mongodb';

export interface Student {
  id: string;
  name: string;
  attendance: Record<string, {
    attended: boolean;
    attendedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
  }>;
}

export interface Course {
  _id?: ObjectId;
  sessionId: string;
  courseName: string;
  courseId: string;
  semester: string;
  section: string;
  students: Student[];
  currentDate: string; // YYYY-MM-DD format
  createdAt: Date;
  active: boolean;
}

export interface AttendanceRecord {
  sessionId: string;
  studentId: string;
  date: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

