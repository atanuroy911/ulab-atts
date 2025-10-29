import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, studentId, attended, date } = body;

    if (!sessionId || !studentId || attended === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const student = course.students.find((s: any) => s.id === studentId);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Use provided date or current date from course
    const targetDate = date || course.currentDate;

    // Update or create attendance record (no IP tracking)
    if (!student.attendance) {
      student.attendance = {};
    }

    if (attended) {
      student.attendance[targetDate] = {
        attended: true,
        attendedAt: new Date(),
      };
    } else {
      // Remove attendance or set to false
      if (student.attendance[targetDate]) {
        delete student.attendance[targetDate];
      }
    }

    // Update in database
    await db.collection('courses').updateOne(
      { sessionId },
      { $set: { students: course.students } }
    );

    return NextResponse.json({
      success: true,
      message: attended ? 'Attendance marked' : 'Attendance removed',
      studentId,
      attended,
      date: targetDate,
    });
  } catch (error: any) {
    console.error('Error in manual attendance:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
