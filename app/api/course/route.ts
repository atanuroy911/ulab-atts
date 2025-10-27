import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Course, Student } from '@/lib/types';
import Papa from 'papaparse';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvData, courseName, courseId, semester, section, selectedDate } = body;

    if (!csvData || !courseName || !courseId || !semester || !section) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse CSV data
    const parsed = Papa.parse<string[]>(csvData.trim(), {
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid CSV format', details: parsed.errors },
        { status: 400 }
      );
    }

    // Use selected date or default to today
    const attendanceDate = selectedDate || new Date().toISOString().split('T')[0];

    // Convert parsed data to students array with date-based attendance
    const students: Student[] = parsed.data.map((row) => ({
      id: row[0]?.trim() || '',
      name: row[1]?.trim() || '',
      attendance: {}, // Empty attendance object, will be populated as students attend
    }));

    // Validate students
    if (students.length === 0) {
      return NextResponse.json(
        { error: 'No students found in CSV' },
        { status: 400 }
      );
    }

    // Generate session ID
    const sessionId = randomBytes(16).toString('hex');

    // Create course object
    const course: Course = {
      sessionId,
      courseName,
      courseId,
      semester,
      section,
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
      currentDate: attendanceDate,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const course = await db.collection('courses').findOne({ sessionId });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
