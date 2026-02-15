import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Trash2, Clock, Pill, Calendar, Bell, Pencil } from 'lucide-react';
import type { Database } from '../types/supabase';

type Reminder = Database['public']['Tables']['reminders']['Row'];

interface ReminderListProps {
  refreshTrigger: number;
  onEdit: (reminder: Reminder) => void;
}

export default function ReminderList({ refreshTrigger, onEdit }: ReminderListProps) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
    } else {
      setReminders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, [user, refreshTrigger]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) {
       console.error('Error deleting reminder:', error);
    } else {
      fetchReminders();
    }
  };

  const format12h = (time24: string) => {
    if (!time24) return '';
    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
       <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
       <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Schedule...</p>
    </div>
  );

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
        <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mb-2">
           <Bell className="h-8 w-8 text-slate-600" />
        </div>
        <div>
           <p className="text-white font-bold text-lg">No reminders scheduled</p>
           <p className="text-slate-500 text-sm mt-1">Your medication timeline will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-hidden">
      {reminders.map((reminder) => (
        <div 
          key={reminder.id} 
          className="group relative bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex items-center justify-between transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/20 shadow-xl animate-fade-in-up"
        >
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <Pill className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">{reminder.medicine_name}</h3>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {reminder.dosage}
                  </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center text-xs font-medium">
                   <Clock className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                   {format12h(reminder.time ?? '')}
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <div className="flex items-center text-xs font-medium">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                  {reminder.frequency}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(reminder)}
              className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all active:scale-90"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(reminder.id)}
              className="h-12 w-12 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
