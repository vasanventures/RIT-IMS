import { type FC } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { Users, LibraryBig, CalendarSync, AlertCircle } from 'lucide-react';

const AdminDashboard: FC = () => {
  const stats = [
    { title: 'Total Students', value: '1,250', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Faculty', value: '124', icon: LibraryBig, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Subjects', value: '45', icon: CalendarSync, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Pending Issues', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <DashboardLayout title="Admin Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 flex items-center hover:-translate-y-1 transition-transform cursor-default">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-bold text-slate-800">Recent System Activity</h4>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">View All</button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center text-sm border-b border-slate-100 pb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
            <p className="flex-1 text-slate-700">New Faculty <span className="font-semibold">Dr. A. Sharma</span> joined CS Dept</p>
            <span className="text-slate-400">2 hrs ago</span>
          </div>
          <div className="flex items-center text-sm border-b border-slate-100 pb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            <p className="flex-1 text-slate-700">Timetable generated for Semester 6</p>
            <span className="text-slate-400">5 hrs ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-rose-500 mr-3"></div>
            <p className="flex-1 text-slate-700">Database backup successfully completed</p>
            <span className="text-slate-400">1 day ago</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
