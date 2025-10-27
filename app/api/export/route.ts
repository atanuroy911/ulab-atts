import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

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

    // Return course data for export (frontend will handle CSV generation)
    const exportData = {
      courseName: course.courseName,
      courseId: course.courseId,
      semester: course.semester,
      section: course.section,
      students: course.students,
      currentDate: course.currentDate,
    };

    // Delete the course from MongoDB completely
    await db.collection('courses').deleteOne({ sessionId });

    // Clear attendance records for this session
    await db.collection('attendance_records').deleteMany({ sessionId });

    return NextResponse.json({
      success: true,
      message: 'Session ended and data cleared from MongoDB',
      exportData,
    });
  } catch (error) {
    console.error('Error exporting attendance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

