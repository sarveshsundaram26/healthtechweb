import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/PatientDashboard';
import Emergency from './pages/Emergency';
import Reminders from './pages/Reminders';
import AIChat from './pages/AIChat';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
             <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
               <Route path="/" element={<LandingPage />} />

               <Route element={<ProtectedRoute />}>
                 <Route path="/dashboard/patient" element={<PatientDashboard />} />
                 <Route path="/emergency" element={<Emergency />} />
                 <Route path="/reminders" element={<Reminders />} />
                 <Route path="/chat" element={<AIChat />} />
                 <Route path="/profile" element={<Profile />} />
               </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <SpeedInsights />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App
