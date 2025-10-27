import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Course, Student } from '@/lib/types';
import { randomBytes } from 'crypto';
import { parseExportedCSV } from '@/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent, selectedDate } = body;

    if (!fileContent) {
      return NextResponse.json(
        { error: 'Missing file content' },
        { status: 400 }
      );
    }

    // Parse CSV file
    const parsedData = parseExportedCSV(fileContent);

    // Validate data
    if (!parsedData.courseName || !parsedData.courseId || !parsedData.semester || !parsedData.section) {
      return NextResponse.json(
        { error: 'Missing required course information in CSV' },
        { status: 400 }
      );
    }

    if (parsedData.students.length === 0) {
      return NextResponse.json(
        { error: 'No students found in file' },
        { status: 400 }
      );
    }

    // Use selected date or default to today
    const attendanceDate = selectedDate || new Date().toISOString().split('T')[0];

    // Check if the selected date exists in ANY column of the CSV
    const dateExistsInCSV = parsedData.dates.includes(attendanceDate);

    console.log('Load Session Info:', {
      selectedDate: attendanceDate,
      dateExistsInCSV,
      allDatesInCSV: parsedData.dates,
    });

    // Convert to Student format with date-based attendance
    const students: Student[] = parsedData.students.map(s => {
      const attendance: Record<string, any> = {};
      
      // Copy all existing dates from CSV
      parsedData.dates.forEach(date => {
        if (date in s.attendance) {
          attendance[date] = {
            attended: s.attendance[date],
            attendedAt: new Date(`${date}T12:00:00`),
          };
        }
      });

      return {
        id: s.id,
        name: s.name,
        attendance,
      };
    });

    // Generate new session ID
    const sessionId = randomBytes(16).toString('hex');

    // Create course object
    const course: Course = {
      sessionId,
      courseName: parsedData.courseName,
      courseId: parsedData.courseId,
      semester: parsedData.semester,
      section: parsedData.section,
      students,
      currentDate: attendanceDate,
      createdAt: new Date(),
      active: true,
    };

    // Store in MongoDB
    const db = await getDatabase();
    const result = await db.collection('courses').insertOne(course);

    return NextResponse.json({
      success: true,
      sessionId,
      courseId: result.insertedId,
      students: students.length,
      message: dateExistsInCSV 
        ? `Session resumed with existing attendance for ${attendanceDate}`
        : `New session created for ${attendanceDate}`,
      currentDate: attendanceDate,
      dateExistsInCSV,
    });
  } catch (error: any) {
    console.error('Error loading from file:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
