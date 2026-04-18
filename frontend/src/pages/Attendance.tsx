import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { academicService, type Attendance } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import { ClipboardCheck, PieChart, Users, AlertCircle, Loader2 } from 'lucide-react';

const AttendancePage: FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      academicService.getAttendance(user.id)
        .then(data => setAttendance(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'PRESENT').count || attendance.filter(a => a.status === 'PRESENT').length;
  const percentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout title="Attendance Tracker">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                <div className="absolute -right-4 -top-4 opacity-10">
                    <PieChart className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                    <p className="text-blue-100 font-medium text-sm mb-1">Cumulative Attendance</p>
                    <div className="flex items-end space-x-2 mb-4">
                        <span className="text-5xl font-black">{percentage}%</span>
                        <span className="text-blue-200 text-sm mb-2 font-bold">Total: {totalClasses} Classes</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 mb-2 backdrop-blur-sm">
                        <div className="bg-emerald-400 h-3 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <p className="text-xs text-blue-100 italic opacity-80">* Minimum 75% required for exam eligibility</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4">
                    <ClipboardCheck className="w-5 h-5" />
                </div>
                <p className="text-slate-500 font-medium text-sm mb-1">Present</p>
                <p className="text-3xl font-bold text-slate-800">{presentCount}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg w-fit mb-4">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-slate-500 font-medium text-sm mb-1">Absent</p>
                <p className="text-3xl font-bold text-slate-800">{totalClasses - presentCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Recent Attendance Logs</h3>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] text-slate-500 font-bold">PRESENT</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-[10px] text-slate-500 font-bold">ABSENT</span>
                </div>
              </div>
            </div>
            <div className="p-0">
                {attendance.length > 0 ? (
                    <div className="grid grid-cols-1 divide-y divide-slate-50">
                        {attendance.map((record) => (
                            <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1.5 h-10 rounded-full bg-slate-200"></div>
                                    <div>
                                        <p className="font-bold text-slate-800">{record.subject.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(record.date).toLocaleDateString()} • {record.subject.code}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest ${
                                    record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {record.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center opacity-40">
                        <Users className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-slate-500">No attendance records found.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AttendancePage;
