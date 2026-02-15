import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Plus, Pill, Clock, Calendar, Save, AlertCircle, X } from 'lucide-react';

interface ReminderFormProps {
  onSuccess: () => void;
  editingReminder?: any;
  onCancel?: () => void;
}

const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = "text", id, required = false }: any) => (
  <div className="relative group">
     <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
       {label}
     </label>
     <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-inner"
          placeholder={placeholder}
        />
     </div>
  </div>
);

export default function ReminderForm({ onSuccess, editingReminder, onCancel }: ReminderFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('08:00');
  const [amPm, setAmPm] = useState('AM');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingReminder) {
      setName(editingReminder.medicine_name || '');
      setDosage(editingReminder.dosage || '');
      setFrequency(editingReminder.frequency || 'Daily');
      
      // Convert 24h to 12h for form
      if (editingReminder.time) {
        let [hours, minutes] = editingReminder.time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        setTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        setAmPm(ampm);
      }
    } else {
      setName('');
      setDosage('');
      setFrequency('Daily');
      setTime('08:00');
      setAmPm('AM');
    }
  }, [editingReminder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    setError(null);

    // Convert to 24-hour format for DB
    let [hours, minutes] = time.split(':').map(Number);
    if (amPm === 'PM' && hours < 12) hours += 12;
    if (amPm === 'AM' && hours === 12) hours = 0;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    console.log('[Reminder] Saving medicine:', name, 'at', formattedTime);

    try {
      const reminderData = {
        user_id: user.id,
        medicine_name: name,
        dosage,
        frequency,
        time: formattedTime,
      };

      let query;
      if (editingReminder) {
        query = supabase.from('reminders').update(reminderData).eq('id', editingReminder.id);
      } else {
        query = supabase.from('reminders').insert(reminderData);
      }

      const { error: dbError } = await query;

      if (dbError) throw dbError;
      
      console.log('[Reminder] Success');
      if (!editingReminder) {
        setName('');
        setDosage('');
        setFrequency('Daily');
        setTime('08:00');
        setAmPm('AM');
      }
      onSuccess();
      alert(editingReminder ? 'Reminder updated!' : 'Reminder added!');
    } catch (err: any) {
      console.error('[Reminder] Error:', err);
      setError(err.message || 'Failed to save reminder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField 
          id="name"
          label="Medicine Name"
          icon={Pill}
          value={name}
          onChange={setName}
          placeholder="Enter medicine name"
          required
        />
        <InputField 
          id="dosage"
          label="Dosage"
          icon={Plus}
          value={dosage}
          onChange={setDosage}
          placeholder="e.g. 500mg"
        />
      </div>
      
      <div className="space-y-6">
        <div className="relative group">
          <label htmlFor="frequency" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
            Frequency
          </label>
          <div className="relative">
             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400" />
             <select
               id="frequency"
               className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
               value={frequency}
               onChange={(e) => setFrequency(e.target.value)}
             >
               <option value="Daily" className="bg-[#1e293b]">Daily</option>
               <option value="Twice Daily" className="bg-[#1e293b]">Twice Daily</option>
               <option value="Weekly" className="bg-[#1e293b]">Weekly</option>
               <option value="As Needed" className="bg-[#1e293b]">As Needed</option>
             </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
        <div className="relative group">
          <label htmlFor="time" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
            Time
          </label>
          <div className="relative">
             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-indigo-400" />
             <input
               id="time"
               type="time"
               required
               value={time}
               onChange={(e) => setTime(e.target.value)}
               className="block w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-inner"
             />
          </div>
        </div>

        <div className="relative group">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
            AM/PM
          </label>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setAmPm('AM')}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${amPm === 'AM' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setAmPm('PM')}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${amPm === 'PM' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
           <AlertCircle className="h-4 w-4" />
           {error}
        </div>
      )}

      <div className="flex gap-4">
        {editingReminder && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-14 inline-flex items-center justify-center px-6 border border-white/10 font-bold rounded-2xl text-slate-300 bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all active:scale-95"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`${editingReminder ? 'flex-[2]' : 'w-full'} h-14 inline-flex items-center justify-center px-6 border border-transparent font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              {editingReminder ? 'Update Schedule' : 'Save Schedule'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
