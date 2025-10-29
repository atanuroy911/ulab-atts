import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { AttendanceRecord } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, studentId } = body;

    if (!sessionId || !studentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Find the course
    const course = await db.collection('courses').findOne({ sessionId, active: true });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or session ended' },
        { status: 404 }
      );
    }

    const currentDate = course.currentDate; // YYYY-MM-DD format

    // Check if student exists in the course
    const studentIndex = course.students.findIndex(
      (s: { id: string }) => s.id === studentId
    );

    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Student not found in this course' },
        { status: 404 }
      );
    }

    const student = course.students[studentIndex];

    // Check if student already attended TODAY
    if (student.attendance?.[currentDate]?.attended) {
      return NextResponse.json(
        { error: 'You have already marked attendance for today' },
        { status: 400 }
      );
    }

    // Record attendance (no more IP/UserAgent tracking)
    const attendanceRecord: AttendanceRecord = {
      sessionId,
      studentId,
      date: currentDate,
      timestamp: new Date(),
    };

    await db.collection('attendance_records').insertOne(attendanceRecord);

    // Update student attendance for current date
    if (!student.attendance) {
      student.attendance = {};
    }
    
    student.attendance[currentDate] = {
      attended: true,
      attendedAt: new Date(),
    };

    await db.collection('courses').updateOne(
      { sessionId },
      { $set: { [`students.${studentIndex}`]: student } }
    );

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully',
      student: {
        id: student.id,
        name: student.name,
        attendedAt: student.attendance[currentDate].attendedAt,
        date: currentDate,
      },
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
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
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      courseName: course.courseName,
      courseId: course.courseId,
      semester: course.semester,
      section: course.section,
    });
  } catch (error) {
    console.error('Error fetching session info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
