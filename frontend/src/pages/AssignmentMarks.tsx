import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import { academicService, type Mark } from '../services/academicService.ts';
import { useAuth } from '../context/useAuth.ts';
import { PenTool, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AssignmentMarks: FC = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      academicService.getMarks(user.id)
        .then(data => setMarks(data.filter(m => m.examType === 'ASSIGNMENT')))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <DashboardLayout title="Assignment Marks">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Assignments Submitted</p>
                <p className="text-2xl font-bold text-slate-800">{marks.length}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completed Status</p>
                <p className="text-2xl font-bold text-slate-800">100%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marks.length > 0 ? marks.map((mark) => (
              <div key={mark.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{mark.subject.code}</p>
                        <h4 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{mark.subject.name}</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-slate-800">{mark.score}</p>
                        <p className="text-[10px] text-slate-400 font-bold">/ 20</p>
                    </div>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${(mark.score/20)*100}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                    <p className="text-emerald-600">STRICT DEADLINE</p>
                    <p className="text-slate-400">PASSED</p>
                </div>
              </div>
            )) : (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center opacity-50">
                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="text-slate-500">No assignment scores recorded.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignmentMarks;
