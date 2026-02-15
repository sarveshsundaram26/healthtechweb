import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, Scale, Save, AlertCircle, TrendingUp, History, Info, ChevronRight, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface VitalsFormProps {
  onSuccess: () => void;
}

interface VitalRecord {
  id: string;
  heart_rate: number | null;
  systolic_bp: number | null;
  diastolic_bp: number | null;
  weight: number | null;
  created_at: string;
}

const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "number", step = "1", id }: any) => (
  <div className="relative group">
     <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
       {label}
     </label>
     <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        <input
          id={id}
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          placeholder={placeholder}
        />
     </div>
  </div>
);

export default function VitalsForm({ onSuccess }: VitalsFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [heartRate, setHeartRate] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VitalRecord[]>([]);
  const [analysis, setAnalysis] = useState<{ status: string; color: string; advice: string } | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setFetchingHistory(true);
    try {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err: any) {
      console.error('[Vitals] History fetch error:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const generateAnalysis = () => {
    if (!heartRate && !systolic && !diastolic && !weight) {
      setError('Please enter at least one value to analyze.');
      return;
    }

    let status = "Normal";
    let color = "text-emerald-400";
    let advice = "Your vitals look stable. Maintain your current diet and exercise routine.";

    const hr = heartRate ? parseInt(heartRate) : null;
    const sys = systolic ? parseInt(systolic) : null;
    const dia = diastolic ? parseInt(diastolic) : null;

    if (sys && sys >= 140 || (dia && dia >= 90)) {
      status = "Hypertension Stage 2";
      color = "text-red-400";
      advice = "Your blood pressure is high. Avoid salt, stay hydrated, and consult your doctor as soon as possible.";
    } else if (sys && sys >= 130 || (dia && dia >= 80)) {
      status = "Hypertension Stage 1";
      color = "text-orange-400";
      advice = "Blood pressure is slightly elevated. Reduce salt intake and increase physical activity.";
    } else if (hr && (hr > 100 || hr < 60)) {
      status = "Irregular Heart Rate";
      color = "text-amber-400";
      advice = "Your resting heart rate is outside the normal range (60-100 bpm). Try to relax and re-measure in 15 minutes.";
    }

    setAnalysis({ status, color, advice });
    setError(null);
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vital record?')) return;
    try {
      const { error } = await supabase
        .from('vitals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setHistory(history.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('[Vitals] Delete error:', err);
      alert('Failed to delete record.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    setError(null);

    if (!heartRate && !systolic && !diastolic && !weight) {
      setError('Cannot save empty record. Please enter at least one vital metric.');
      setLoading(false);
      return;
    }

    const dataToInsert = {
      user_id: user.id,
      heart_rate: heartRate ? parseInt(heartRate) : null,
      systolic_bp: systolic ? parseInt(systolic) : null,
      diastolic_bp: diastolic ? parseInt(diastolic) : null,
      weight: weight ? parseFloat(weight) : null,
    };

    try {
      if (heartRate && isNaN(parseInt(heartRate))) throw new Error('Invalid Heart Rate');
      if (weight && isNaN(parseFloat(weight))) throw new Error('Invalid Weight');

      const { error: insertError } = await supabase.from('vitals').insert(dataToInsert);

      if (insertError) throw insertError;
      
      setHeartRate('');
      setSystolic('');
      setDiastolic('');
      setWeight('');
      onSuccess();
      await fetchHistory();
      alert('Vitals tracked successfully!');
    } catch (err: any) {
      console.error('[Vitals] Error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField id="heart-rate" label="Heart Rate" icon={Heart} value={heartRate} onChange={setHeartRate} placeholder="bpm" />
          <InputField id="weight" label="Weight" icon={Scale} value={weight} onChange={setWeight} placeholder="kg" step="0.1" />
          <InputField id="systolic" label="Systolic BP" icon={Activity} value={systolic} onChange={setSystolic} placeholder="mmHg" />
          <InputField id="diastolic" label="Diastolic BP" icon={Activity} value={diastolic} onChange={setDiastolic} placeholder="mmHg" />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
             <AlertCircle className="h-4 w-4" />
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="submit"
            disabled={loading}
            className="h-14 inline-flex items-center justify-center px-6 font-bold rounded-2xl text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="h-5 w-5 mr-2" /> Track Metrics</>}
          </button>
          <button
            type="button"
            onClick={generateAnalysis}
            className="h-14 inline-flex items-center justify-center px-6 font-bold rounded-2xl text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
            Analyze Vitals
          </button>
        </div>
      </form>

      {analysis && (
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-[2rem] p-8 animate-fade-in-up">
           <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                 <Info className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white">Health Analysis</h4>
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5 ${analysis.color}`}>
                       {analysis.status}
                    </span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed">{analysis.advice}</p>
              </div>
           </div>
        </div>
      )}

      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <History className="h-5 w-5 text-teal-400" />
               Recent Records
            </h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Last 5 Entries</span>
         </div>

         <div className="space-y-3">
            {fetchingHistory ? (
               <div className="py-12 flex justify-center"><div className="h-6 w-6 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" /></div>
            ) : history.length > 0 ? (
               history.map((record) => (
                  <div key={record.id} className="group bg-white/5 border border-white/5 rounded-[1.5rem] p-5 hover:bg-white/10 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                              <Clock className="h-4 w-4 text-teal-400" />
                           </div>
                           <span className="text-sm font-bold text-slate-300">
                              {format(new Date(record.created_at), 'MMM dd, yyyy • HH:mm')}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleDeleteRecord(record.id)}
                             className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                             title="Delete Record"
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                           <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {record.heart_rate && (
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heart Rate</p>
                              <p className="text-white font-bold">{record.heart_rate} bpm</p>
                           </div>
                        )}
                        {record.weight && (
                           <div className="space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Weight</p>
                              <p className="text-white font-bold">{record.weight} kg</p>
                           </div>
                        )}
                        {(record.systolic_bp || record.diastolic_bp) && (
                           <div className="space-y-1 col-span-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Blood Pressure</p>
                              <p className="text-white font-bold">{record.systolic_bp || '--'}/{record.diastolic_bp || '--'} mmHg</p>
                           </div>
                        )}
                     </div>
                  </div>
               ))
            ) : (
               <div className="py-12 text-center bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">No records found</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
