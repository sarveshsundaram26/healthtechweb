import { Activity } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center animate-pulse">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="h-10 w-10 text-white animate-spin-slow" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white tracking-wide">Loading Portal...</h2>
        <p className="text-slate-400 mt-2 text-sm">Please wait while we secure your session.</p>
      </div>
    </div>
  );
}
