import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Placeholders for Pages
import Login from './pages/Login.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import FacultyDashboard from './pages/FacultyDashboard.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import CATMarks from './pages/CATMarks.tsx';
import LABMarks from './pages/LABMarks.tsx';
import AssignmentMarks from './pages/AssignmentMarks.tsx';
import AttendancePage from './pages/Attendance.tsx';
import TimetablePage from './pages/Timetable.tsx';
import FeesPage from './pages/Fees.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route path="/faculty/*" element={<FacultyDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/marks/cat" element={<CATMarks />} />
            <Route path="/marks/lab" element={<LABMarks />} />
            <Route path="/marks/assignment" element={<AssignmentMarks />} />
            <Route path="/fee/academic" element={<FeesPage />} />
            <Route path="/fee/exam" element={<FeesPage />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
