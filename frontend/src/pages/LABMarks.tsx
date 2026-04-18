import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { academicService, type Mark } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import { FlaskConical, Beaker, AlertCircle, Loader2 } from 'lucide-react';

const LABMarks: FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      academicService.getMarks(user.id)
        .then(data => setMarks(data.filter(m => m.examType === 'LAB')))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const average = marks.length > 0 
    ? (marks.reduce((acc, curr) => acc + curr.score, 0) / marks.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout title="LAB Marks (Practical Assessments)">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Labs Completed</p>
                <p className="text-2xl font-bold text-slate-800">{marks.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Avg Performance</p>
                <p className="text-2xl font-bold text-slate-800">{((Number(average)/50)*100).toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Laboratory Records</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Marks Obtained</th>
                    <th className="px-6 py-4">Max Marks</th>
                    <th className="px-6 py-4">Weightage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {marks.length > 0 ? marks.map((mark) => (
                    <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-slate-800 font-bold">{mark.subject.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{mark.subject.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-extrabold text-purple-600">{mark.score}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">50</td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px]">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(mark.score/50)*100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center opacity-40">
                          <AlertCircle className="w-12 h-12 mb-2" />
                          <p className="text-slate-500">No Lab assessment records found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LABMarks;
