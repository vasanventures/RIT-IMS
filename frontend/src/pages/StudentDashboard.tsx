import { type FC } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { CalendarDays, BookCheck, LineChart } from 'lucide-react';
import Materials from '../components/Materials.tsx';

const StudentDashboard: FC = () => {
  return (
    <DashboardLayout title="My Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="absolute -right-4 -top-4 opacity-20">
            <BookCheck className="w-32 h-32" />
          </div>
          <h3 className="text-indigo-100 font-medium mb-1">Overall Attendance</h3>
          <p className="text-4xl font-extrabold mb-4">84.5%</p>
          <div className="w-full bg-indigo-900/40 rounded-full h-2">
            <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '84.5%' }}></div>
          </div>
          <p className="text-sm text-indigo-100 mt-2">Required: 75% • Safe Status</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <CalendarDays className="w-6 h-6" />
             </div>
           </div>
           <h3 className="text-slate-500 font-medium text-sm mb-1">Next Class</h3>
           <p className="text-xl font-bold text-slate-800 mb-1">Software Engineering</p>
           <p className="text-sm text-slate-500">Room 304 • 10:30 AM</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <LineChart className="w-6 h-6" />
             </div>
           </div>
           <h3 className="text-slate-500 font-medium text-sm mb-1">Last Exam Performace</h3>
           <p className="text-xl font-bold text-slate-800 mb-1">DBMS Mid-Term</p>
           <p className="text-sm font-medium text-emerald-600">Score: 88/100</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <Materials subjectId={1} isFaculty={false} />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
