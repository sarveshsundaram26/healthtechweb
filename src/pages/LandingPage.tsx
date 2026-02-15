import { Link, useNavigate } from 'react-router-dom';
import { Activity, Sparkles, Heart, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
  const { session, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && role) {
      navigate('/dashboard/patient');
    }
  }, [session, role, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-3xl animate-float" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-teal-600/20 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-2xl animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">
            HealthMonitor
          </h1>
          <p className="text-xl text-blue-200 mb-2">
            Your Intelligent Wellness Companion
          </p>
          <p className="text-sm text-blue-300/60">
            Track vitals • AI Health Assistant • Medicine Reminders • Emergency SOS
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 shadow-2xl">
          <div className="absolute top-6 right-6 opacity-30">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="text-center">
              <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <Heart className="h-7 w-7 text-blue-400" />
              </div>
              <p className="text-white/80 text-sm font-semibold">Vitals Tracking</p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-500/30">
                <Zap className="h-7 w-7 text-teal-400" />
              </div>
              <p className="text-white/80 text-sm font-semibold">AI Assistant</p>
            </div>
            <div className="text-center">
              <div className="h-14 w-14 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-red-500/30">
                <Shield className="h-7 w-7 text-red-400" />
              </div>
              <p className="text-white/80 text-sm font-semibold">Emergency SOS</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95"
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center py-4 px-6 border border-white/20 rounded-2xl shadow-lg text-base font-bold text-white bg-white/5 hover:bg-white/10 focus:outline-none transition-all active:scale-95"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-white/30 text-sm">
          Powered by Secure AI Technology • Privacy First
        </div>
      </div>
    </div>
  );
}
