import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import ToastProvider from './components/Toast.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreatePoll from './pages/CreatePoll.jsx';
import PollDetail from './pages/PollDetail.jsx';
import Results from './pages/Results.jsx';

// Redirects authenticated users away from auth pages
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {/* Background decorative blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
            <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          </div>

          <Navbar />

          <main className="relative z-10 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/"        element={<Navigate to="/dashboard" replace />} />
              <Route path="/login"   element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard"   element={<Dashboard />} />
                <Route path="/polls/new"   element={<CreatePoll />} />
                <Route path="/polls/:id"   element={<PollDetail />} />
                <Route path="/polls/:id/results" element={<Results />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
