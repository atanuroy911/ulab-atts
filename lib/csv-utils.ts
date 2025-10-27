import Papa from 'papaparse';

export interface CSVStudent {
  id: string;
  name: string;
}

export interface ParsedCSVData {
  courseName: string;
  courseId: string;
  semester: string;
  section: string;
  students: Array<{
    id: string;
    name: string;
    attendance: Record<string, boolean>;
  }>;
  dates: string[];
}

/**
 * Parse CSV text into student array
 */
export function parseCSV(csvText: string): CSVStudent[] {
  const parsed = Papa.parse<string[]>(csvText.trim(), {
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parsing error: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row) => ({
    id: row[0]?.trim() || '',
    name: row[1]?.trim() || '',
  }));
}

/**
 * Parse exported CSV with date columns
 */
export function parseExportedCSV(csvText: string): ParsedCSVData {
  const parsed = Papa.parse<any>(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parsing error: ${parsed.errors[0].message}`);
  }

  if (parsed.data.length === 0) {
    throw new Error('No data found in CSV');
  }

  const firstRow = parsed.data[0];
  const courseName = firstRow['Course Name'] || '';
  const courseId = firstRow['Course ID'] || '';
  const semester = firstRow['Semester'] || '';
  const section = firstRow['Section'] || '';

  // Get all date columns (YYYY-MM-DD format)
  const dateColumns = Object.keys(firstRow).filter(key => 
    key.match(/^\d{4}-\d{2}-\d{2}$/)
  );

  const students = parsed.data.map((row: any) => {
    const attendance: Record<string, boolean> = {};
    dateColumns.forEach(date => {
      const value = row[date];
      // Only process if the cell has a value (not empty/undefined)
      if (value !== undefined && value !== null && value !== '') {
        const normalized = value.toLowerCase().trim();
        attendance[date] = normalized === 'present' || normalized === 'yes' || normalized === '1' || normalized === 'true';
      }
    });

    return {
      id: row['Student ID'] || '',
      name: row['Student Name'] || '',
      attendance,
    };
  });

  return {
    courseName,
    courseId,
    semester,
    section,
    students,
    dates: dateColumns,
  };
}

/**
 * Convert student list to CSV format
 */
export function studentsToCSV(students: CSVStudent[]): string {
  const csv = Papa.unparse(students.map(s => [s.id, s.name]));
  return csv;
}

/**
 * Convert attendance data to CSV format with date columns
 */
export function attendanceToCSV(
  students: any[],
  courseInfo: {
    courseName: string;
    courseId: string;
    semester: string;
    section: string;
  }
): string {
  // Get all unique dates from all students
  const allDates = new Set<string>();
  students.forEach(student => {
    if (student.attendance) {
      Object.keys(student.attendance).forEach(date => allDates.add(date));
    }
  });

  const sortedDates = Array.from(allDates).sort();

  // Build CSV data
  const csvData = students.map(student => {
    const row: any = {
      'Student ID': student.id,
      'Student Name': student.name,
      'Course Name': courseInfo.courseName,
      'Course ID': courseInfo.courseId,
      'Semester': courseInfo.semester,
      'Section': courseInfo.section,
    };

    // Add date columns
    sortedDates.forEach(date => {
      const attended = student.attendance?.[date]?.attended || false;
      row[date] = attended ? 'Present' : 'Absent';
    });

    return row;
  });

  const csv = Papa.unparse(csvData);
  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate CSV format
 */
export function validateCSV(csvText: string): {
  valid: boolean;
  error?: string;
  studentCount?: number;
} {
  try {
    const students = parseCSV(csvText);
    
    if (students.length === 0) {
      return { valid: false, error: 'No students found in CSV' };
    }

    // Check if all students have both ID and name
    const invalidStudents = students.filter(s => !s.id || !s.name);
    if (invalidStudents.length > 0) {
      return {
        valid: false,
        error: `${invalidStudents.length} student(s) missing ID or name`,
      };
    }

    return { valid: true, studentCount: students.length };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

