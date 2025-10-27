'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Course, Student } from '@/lib/types';
import { attendanceToCSV, downloadCSV } from '@/lib/csv-utils';
import Navbar from './components/Navbar';
import ManualAttendanceControl from './components/ManualAttendanceControl';

export default function Home() {
  const [csvData, setCsvData] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLoadDate, setSelectedLoadDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [studentsWithAbsences, setStudentsWithAbsences] = useState<any[]>([]);
  const [showAllAttendanceModal, setShowAllAttendanceModal] = useState(false);

  // Auto-refresh course data every 5 seconds when active
  useEffect(() => {
    if (!currentCourse?.sessionId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/course?sessionId=${currentCourse.sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentCourse(data);
        }
      } catch (err) {
        console.error('Error refreshing course:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentCourse?.sessionId]);

  const handleCreateCourse = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvData,
          courseName,
          courseId,
          semester,
          section,
          selectedDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create course');
      }

      // Fetch the created course
      const courseResponse = await fetch(`/api/course?sessionId=${data.sessionId}`);
      const courseData = await courseResponse.json();
      setCurrentCourse(courseData);

      // Generate QR code
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const attendUrl = `${siteUrl}/attend?sessionId=${data.sessionId}`;
      const qrUrl = await QRCode.toDataURL(attendUrl, { width: 300 });
      setQrCodeUrl(qrUrl);

      setSuccess(`Course created successfully for ${selectedDate}! ${data.students} students loaded.`);
      
      // Clear form
      setCsvData('');
      setCourseName('');
      setCourseId('');
      setSemester('');
      setSection('');
      // Keep selected date for next use
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!currentCourse?.sessionId) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentCourse.sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to export attendance');
      }

      // Generate CSV with date columns
      const csvContent = attendanceToCSV(data.exportData.students, {
        courseName: data.exportData.courseName,
        courseId: data.exportData.courseId,
        semester: data.exportData.semester,
        section: data.exportData.section,
      });

      const filename = `attendance_${data.exportData.courseId}_${data.exportData.semester}_${data.exportData.section}.csv`;
      downloadCSV(csvContent, filename);

      setSuccess('Attendance exported successfully! CSV file downloaded. MongoDB cleared.');
      
      // Clear current session
      setCurrentCourse(null);
      setQrCodeUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      e.target.value = '';
      return;
    }

    setUploadedFile(file);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const fileContent = await file.text();

      const response = await fetch('/api/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileContent,
          selectedDate: selectedLoadDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load file');
      }

      // Fetch the created course
      const courseResponse = await fetch(`/api/course?sessionId=${data.sessionId}`);
      const courseData = await courseResponse.json();
      setCurrentCourse(courseData);

      // Generate QR code
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const attendUrl = `${siteUrl}/attend?sessionId=${data.sessionId}`;
      const qrUrl = await QRCode.toDataURL(attendUrl, { width: 300 });
      setQrCodeUrl(qrUrl);

      setSuccess(data.message + ` (${data.students} students loaded)`);
      setUploadedFile(null);
    } catch (err: any) {
      setError(err.message);
      setUploadedFile(null);
    } finally {
      setLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleToggleAttendance = async (studentId: string, attended: boolean) => {
    if (!currentCourse?.sessionId) return;

    setError('');

    try {
      const response = await fetch('/api/attend/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentCourse.sessionId,
          studentId,
          attended,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update attendance');
      }

      // Refresh course data
      const courseResponse = await fetch(`/api/course?sessionId=${currentCourse.sessionId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCurrentCourse(courseData);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSemesterEnd = () => {
    if (!currentCourse) return;

    // Get all dates from all students
    const allDates = new Set<string>();
    currentCourse.students.forEach((student: Student) => {
      if (student.attendance) {
        Object.keys(student.attendance).forEach(date => allDates.add(date));
      }
    });
    const sortedDates = Array.from(allDates).sort();

    // Check students with more than 6 absences
    const studentsWithIssues = currentCourse.students
      .map((student: Student) => {
        const absentDays: string[] = [];
        const presentDays: string[] = [];

        sortedDates.forEach(date => {
          if (student.attendance?.[date]?.attended) {
            presentDays.push(date);
          } else {
            absentDays.push(date);
          }
        });

        return {
          student,
          dates: sortedDates,
          absentDays,
          presentDays,
          absentCount: absentDays.length,
        };
      })
      .filter(s => s.absentCount > 6);

    if (studentsWithIssues.length === 0) {
      setSuccess('No students have more than 6 absences. Semester looks good!');
      return;
    }

    setStudentsWithAbsences(studentsWithIssues);
    setShowSemesterModal(true);
  };

  const handleApproveLeave = async (studentId: string) => {
    if (!currentCourse) return;

    const studentData = studentsWithAbsences.find(s => s.student.id === studentId);
    if (!studentData) return;

    setLoading(true);
    setError('');

    try {
      // Get 6 random absent days
      const absentDays = [...studentData.absentDays];
      const randomDays = absentDays.sort(() => 0.5 - Math.random()).slice(0, 6);

      // Mark those days as present using the manual attendance API
      for (const date of randomDays) {
        // Temporarily change the current date to mark attendance
        const response = await fetch('/api/attend/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentCourse.sessionId,
            studentId,
            attended: true,
            date, // We'll need to modify the API to accept date parameter
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to approve leave');
        }
      }

      // Refresh course data
      const courseResponse = await fetch(`/api/course?sessionId=${currentCourse.sessionId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCurrentCourse(courseData);
      }

      // Update the modal data
      setStudentsWithAbsences(prev => prev.filter(s => s.student.id !== studentId));
      setSuccess(`Leave approved for ${studentData.student.name}. 6 absences converted to present on: ${randomDays.join(', ')}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllAttendance = () => {
    setShowAllAttendanceModal(true);
  };

  const attendedCount = currentCourse?.students.filter((s: Student) => {
    const currentDate = currentCourse?.currentDate || new Date().toISOString().split('T')[0];
    return s.attendance?.[currentDate]?.attended;
  }).length || 0;
  const totalCount = currentCourse?.students.length || 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4 sm:p-8 bg-background">
        <div className="max-w-7xl mx-auto">

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border-2 border-red-600 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border-2 border-green-600 dark:border-green-800 text-green-800 dark:text-green-300 rounded-lg">
              {success}
            </div>
          )}

        {!currentCourse ? (
          <div className="space-y-6">
            {/* Load from File Section */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Resume Previous Session</h2>
              <p className="text-sm text-foreground/60 mb-4">
                Upload a previously exported CSV file to resume. If the selected date exists in the last column, attendance will be restored. Otherwise, a fresh session starts.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={selectedLoadDate}
                  onChange={(e) => setSelectedLoadDate(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Select the date for this attendance session. If this date matches the last column in CSV, previous attendance will be restored.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="block w-full text-sm text-foreground border border-input rounded-lg cursor-pointer bg-background focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                  />
                </label>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-foreground/60">OR</span>
              </div>
            </div>

            {/* Create New Session Section */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Create New Session</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="e.g., Computer Science 101"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Course ID
                  </label>
                  <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., Fall 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attendance Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Select the date for this attendance session
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student List (CSV Format: ID, Name)
                </label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent font-mono text-sm"
                  rows={10}
                  placeholder="S001,John Doe&#10;S002,Jane Smith&#10;S003,Bob Johnson"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Paste student data in CSV format: Student ID, Student Name (one per line)
                </p>
              </div>

              <button
                onClick={handleCreateCourse}
                disabled={loading || !csvData || !courseName || !courseId || !semester || !section}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Start Attendance Session'}
              </button>
            </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                {currentCourse.courseName}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium text-foreground/70">Course ID:</span>{' '}
                  <span className="text-foreground font-medium">{currentCourse.courseId}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground/70">Semester:</span>{' '}
                  <span className="text-foreground font-medium">{currentCourse.semester}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground/70">Section:</span>{' '}
                  <span className="text-foreground font-medium">{currentCourse.section}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground/70">Date:</span>{' '}
                  <span className="text-foreground font-semibold">{currentCourse.currentDate}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground/70">Attendance:</span>{' '}
                  <span className="text-primary font-bold text-lg">
                    {attendedCount} / {totalCount}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
                >
                  Export & End Session
                </button>
                <button
                  onClick={handleSemesterEnd}
                  disabled={loading}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
                >
                  Semester End Review
                </button>
                <button
                  onClick={handleViewAllAttendance}
                  disabled={loading}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
                >
                  View All Attendance
                </button>
                <button
                  onClick={() => window.location.reload()}
                  disabled={loading}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-800 py-2 px-6 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Exit Without Saving
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Manual Attendance Control */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <ManualAttendanceControl
                  students={currentCourse.students}
                  currentDate={currentCourse.currentDate || new Date().toISOString().split('T')[0]}
                  onToggleAttendance={handleToggleAttendance}
                />
              </div>

              {/* Student List */}
              <div className="lg:col-span-2 order-1 lg:order-2 bg-card border border-border p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">Student List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-secondary-foreground">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-secondary-foreground">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-secondary-foreground">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-secondary-foreground">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentCourse.students.map((student: Student, index: number) => {
                        const currentDate = currentCourse.currentDate || new Date().toISOString().split('T')[0];
                        const todayAttendance = student.attendance?.[currentDate];
                        const attended = todayAttendance?.attended || false;
                        const attendedAt = todayAttendance?.attendedAt;
                        
                        return (
                        <tr key={index} className={attended ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                          <td className="px-4 py-2 text-sm text-foreground">{student.id}</td>
                          <td className="px-4 py-2 text-sm text-foreground">{student.name}</td>
                          <td className="px-4 py-2 text-sm">
                            {attended ? (
                              <span className="text-green-600 dark:text-green-400 font-semibold">✓ Present</span>
                            ) : (
                              <span className="text-foreground/40">Absent</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-foreground/60">
                            {attendedAt
                              ? new Date(attendedAt).toLocaleTimeString()
                              : '-'}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-card-foreground">QR Code for Students</h3>
              <div className="flex flex-col items-center">
                {qrCodeUrl && (
                  <>
                    <img src={qrCodeUrl} alt="Attendance QR Code" className="border-4 border-border rounded-lg" />
                    <p className="text-sm text-foreground/70 mt-4 text-center">
                      Students scan this QR code to mark attendance
                    </p>
                    <p className="text-xs text-foreground/50 mt-2 break-all text-center px-4">
                      {process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/attend?sessionId={currentCourse.sessionId}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Semester End Modal */}
        {showSemesterModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-card-foreground">
                    Semester End Review - Students with &gt;6 Absences
                  </h2>
                  <button
                    onClick={() => setShowSemesterModal(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-foreground/60 mt-2">
                  {studentsWithAbsences.length} student{studentsWithAbsences.length !== 1 ? 's' : ''} found with more than 6 absences
                </p>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {studentsWithAbsences.length === 0 ? (
                  <p className="text-center text-foreground/60 py-8">All students processed!</p>
                ) : (
                  <div className="space-y-6">
                    {studentsWithAbsences.map((data) => (
                      <div key={data.student.id} className="bg-secondary/30 border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-card-foreground">
                              {data.student.name}
                            </h3>
                            <p className="text-sm text-foreground/60">ID: {data.student.id}</p>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                              Total Absences: {data.absentCount}
                            </p>
                          </div>
                          <button
                            onClick={() => handleApproveLeave(data.student.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                          >
                            Approve Leave (Convert 6 Absences)
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 px-2 text-foreground/70 font-medium">Date</th>
                                {data.dates.map((date: string) => (
                                  <th key={date} className="text-center py-2 px-2 text-foreground/70 font-medium whitespace-nowrap">
                                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="py-2 px-2 text-foreground font-medium">Status</td>
                                {data.dates.map((date: string) => {
                                  const isPresent = data.presentDays.includes(date);
                                  return (
                                    <td key={date} className="text-center py-2 px-2">
                                      {isPresent ? (
                                        <span className="inline-block w-4 h-4 bg-green-500 rounded-full" title="Present"></span>
                                      ) : (
                                        <span className="inline-block w-4 h-4 bg-red-500 rounded-full" title="Absent"></span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border">
                <button
                  onClick={() => setShowSemesterModal(false)}
                  className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View All Attendance Modal */}
        {showAllAttendanceModal && currentCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-lg shadow-xl max-w-[95vw] w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground">
                      Complete Attendance Record
                    </h2>
                    <p className="text-sm text-foreground/60 mt-1">
                      {currentCourse.courseName} ({currentCourse.courseId})
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAllAttendanceModal(false)}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                {(() => {
                  // Get all unique dates from all students
                  const allDates = new Set<string>();
                  currentCourse.students.forEach((student: Student) => {
                    Object.keys(student.attendance).forEach(date => allDates.add(date));
                  });
                  const sortedDates = Array.from(allDates).sort();

                  if (sortedDates.length === 0) {
                    return <p className="text-center text-foreground/60 py-8">No attendance records found.</p>;
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead className="sticky top-0 bg-card z-10">
                          <tr className="border-b-2 border-border">
                            <th className="text-left py-3 px-4 bg-secondary/50 text-foreground font-semibold sticky left-0 z-20 min-w-[200px]">
                              Student Name
                            </th>
                            <th className="text-left py-3 px-4 bg-secondary/50 text-foreground font-semibold min-w-[120px]">
                              Student ID
                            </th>
                            <th className="text-center py-3 px-4 bg-secondary/50 text-foreground font-semibold min-w-[100px]">
                              Total Present
                            </th>
                            <th className="text-center py-3 px-4 bg-secondary/50 text-foreground font-semibold min-w-[100px]">
                              Total Absent
                            </th>
                            {sortedDates.map(date => (
                              <th key={date} className="text-center py-3 px-3 bg-secondary/50 text-foreground/70 font-medium whitespace-nowrap min-w-[90px]">
                                {new Date(date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: '2-digit'
                                })}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentCourse.students.map((student: Student, index: number) => {
                            const presentCount = sortedDates.filter(date => 
                              student.attendance[date]?.attended
                            ).length;
                            const absentCount = sortedDates.length - presentCount;

                            return (
                              <tr 
                                key={student.id} 
                                className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                                  index % 2 === 0 ? 'bg-secondary/5' : ''
                                }`}
                              >
                                <td className="py-3 px-4 text-foreground font-medium sticky left-0 bg-card">
                                  {student.name}
                                </td>
                                <td className="py-3 px-4 text-foreground/80">
                                  {student.id}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center justify-center w-12 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-semibold">
                                    {presentCount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`inline-flex items-center justify-center w-12 h-8 rounded font-semibold ${
                                    absentCount > 6 
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                  }`}>
                                    {absentCount}
                                  </span>
                                </td>
                                {sortedDates.map(date => {
                                  const isPresent = student.attendance[date]?.attended;
                                  return (
                                    <td key={date} className="text-center py-3 px-3">
                                      {isPresent ? (
                                        <div className="flex justify-center" title={`Present on ${date}`}>
                                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div className="flex justify-center" title={`Absent on ${date}`}>
                                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>

              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="flex gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>Absent</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllAttendanceModal(false)}
                    className="bg-secondary text-secondary-foreground py-2 px-6 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

