import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { academicService, type Mark } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import { FileCheck, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const CATMarks: FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      academicService.getMarks(user.id)
        .then(data => setMarks(data.filter(m => m.examType === 'CAT')))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const average = marks.length > 0 
    ? (marks.reduce((acc, curr) => acc + curr.score, 0) / marks.length).toFixed(1)
    : 0;

  return (
    <DashboardLayout title="CAT Marks (Continuous Assessment Tests)">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-800">{marks.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-slate-800">{average}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Results Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Subject Code</th>
                    <th className="px-6 py-4">Subject Name</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {marks.length > 0 ? marks.map((mark) => (
                    <tr key={mark.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">{mark.subject.code}</td>
                      <td className="px-6 py-4 text-slate-800 font-medium">{mark.subject.name}</td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-slate-800">{mark.score}</span>
                        <span className="text-slate-400 text-xs"> / 100</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                          mark.score >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {mark.score >= 50 ? 'Qualify' : 'Below Avg'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center opacity-40">
                          <AlertCircle className="w-12 h-12 mb-2" />
                          <p className="text-slate-500">No CAT marks found for this semester.</p>
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

export default CATMarks;
