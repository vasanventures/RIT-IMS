import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { academicService, type TimetableEntry } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';

const TimetablePage: FC = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    if (user?.id) {
        // Mocking department and semester for now (should come from student profile)
        academicService.getTimetable('CS', 6)
          .then(data => setTimetable(data))
          .finally(() => setLoading(false));
    }
  }, [user]);

  const getSlot = (day: string, period: number) => {
    return timetable.find(t => t.dayOfWeek === day && t.period === period);
  };

  return (
    <DashboardLayout title="Academic Timetable">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-6 font-black text-xs uppercase tracking-widest border-r border-slate-800">Day / Period</th>
                  {periods.map(p => (
                    <th key={p} className="px-6 py-6 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Period</p>
                        <p className="text-xl font-black">{p}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {days.map(day => (
                  <tr key={day} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-8 bg-slate-50 border-r border-slate-100">
                        <span className="text-sm font-black text-slate-800 tracking-tight">{day}</span>
                    </td>
                    {periods.map(period => {
                      const slot = getSlot(day, period);
                      return (
                        <td key={period} className="px-4 py-4 min-w-[180px]">
                          {slot ? (
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 group hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <p className="text-xs font-black mb-1 group-hover:text-blue-100">{slot.subject.code}</p>
                                <h4 className="text-sm font-bold leading-tight mb-3 h-8 overflow-hidden">{slot.subject.name}</h4>
                                <div className="space-y-1 opacity-70">
                                    <div className="flex items-center text-[10px] font-bold">
                                        <User className="w-3 h-3 mr-1" />
                                        <span>{slot.faculty.user.name}</span>
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        <span>ROOM 304</span>
                                    </div>
                                </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-4 border border-dashed border-slate-100 rounded-2xl opacity-20">
                                <Clock className="w-5 h-5" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TimetablePage;
