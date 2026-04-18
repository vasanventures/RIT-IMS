import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { CalendarDays, BookCheck, LineChart, Loader2 } from 'lucide-react';
import { academicService, type Attendance, type Mark, type TimetableEntry } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import Materials from '../components/Materials.tsx';

const StudentDashboard: FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        Promise.all([
            academicService.getAttendance(user.id),
            academicService.getMarks(user.id),
            academicService.getTimetable('CS', 6) // Mocked dept/sem
        ]).then(([attData, markData, ttData]) => {
            setAttendance(attData);
            setMarks(markData);
            setTimetable(ttData);
        }).finally(() => setLoading(false));
    }
  }, [user]);

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : "0.0";
  
  const lastMark = marks.length > 0 ? marks[marks.length - 1] : null;
  const nextClass = timetable.length > 0 ? timetable[0] : null;

  return (
    <DashboardLayout title="My Dashboard">
      {loading ? (
        <div className="flex items-center justify-center h-64">
           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-20">
                <BookCheck className="w-32 h-32" />
              </div>
              <h3 className="text-indigo-100 font-medium mb-1">Overall Attendance</h3>
              <p className="text-4xl font-extrabold mb-4">{attendancePercentage}%</p>
              <div className="w-full bg-indigo-900/40 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${attendancePercentage}%` }}></div>
              </div>
              <p className="text-sm text-indigo-100 mt-2">Required: 75% • {Number(attendancePercentage) >= 75 ? 'Safe Status' : 'At Risk'}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                   <CalendarDays className="w-6 h-6" />
                 </div>
               </div>
               <h3 className="text-slate-500 font-medium text-sm mb-1">Next Class</h3>
               <p className="text-xl font-bold text-slate-800 mb-1">{nextClass?.subject.name || 'No Class Scheduled'}</p>
               <p className="text-sm text-slate-500">Room 304 • Period {nextClass?.period || 'N/A'}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                   <LineChart className="w-6 h-6" />
                 </div>
               </div>
               <h3 className="text-slate-500 font-medium text-sm mb-1">Last Exam Performance</h3>
               <p className="text-xl font-bold text-slate-800 mb-1">{lastMark?.subject.name || 'No Exams Yet'}</p>
               <p className="text-sm font-medium text-emerald-600">Score: {lastMark?.score || 0}{lastMark?.examType === 'ASSIGNMENT' ? '/20' : lastMark?.examType === 'LAB' ? '/50' : '/100'}</p>
            </div>
          </div>

          <div className="max-w-4xl">
            <Materials subjectId={1} isFaculty={false} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
