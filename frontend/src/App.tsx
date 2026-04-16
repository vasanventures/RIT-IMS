import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// Placeholders for Pages
import Login from './pages/Login.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import FacultyDashboard from './pages/FacultyDashboard.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';

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
            <Route path="/student/*" element={<StudentDashboard />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
