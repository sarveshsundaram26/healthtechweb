import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import DashboardLayout from '../components/DashboardLayout';
import VitalsForm from '../components/VitalsForm';
import VitalsChart from '../components/VitalsChart';
import SymptomChecker from '../components/SymptomChecker';
import { Sparkles, Calendar, Activity, Loader2, Heart, Droplet, Weight, Clock } from 'lucide-react';
import type { Database } from '../types/supabase';

type Vital = Database['public']['Tables']['vitals']['Row'];

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVital, setSelectedVital] = useState<'all' | 'heart_rate' | 'blood_pressure' | 'weight'>('all');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const fetchVitals = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVitals(data || []);
    } catch (err) {
      console.error('Error fetching vitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
             <h1 className="text-4xl font-black text-white tracking-tight">
               {t('welcome_back') || 'Welcome back,'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">{user?.email?.split('@')[0]}</span>
             </h1>
             <p className="mt-2 text-slate-400 flex items-center font-medium">
               <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
               {t('health_stable_msg') || 'Your health metrics are looking stable today.'}
             </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/10 flex items-center text-slate-300 shadow-xl">
             <Calendar className="h-4 w-4 mr-2 text-blue-400" />
             <span className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Vitals Summary Cards */}
        {vitals.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedVital('heart_rate')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedVital === 'heart_rate'
                  ? 'bg-rose-500/20 border-rose-500/50 shadow-lg shadow-rose-500/20'
                  : 'bg-white/5 border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  selectedVital === 'heart_rate' ? 'bg-rose-500/30' : 'bg-rose-500/20'
                }`}>
                  <Heart className="h-5 w-5 text-rose-400" />
                </div>
                {selectedVital === 'heart_rate' && (
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Heart Rate</p>
              <p className="text-2xl font-bold text-white">{vitals[0]?.heart_rate || '--'}</p>
              <p className="text-xs text-slate-400 mt-1">bpm</p>
            </button>

            <button
              onClick={() => setSelectedVital('blood_pressure')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedVital === 'blood_pressure'
                  ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  selectedVital === 'blood_pressure' ? 'bg-blue-500/30' : 'bg-blue-500/20'
                }`}>
                  <Droplet className="h-5 w-5 text-blue-400" />
                </div>
                {selectedVital === 'blood_pressure' && (
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Blood Pressure</p>
              <p className="text-2xl font-bold text-white">
                {vitals[0]?.systolic_bp && vitals[0]?.diastolic_bp 
                  ? `${vitals[0].systolic_bp}/${vitals[0].diastolic_bp}` 
                  : '--'}
              </p>
              <p className="text-xs text-slate-400 mt-1">mmHg</p>
            </button>

            <button
              onClick={() => setSelectedVital('weight')}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedVital === 'weight'
                  ? 'bg-teal-500/20 border-teal-500/50 shadow-lg shadow-teal-500/20'
                  : 'bg-white/5 border-white/10 hover:border-teal-500/30 hover:bg-teal-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  selectedVital === 'weight' ? 'bg-teal-500/30' : 'bg-teal-500/20'
                }`}>
                  <Weight className="h-5 w-5 text-teal-400" />
                </div>
                {selectedVital === 'weight' && (
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                )}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Weight</p>
              <p className="text-2xl font-bold text-white">{vitals[0]?.weight || '--'}</p>
              <p className="text-xs text-slate-400 mt-1">lbs</p>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
           {/* Chart Section */}
           {vitals.length >= 2 && (
             <div className="lg:col-span-2 group">
                <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 shadow-2xl transition-all duration-300 group-hover:border-blue-500/20">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold text-white flex items-center">
                       <Activity className="h-5 w-5 mr-3 text-blue-400" />
                       {t('vitals_history')}
                       {selectedVital !== 'all' && (
                         <span className="ml-3 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest rounded-full border border-blue-500/30">
                           {selectedVital.replace('_', ' ')}
                         </span>
                       )}
                     </h3>
                     <div className="flex gap-4 items-center">
                       {(selectedVital !== 'all' || selectedRecordId) && (
                         <button
                           onClick={() => { setSelectedVital('all'); setSelectedRecordId(null); }}
                           className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:border-white/20"
                         >
                           Show All
                         </button>
                       )}
                       <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Insights</span>
                       </div>
                     </div>
                   </div>
                   {loading ? (
                     <div className="h-80 flex items-center justify-center bg-white/5 rounded-3xl animate-pulse">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500 opacity-50" />
                     </div>
                   ) : (
                     <div className="h-80 w-full">
                       <VitalsChart data={vitals} selectedVital={selectedVital} selectedRecordId={selectedRecordId} />
                     </div>
                   )}
                </div>
             </div>
           )}

           {/* Vitals History List */}
           {vitals.length > 0 && (
             <div className="lg:col-span-1">
               <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-6 shadow-2xl max-h-[500px] overflow-y-auto">
                 <div className="flex items-center gap-3 mb-6">
                   <Clock className="h-5 w-5 text-blue-400" />
                   <h3 className="text-lg font-bold text-white">Vitals History</h3>
                 </div>
                 <div className="space-y-3">
                   {vitals.map((vital) => (
                     <button
                       key={vital.id}
                       onClick={() => setSelectedRecordId(vital.id === selectedRecordId ? null : vital.id)}
                       className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                         selectedRecordId === vital.id
                           ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                           : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10'
                       }`}
                     >
                       <div className="flex items-center justify-between mb-2">
                         <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                           {new Date(vital.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                         </p>
                         <p className="text-xs text-slate-500">
                           {new Date(vital.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                         </p>
                       </div>
                       <div className="grid grid-cols-2 gap-2 text-xs">
                         {vital.heart_rate && (
                           <div>
                             <span className="text-slate-500">HR:</span>
                             <span className="ml-1 text-white font-bold">{vital.heart_rate}</span>
                             <span className="ml-1 text-slate-500">bpm</span>
                           </div>
                         )}
                         {vital.systolic_bp && vital.diastolic_bp && (
                           <div>
                             <span className="text-slate-500">BP:</span>
                             <span className="ml-1 text-white font-bold">{vital.systolic_bp}/{vital.diastolic_bp}</span>
                           </div>
                         )}
                         {vital.weight && (
                           <div>
                             <span className="text-slate-500">Weight:</span>
                             <span className="ml-1 text-white font-bold">{vital.weight}</span>
                             <span className="ml-1 text-slate-500">lbs</span>
                           </div>
                         )}
                       </div>
                       {selectedRecordId === vital.id && (
                         <div className="mt-2 pt-2 border-t border-white/10">
                           <p className="text-xs text-blue-400 font-bold">● Viewing on graph</p>
                         </div>
                       )}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
           )}

           {/* Input Form Section */}
           <div className="lg:col-span-2">
              <div className="h-full bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group transition-all duration-300 hover:border-teal-500/20">
                 <div className="flex items-center mb-6">
                    <div className="h-10 w-10 bg-teal-500/20 rounded-xl flex items-center justify-center mr-4 border border-teal-500/30">
                       <Activity className="h-6 w-6 text-teal-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{t('record_vitals')}</h3>
                 </div>
                 <VitalsForm onSuccess={fetchVitals} />
              </div>
           </div>

           {/* AI Symptom Checker Section */}
           <div className="lg:col-span-1">
              <div className="h-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-indigo-500/20">
                 <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/10 blur-3xl group-hover:bg-indigo-600/20 transition-all" />
                 <div className="flex items-center mb-6">
                    <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-4 border border-indigo-500/30">
                       <Sparkles className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{t('ai_diagnostic_assistant') || 'AI Diagnostic Assistant'}</h3>
                 </div>
                 <SymptomChecker />
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
