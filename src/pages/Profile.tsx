import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import { User, Mail, Shield, Save, Camera, AlertCircle, CheckCircle, Lock, X } from 'lucide-react';

export default function Profile() {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('[Profile] Fetch error:', profileError);
      }
      
      if (data) {
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setEmailAddress(data.email || user.email || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    setSaveStatus('idle');
    setError(null);

    console.log('[Profile] Saving user profile:', user.id);

    try {
      // Validate username length if provided
      if (username && username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username || null,
          email: emailAddress || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Re-fetch to ensure sync
      const { data: updatedData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!fetchError && updatedData) {
        setFullName(updatedData.full_name || '');
        setUsername(updatedData.username || '');
        setEmailAddress(updatedData.email || user.email || '');
      }

      setSaveStatus('success');
      console.log('[Profile] Save successful');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('[Profile] Save error:', err);
      setError(err.message || 'Failed to update profile.');
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      // Validate passwords
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error('[Profile] Password change error:', err);
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-black text-white tracking-tight">
            {t('account_settings')}
          </h1>
          <p className="mt-2 text-slate-400 font-medium">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="relative inline-block mb-4 group">
                 <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                    <User className="h-16 w-16 text-white" />
                 </div>
                 <button className="absolute -bottom-2 -right-2 p-3 bg-slate-900 border border-white/10 rounded-2xl text-blue-400 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-90">
                    <Camera className="h-5 w-5" />
                 </button>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{fullName || user?.email?.split('@')[0]}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">@{username || 'unknown'}</p>
              
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                 <div className="flex items-center justify-between text-xs px-2">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Role</span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-black border border-blue-500/20">{role}</span>
                 </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
               <div className="flex items-center gap-3 text-white font-bold mb-4">
                  <Shield className="h-5 w-5 text-teal-400" />
                  Security Info
               </div>
               <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Your account is protected with enterprise-grade encryption and Supabase Auth security.
               </p>
               <button 
                 onClick={() => setShowPasswordModal(true)}
                 className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-2xl text-sm transition-all active:scale-95"
               >
                  Change Password
               </button>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
             <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('full_name')}</label>
                         <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                               type="text" 
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
                               className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                               placeholder="e.g. Sarvesh Sundaram"
                            />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('username')}</label>
                         <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center font-bold text-slate-500 group-focus-within:text-blue-400 transition-colors">@</span>
                            <input 
                               type="text" 
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}
                               className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                               placeholder="username"
                            />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address (For Reminders)</label>
                         <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input 
                               type="email" 
                               value={emailAddress}
                               onChange={(e) => setEmailAddress(e.target.value)}
                               className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                               placeholder="your@email.com"
                            />
                         </div>
                      </div>
                   </div>

                   {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-bold">Database Error</span>
                         </div>
                         <p className="opacity-80">{error}</p>
                      </div>
                   )}

                   {saveStatus === 'success' && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center gap-2 animate-fade-in-up">
                         <CheckCircle className="h-4 w-4" />
                         Profile updated successfully!
                      </div>
                   )}

                   <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                   >
                      {loading ? (
                         <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                         <>
                            <Save className="h-5 w-5" />
                            {t('save_changes')}
                         </>
                      )}
                   </button>
                </form>
             </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-800 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                  <Lock className="h-6 w-6 text-teal-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Change Password</h2>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              {passwordError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Password changed successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {passwordLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
