import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Course, Student } from '@/lib/types';
import { randomBytes } from 'crypto';
import { parseExportedCSV } from '@/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured. Please set MONGODB_URI environment variable.' },
        { status: 500 }
      );
    }

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

    // Convert to Student format with date-based attendance
    const students: Student[] = parsedData.students.map((s) => {
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
    
    // Store in MongoDB with timeout protection
    const dbTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timeout')), 8000)
    );
    
    const dbOperation = (async () => {
      const db = await getDatabase();
      return await db.collection('courses').insertOne(course);
    })();

    const result = await Promise.race([dbOperation, dbTimeout]) as any;

    const responseMessage = dateExistsInCSV 
      ? `Session resumed with existing attendance for ${attendanceDate}`
      : `New session created for ${attendanceDate}`;

    return NextResponse.json({
      success: true,
      sessionId,
      courseId: result.insertedId,
      students: students.length,
      message: responseMessage,
      currentDate: attendanceDate,
      dateExistsInCSV,
    });
  } catch (error: any) {
    // Log error details for debugging (visible in Netlify function logs)
    console.error('[Load API Error]', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack?.split('\n')[0], // First line only
    });

    // Return user-friendly error message with specific hints
    let errorMessage = 'Failed to load attendance data';
    let errorHint = '';
    
    if (error.message?.includes('SSL') || error.message?.includes('TLS') || error.message?.includes('0A000438')) {
      errorMessage = 'MongoDB SSL/TLS connection error';
      errorHint = 'Please check MongoDB Atlas settings: 1) Network Access → IP Whitelist must include 0.0.0.0/0 (allow from anywhere), 2) Database user has correct permissions, 3) MONGODB_URI is correctly set in Netlify environment variables';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Database operation timed out';
      errorHint = 'MongoDB connection is too slow. Check: 1) MongoDB Atlas cluster region (use closest to Netlify), 2) Network Access whitelist includes 0.0.0.0/0, 3) Try upgrading MongoDB Atlas tier';
    } else if (error.message?.includes('CSV')) {
      errorMessage = error.message;
      errorHint = 'Check CSV format: ensure headers match expected format (Student ID, Student Name, Course Name, etc.)';
    } else if (error.message?.includes('authentication') || error.message?.includes('auth')) {
      errorMessage = 'Database authentication failed';
      errorHint = 'Check MONGODB_URI username and password are correct in Netlify environment variables';
    } else if (error.message?.includes('Database not configured')) {
      errorMessage = error.message;
      errorHint = 'Add MONGODB_URI to Netlify: Site Settings → Environment Variables → Add Variable';
    }

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        hint: errorHint,
        helpUrl: 'https://github.com/atanuroy911/ulab-atts/blob/main/DOCS/12-NETLIFY-FIX.md'
      },
      { status: 500 }
    );
  }
}
