import { type FC } from 'react';
import { useAuth } from '../context/useAuth.ts';
import { LogOut, LayoutDashboard, Users, BookOpen, Calendar, Bell } from 'lucide-react';
import Chatbot from './Chatbot.tsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const base = [{ icon: LayoutDashboard, label: 'Dashboard', path: '/' }];
    if (user?.role === 'ADMIN') {
      return [...base, { icon: Users, label: 'Manage Users' }, { icon: BookOpen, label: 'Subjects' }];
    }
    if (user?.role === 'FACULTY') {
      return [...base, { icon: Calendar, label: 'Timetable' }, { icon: BookOpen, label: 'Attendance & Marks' }];
    }
    return [...base, { icon: Calendar, label: 'Timetable' }, { icon: Bell, label: 'Notifications' }];
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col transition-all shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">IMS.</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user?.role} Portal</p>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {getMenuItems().map((item, idx) => (
            <button key={idx} className="flex flex-row items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all text-slate-300 hover:text-white hover:bg-slate-800 group">
              <item.icon className="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default DashboardLayout;
