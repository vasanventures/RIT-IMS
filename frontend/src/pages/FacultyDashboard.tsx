import { type FC } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { Calendar, ClipboardCheck, GraduationCap, AlertTriangle } from 'lucide-react';
import Materials from '../components/Materials.tsx';

const FacultyDashboard: FC = () => {
  return (
    <DashboardLayout title="Faculty Portal">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                Today's Schedule
              </h3>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Full Timetable</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex-shrink-0 w-24 text-center border-r border-slate-200 pr-4">
                  <p className="text-sm font-bold text-slate-800">10:30 AM</p>
                  <p className="text-xs text-slate-500">11:30 AM</p>
                </div>
                <div className="flex-1 pl-4">
                  <h4 className="font-bold text-slate-800">Software Engineering</h4>
                  <p className="text-sm text-slate-500">Room 304 • Semester 6</p>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Mark Attendance</button>
                </div>
              </div>
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100 opacity-60">
                <div className="flex-shrink-0 w-24 text-center border-r border-slate-200 pr-4">
                  <p className="text-sm font-bold text-slate-800">01:00 PM</p>
                  <p className="text-xs text-slate-500">03:00 PM</p>
                </div>
                <div className="flex-1 pl-4">
                  <h4 className="font-bold text-slate-800">Web Technology Lab</h4>
                  <p className="text-sm text-slate-500">Lab 2 • Semester 6</p>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition whitespace-nowrap">View Class</button>
                </div>
              </div>
            </div>
          </div>

          <Materials subjectId={1} isFaculty={true} />
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden">
            <ClipboardCheck className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <h3 className="text-lg font-bold mb-2">Mark Attendance</h3>
            <p className="text-indigo-100 text-sm">Select a subject to mark today's attendance for your assigned students.</p>
          </div>

          <div className="bg-rose-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden">
            <AlertTriangle className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <h3 className="text-lg font-bold mb-2">Attendance Alerts</h3>
            <p className="text-rose-100 text-sm">View students with attendance below 75% across your subjects.</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden">
            <GraduationCap className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <h3 className="text-lg font-bold mb-2">Upload Marks</h3>
            <p className="text-emerald-100 text-sm">Enter internal, mid-term, or final exam marks for your classes.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
