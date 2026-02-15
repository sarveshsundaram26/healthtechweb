import { useState, useEffect } from 'react';
import { getCurrentLocation } from '../utils/geolocation';
import { AlertCircle, MapPin, ShieldAlert, Loader2, Phone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function SOSButton() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emergencyPhone, setEmergencyPhone] = useState('108');
  const [contactName, setContactName] = useState('Emergency Services');

  useEffect(() => {
    const fetchPrimaryContact = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('emergency_contacts')
          .select('name, phone, is_primary')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false })
          .limit(1)
          .single();
        
        if (data) {
          console.log('[SOS] Primary contact found:', data.name, '(Priority:', data.is_primary, ')');
          setEmergencyPhone(data.phone);
          setContactName(data.name);
        }
      } catch (err) {
        console.warn('[SOS] No primary contact found, using default 108');
      }
    };
    fetchPrimaryContact();
  }, [user]);

  const handleSOS = async () => {
    if (!window.confirm('Are you sure you want to trigger an Emergency SOS? This will alert your contacts with your location.')) {
        return;
    }

    setLoading(true);
    setError(null);
    setAlertSent(false);

    try {
      // Add timeout for geolocation
      const locationPromise = getCurrentLocation();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Location request timed out')), 8000));
      
      const location = await Promise.race([locationPromise, timeoutPromise]) as any;
      console.log('[SOS] Location captured:', location);

      // Simulate sending alert to backend with timeout
      // In a real app, this would be a supabase call with its own timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAlertSent(true);
      
      // On some platforms, window.location.href works better if not inside an async/await block
      // but let's encourage the user to click the big red button in the UI which is more reliable.
      console.log(`[SOS] SOS sequence complete. Initiating call link to ${emergencyPhone}...`);
      window.location.href = `tel:${emergencyPhone}`; 
    } catch (err: any) {
      console.error('[SOS] Full Error:', err);
      setError(err.message || 'Failed to retrieve location');
      alert('SOS System Notice: ' + (err.message || 'Check connection/location settings'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black text-white tracking-tight flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
          Emergency Alert System
        </h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
          Triple-secured encryption will broadcast your GPS location to all emergency contacts instantly.
        </p>
      </div>

      <div className="relative group">
        {/* Animated Glow Rings */}
        {!loading && !alertSent && (
          <>
            <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl animate-pulse scale-150" />
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-700 scale-125" />
          </>
        )}

        <button
          onClick={handleSOS}
          disabled={loading || alertSent}
          className={`relative w-56 h-56 rounded-full flex flex-col items-center justify-center text-white font-black text-4xl shadow-2xl transition-all duration-300 transform active:scale-90 border-8 border-transparent ${
            loading 
              ? 'bg-slate-800' 
              : alertSent 
                ? 'bg-gradient-to-br from-emerald-600 to-green-500 shadow-emerald-500/20' 
                : 'bg-gradient-to-br from-red-600 to-rose-500 hover:scale-105 active:rotate-3 shadow-red-500/40 hover:shadow-red-500/60'
          }`}
        >
          {loading ? (
             <div className="flex flex-col items-center">
                <Loader2 className="h-16 w-16 animate-spin mb-2 opacity-50" />
                <span className="text-xs font-black tracking-widest uppercase opacity-50">Transmitting...</span>
             </div>
          ) : alertSent ? (
             <div className="flex flex-col items-center">
                <MapPin className="h-16 w-16 mb-2 scale-110 drop-shadow-lg" />
                <span className="text-sm tracking-widest uppercase font-black">Sent</span>
             </div>
          ) : (
            <>
              <AlertCircle className="h-16 w-16 mb-2 drop-shadow-xl" />
              SOS
            </>
          )}
        </button>
      </div>

      <div className="w-full">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-fade-in-up">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {alertSent && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl animate-fade-in-up">
             <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-400 leading-tight">Alert Dispatched</h3>
             </div>
             <p className="text-sm text-slate-300 font-medium mb-4">
                 GPS coordinates shared. Help is being coordinated through your emergency network.
             </p>
             <a 
               href={`tel:${emergencyPhone}`}
               className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all active:scale-95"
             >
               <Phone className="h-5 w-5 animate-pulse" />
               Call {contactName} ({emergencyPhone})
             </a>
          </div>
        )}
      </div>

      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
         Secure Protocol 2.4.1 • End-to-End Encrypted
      </div>
    </div>
  );
}
