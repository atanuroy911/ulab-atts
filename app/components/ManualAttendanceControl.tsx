'use client';

import { useState } from 'react';
import { Student } from '@/lib/types';

interface ManualAttendanceControlProps {
  students: Student[];
  currentDate: string;
  onToggleAttendance: (studentId: string, attended: boolean) => void;
}

export default function ManualAttendanceControl({
  students,
  currentDate,
  onToggleAttendance,
}: ManualAttendanceControlProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (student) =>
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4 text-card-foreground">
        Manual Attendance Control
      </h3>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {searchTerm && (
          <p className="text-sm text-foreground/60 mt-2">
            Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Student List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <p className="text-center text-foreground/60 py-8">
            {searchTerm ? 'No students found' : 'No students available'}
          </p>
        ) : (
          filteredStudents.map((student) => {
            const attended = student.attendance?.[currentDate]?.attended || false;
            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">{student.name}</p>
                  <p className="text-sm text-foreground/60">{student.id}</p>
                </div>
                <button
                  onClick={() => onToggleAttendance(student.id, !attended)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    attended
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                  }`}
                >
                  {attended ? 'Present' : 'Absent'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      {filteredStudents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Present:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {filteredStudents.filter((s) => s.attendance?.[currentDate]?.attended).length}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-foreground/60">Absent:</span>
            <span className="font-semibold text-red-600 dark:text-red-400">
              {filteredStudents.filter((s) => !s.attendance?.[currentDate]?.attended).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
