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

  // Helper function to normalize date to YYYY-MM-DD format
  const normalizeDate = (dateStr: string): string | null => {
    try {
      // Already in YYYY-MM-DD format
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateStr;
      }
      
      // Try to parse M/D/YYYY or MM/DD/YYYY format (e.g., 10/27/2025, 1/9/2025)
      const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (slashMatch) {
        const [, month, day, year] = slashMatch;
        const m = month.padStart(2, '0');
        const d = day.padStart(2, '0');
        return `${year}-${m}-${d}`;
      }
      
      // Try to parse DD/MM/YYYY format (e.g., 27/10/2025)
      const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddmmyyyyMatch) {
        const [, first, second, year] = ddmmyyyyMatch;
        // Ambiguous - try both interpretations and use JavaScript Date to validate
        const monthFirst = new Date(`${year}-${first.padStart(2, '0')}-${second.padStart(2, '0')}`);
        const dayFirst = new Date(`${year}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`);
        
        if (!isNaN(monthFirst.getTime()) && parseInt(first) <= 12) {
          // Could be MM/DD/YYYY - already handled above
        }
        if (!isNaN(dayFirst.getTime()) && parseInt(first) > 12) {
          // Must be DD/MM/YYYY
          return `${year}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
        }
      }
      
      // Try to parse DD-MM-YYYY format (e.g., 27-10-2025)
      const ddmmyyyyDashMatch = dateStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (ddmmyyyyDashMatch) {
        const [, day, month, year] = ddmmyyyyDashMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Try to parse YYYY/MM/DD format (e.g., 2025/10/27)
      const yyyySlashMatch = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
      if (yyyySlashMatch) {
        const [, year, month, day] = yyyySlashMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Try to parse DD.MM.YYYY format (e.g., 27.10.2025)
      const dotMatch = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (dotMatch) {
        const [, day, month, year] = dotMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Try to parse YYYYMMDD format (e.g., 20251027)
      const compactMatch = dateStr.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (compactMatch) {
        const [, year, month, day] = compactMatch;
        return `${year}-${month}-${day}`;
      }
      
      // Try to parse Month DD, YYYY format (e.g., October 27, 2025 or Oct 27, 2025)
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                          'july', 'august', 'september', 'october', 'november', 'december'];
      const monthAbbrev = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      
      const monthTextMatch = dateStr.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);
      if (monthTextMatch) {
        const [, monthStr, day, year] = monthTextMatch;
        const monthLower = monthStr.toLowerCase();
        let monthNum = monthNames.indexOf(monthLower) + 1;
        if (monthNum === 0) {
          monthNum = monthAbbrev.indexOf(monthLower) + 1;
        }
        if (monthNum > 0) {
          return `${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      // Try to parse DD Month YYYY format (e.g., 27 October 2025 or 27 Oct 2025)
      const dayMonthTextMatch = dateStr.match(/^(\d{1,2})\s+([a-z]+),?\s+(\d{4})$/i);
      if (dayMonthTextMatch) {
        const [, day, monthStr, year] = dayMonthTextMatch;
        const monthLower = monthStr.toLowerCase();
        let monthNum = monthNames.indexOf(monthLower) + 1;
        if (monthNum === 0) {
          monthNum = monthAbbrev.indexOf(monthLower) + 1;
        }
        if (monthNum > 0) {
          return `${year}-${monthNum.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      // Try using native JavaScript Date parser as fallback
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
        const day = parsedDate.getDate().toString().padStart(2, '0');
        // Validate it's a reasonable year (between 2000-2100)
        if (year >= 2000 && year <= 2100) {
          return `${year}-${month}-${day}`;
        }
      }
      
      console.warn(`⚠️ Could not parse date: "${dateStr}"`);
      return null;
    } catch (error) {
      return null;
    }
  };

  // Get all date columns - try to detect any column that might be a date
  const rawDateColumns = Object.keys(firstRow).filter(key => {
    // Skip known non-date columns
    const nonDateColumns = ['student id', 'student name', 'course name', 'course id', 
                            'semester', 'section', 'id', 'name', 'email', 'phone'];
    if (nonDateColumns.includes(key.toLowerCase())) {
      return false;
    }
    
    // Try to normalize - if it returns a valid date, it's a date column
    return normalizeDate(key) !== null;
  });

  // Create a mapping of raw dates to normalized dates
  const dateMapping: Record<string, string> = {};
  rawDateColumns.forEach(rawDate => {
    const normalized = normalizeDate(rawDate);
    if (normalized) {
      dateMapping[rawDate] = normalized;
    }
  });

  const dateColumns = Object.values(dateMapping); // These are normalized YYYY-MM-DD dates

  const students = parsed.data.map((row: any) => {
    const attendance: Record<string, boolean> = {};
    
    // Use the raw date columns and map them to normalized dates
    rawDateColumns.forEach(rawDate => {
      const normalizedDate = dateMapping[rawDate];
      if (!normalizedDate) return;
      
      const value = row[rawDate]; // Read from the original column name
      // Only process if the cell has a value (not empty/undefined)
      if (value !== undefined && value !== null && value !== '') {
        const normalized = value.toLowerCase().trim();
        const isPresent = normalized === 'present' || normalized === 'yes' || normalized === '1' || normalized === 'true';
        attendance[normalizedDate] = isPresent; // Store with normalized date
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

