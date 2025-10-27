import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Course, Student } from '@/lib/types';
import { randomBytes } from 'crypto';
import { parseExportedCSV } from '@/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    console.log('\n🚀 [Load API] Starting CSV load request...');
    
    const body = await request.json();
    const { fileContent, selectedDate } = body;

    console.log('📥 [Load API] Request details:', {
      hasFileContent: !!fileContent,
      fileContentLength: fileContent?.length || 0,
      selectedDate,
    });

    if (!fileContent) {
      console.error('❌ [Load API] No file content provided');
      return NextResponse.json(
        { error: 'Missing file content' },
        { status: 400 }
      );
    }

    console.log('📝 [Load API] File content preview (first 500 chars):\n', fileContent.substring(0, 500));

    // Parse CSV file
    console.log('🔄 [Load API] Starting CSV parsing...');
    const parsedData = parseExportedCSV(fileContent);

    console.log('✅ [Load API] CSV parsed successfully:', {
      courseName: parsedData.courseName,
      courseId: parsedData.courseId,
      semester: parsedData.semester,
      section: parsedData.section,
      studentCount: parsedData.students.length,
      dateCount: parsedData.dates.length,
    });

    // Validate data
    if (!parsedData.courseName || !parsedData.courseId || !parsedData.semester || !parsedData.section) {
      console.error('❌ [Load API] Missing required course information:', {
        hasCourseName: !!parsedData.courseName,
        hasCourseId: !!parsedData.courseId,
        hasSemester: !!parsedData.semester,
        hasSection: !!parsedData.section,
      });
      return NextResponse.json(
        { error: 'Missing required course information in CSV' },
        { status: 400 }
      );
    }

    if (parsedData.students.length === 0) {
      console.error('❌ [Load API] No students found in file');
      return NextResponse.json(
        { error: 'No students found in file' },
        { status: 400 }
      );
    }

    // Use selected date or default to today
    const attendanceDate = selectedDate || new Date().toISOString().split('T')[0];

    // Check if the selected date exists in ANY column of the CSV
    const dateExistsInCSV = parsedData.dates.includes(attendanceDate);

    console.log('📅 [Load API] Date matching:', {
      selectedDate: attendanceDate,
      dateExistsInCSV,
      allDatesInCSV: parsedData.dates,
      csvDateCount: parsedData.dates.length,
    });

    // Convert to Student format with date-based attendance
    console.log('🔄 [Load API] Converting to Student format...');
    const students: Student[] = parsedData.students.map((s, index) => {
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

      if (index === 0) {
        console.log('👤 [Load API] Sample converted student:', {
          id: s.id,
          name: s.name,
          attendanceKeys: Object.keys(attendance),
          attendanceCount: Object.keys(attendance).length,
        });
      }

      return {
        id: s.id,
        name: s.name,
        attendance,
      };
    });

    // Generate new session ID
    const sessionId = randomBytes(16).toString('hex');

    console.log('🆔 [Load API] Generated session ID:', sessionId);

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

    console.log('💾 [Load API] Storing in MongoDB...');
    
    // Store in MongoDB
    const db = await getDatabase();
    const result = await db.collection('courses').insertOne(course);

    console.log('✅ [Load API] Successfully stored in MongoDB:', {
      insertedId: result.insertedId,
      sessionId,
      studentCount: students.length,
    });

    const responseMessage = dateExistsInCSV 
      ? `Session resumed with existing attendance for ${attendanceDate}`
      : `New session created for ${attendanceDate}`;

    console.log('🎉 [Load API] Request completed successfully:', responseMessage);

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
    console.error('💥 [Load API] Error loading from file:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
