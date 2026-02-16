import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Feed from './pages/Feed';
import MomentDetail from './pages/MomentDetail';
import NewMoment from './pages/NewMoment';
import Messages from './pages/Messages';
import ConversationView from './pages/ConversationView';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import NewEvent from './pages/NewEvent';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Connections from './pages/Connections';
import Settings from './pages/Settings';
import MemorialSettings from './pages/MemorialSettings';
import Memorial from './pages/Memorial';
import Safety from './pages/Safety';
import Verify from './pages/Verify';
import Admin from './pages/Admin';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-brand-muted">Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-brand-muted">Loading...</p></div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/feed" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/feed" replace /> : <Login />} />
      <Route path="/join" element={user ? <Navigate to="/feed" replace /> : <Register />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/new" element={<NewMoment />} />
        <Route path="/feed/:id" element={<MomentDetail />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:id" element={<ConversationView />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/profile/:id/memorial" element={<Memorial />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/memorial" element={<MemorialSettings />} />
        <Route path="/settings/safety" element={<Safety />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
