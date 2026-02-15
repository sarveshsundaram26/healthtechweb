import DashboardLayout from '../components/DashboardLayout';
import SOSButton from '../components/SOSButton';
import EmergencyContacts from '../components/EmergencyContacts';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Emergency() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="animate-fade-in-up">
             <h1 className="text-4xl font-black text-white tracking-tight flex items-center">
               <ShieldAlert className="h-10 w-10 text-red-500 mr-4" />
               {t('emergency_center')}
             </h1>
             <p className="mt-3 text-slate-400 font-medium">
               {t('critical_safety_tools')}
             </p>
          </div>
          <div className="bg-red-500/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-red-500/20 flex items-center text-red-400 shadow-2xl animate-pulse">
             <AlertCircle className="h-5 w-5 mr-3" />
             <span className="text-sm font-black uppercase tracking-widest">{t('active_monitoring')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
           {/* SOS Button Section - Prominent */}
           <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="h-full bg-red-950/10 backdrop-blur-md border border-red-500/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-red-500/30">
                 <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-all" />
                 <SOSButton />
              </div>
           </div>

           {/* Contacts Section */}
           <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="h-full bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl transition-all duration-300 hover:border-blue-500/20">
                 <EmergencyContacts />
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
