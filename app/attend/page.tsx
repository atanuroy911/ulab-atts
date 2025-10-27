'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';

function AttendanceForm() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [studentId, setStudentId] = useState('');
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (sessionId) {
      // Fetch course info
      fetch(`/api/attend?sessionId=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setCourseInfo(data);
          }
        })
        .catch(() => {
          setError('Failed to load course information');
        });
    }
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId || !studentId) {
      setError('Please enter your student ID');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/attend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          studentId: studentId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark attendance');
      }

      setSuccess(`Attendance marked successfully! Welcome, ${data.student.name}`);
      setStudentId('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="bg-card border border-border p-8 rounded-lg shadow-sm max-w-md w-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Invalid Session</h1>
              <p className="text-foreground/70">
                No session ID found. Please scan a valid QR code.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border border-border p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Mark Attendance</h1>
            {courseInfo && (
              <div className="text-sm text-foreground/70 space-y-1">
                <p className="font-semibold text-lg text-card-foreground">{courseInfo.courseName}</p>
                <p>
                  {courseInfo.courseId} - {courseInfo.semester} - Section {courseInfo.section}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-center font-semibold">{success}</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full p-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg"
                  placeholder="Enter your student ID"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !studentId}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors text-lg"
              >
                {loading ? 'Marking Attendance...' : 'Mark Attendance'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-foreground/60">
            <p>Make sure you enter your correct student ID</p>
          </div>
        </div>
      </div>
      </>
    );
}

export default function AttendPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-foreground/60">Loading...</div>
        </div>
      </>
    }>
      <AttendanceForm />
    </Suspense>
  );
}
