import { type FC, useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.tsx';
import api from '../services/api.ts';
import { useAuth } from '../context/useAuth.ts';
import { CreditCard, Receipt, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface Fee {
  id: number;
  type: 'ACADEMIC' | 'EXAM';
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  dueDate: string;
}

const FeesPage: FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        api.get<Fee[]>(`/fees/${user.id}`)
          .then(res => setFees(res.data))
          .finally(() => setLoading(false));
    }
  }, [user]);

  const totalPending = fees.filter(f => f.status !== 'PAID').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DashboardLayout title="Accounts & Fees">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs mb-3">Total Outstanding Balance</p>
                    <h3 className="text-6xl font-black mb-4">₹{totalPending.toLocaleString()}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                            <AlertCircle className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-medium">Next Due: 15 May 2026</span>
                        </div>
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 group">
                    Quick Pay <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fees.map((fee) => (
              <div key={fee.id} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl ${fee.type === 'ACADEMIC' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                        {fee.type === 'ACADEMIC' ? <CreditCard className="w-8 h-8" /> : <Receipt className="w-8 h-8" />}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        fee.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                        {fee.status}
                    </span>
                </div>
                <div className="mb-6">
                    <h4 className="text-xl font-bold text-slate-800">{fee.type} FEE</h4>
                    <p className="text-sm text-slate-400 font-medium">Due by: {new Date(fee.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <p className="text-2xl font-black text-slate-800">₹{fee.amount.toLocaleString()}</p>
                    {fee.status === 'PAID' ? (
                        <div className="flex items-center text-emerald-600 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 mr-1" /> Receipt Ready
                        </div>
                    ) : (
                        <button className="text-blue-600 font-black text-sm uppercase tracking-tighter hover:underline">Pay Fees</button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FeesPage;
