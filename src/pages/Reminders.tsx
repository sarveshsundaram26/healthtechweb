import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import ReminderForm from '../components/ReminderForm';
import ReminderList from '../components/ReminderList';
import { Bell, Sparkles, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Reminders() {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [upcomingTime, setUpcomingTime] = useState('None');
  const { t } = useLanguage();

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (!user) return;
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Get next today
      const { data } = await supabase
        .from('reminders')
        .select('time')
        .eq('user_id', user.id)
        .gte('time', currentTime)
        .order('time', { ascending: true })
        .limit(1);

      if (data && data.length > 0) {
        setUpcomingTime(format12h(data[0].time));
      } else {
        // Get first of tomorrow
        const { data: tomorrow } = await supabase
          .from('reminders')
          .select('time')
          .eq('user_id', user.id)
          .order('time', { ascending: true })
          .limit(1);
        
        if (tomorrow && tomorrow.length > 0) {
          setUpcomingTime(format12h(tomorrow[0].time));
        } else {
          setUpcomingTime('None');
        }
      }
    };
    fetchUpcoming();
  }, [user, refreshTrigger]);

  const format12h = (time24: string) => {
    if (!time24) return 'None';
    let [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const [editingReminder, setEditingReminder] = useState<any>(null);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setEditingReminder(null);
  };

  const handleEdit = (reminder: any) => {
    setEditingReminder(reminder);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="animate-fade-in-up">
             <h1 className="text-4xl font-black text-white tracking-tight flex items-center">
               <Bell className="h-10 w-10 text-indigo-400 mr-4" />
               {t('medicine_schedule')}
             </h1>
             <p className="mt-3 text-slate-400 font-medium flex items-center">
               <Sparkles className="h-4 w-4 text-indigo-400 mr-2" />
               {t('medication_stay_on_track')}
             </p>
          </div>
          <div className="bg-indigo-500/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-indigo-500/20 flex items-center text-indigo-300 shadow-2xl animate-fade-in-up">
             <Clock className="h-5 w-5 mr-3" />
             <span className="text-sm font-bold">{t('upcoming')}: {upcomingTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
           {/* Add Form Section */}
           <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 hover:border-indigo-500/20">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="bg-indigo-500/20 p-2 rounded-lg mr-3">
                       <Clock className="h-5 w-5 text-indigo-400" />
                    </span>
                    {editingReminder ? 'Update Reminder' : t('add_reminder')}
                 </h3>
                 <ReminderForm 
                   onSuccess={handleSuccess} 
                   editingReminder={editingReminder} 
                   onCancel={() => setEditingReminder(null)} 
                 />
              </div>
           </div>

           {/* List Section */}
           <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl min-h-[400px]">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white">{t('your_reminders')}</h3>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
                       {t('chronological_view')}
                    </div>
                 </div>
                 <ReminderList refreshTrigger={refreshTrigger} onEdit={handleEdit} />
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
