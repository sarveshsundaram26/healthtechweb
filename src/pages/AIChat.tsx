import DashboardLayout from '../components/DashboardLayout';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIChat() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="text-center animate-fade-in-up">
           <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-500/30 mb-6 shadow-2xl">
              <MessageSquare className="h-10 w-10 text-indigo-400" />
           </div>
           <h1 className="text-5xl font-black text-white tracking-tight mb-4">
             AI Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">Companion</span>
           </h1>
           <p className="text-slate-400 text-lg flex items-center justify-center font-medium">
             <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
             {t('ai_companion_msg')}
           </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-2 shadow-2xl overflow-hidden min-h-[600px] flex flex-col animate-fade-in-up" style={{ animationDelay: '100ms' }}>
           <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}
