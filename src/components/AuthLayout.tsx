import React from 'react';
import { Activity } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl animate-float" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-emerald-600/30 to-teal-600/30 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight text-center">
            {title}
          </h2>
          <div className="mt-2 text-center text-blue-200 text-sm">
            {subtitle}
          </div>
        </div>
        
        {children}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-4 text-white/20 text-xs">
        © 2026 HealthTech Portal
      </div>
    </div>
  );
}
