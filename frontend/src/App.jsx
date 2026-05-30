import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './redux/slices/authSlice';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import CodingPractice from './pages/CodingPractice';
import AptitudeTests from './pages/AptitudeTests';
import CareerAdvisor from './pages/CareerAdvisor';
import JobRecommendations from './pages/JobRecommendations';
import CompanyPrep from './pages/CompanyPrep';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import ChatbotPage from './pages/ChatbotPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Layout
import DashboardLayout from './components/common/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useSelector(s => s.auth);
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected - Dashboard Layout */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="interview" element={<MockInterview />} />
          <Route path="coding" element={<CodingPractice />} />
          <Route path="aptitude" element={<AptitudeTests />} />
          <Route path="career" element={<CareerAdvisor />} />
          <Route path="jobs" element={<JobRecommendations />} />
          <Route path="companies" element={<CompanyPrep />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
