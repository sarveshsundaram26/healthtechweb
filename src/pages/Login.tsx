import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session, role } = useAuth();
  const { t } = useLanguage();

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Redirect if already logged in
  useEffect(() => {
    if (session && role) {
      navigate('/dashboard/patient');
    }
  }, [session, role, navigate]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setResending(true);
    setResendStatus('idle');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      if (error.status === 429) {
        setError('Resend rate limit exceeded. Please wait a few minutes.');
      } else {
        setError(error.message);
      }
      setResendStatus('error');
    } else {
      setResendStatus('success');
    }
    setResending(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendStatus('idle');

    const { data: { session: newSession }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else if (newSession) {
       console.log('[Login] Sign in successful');
    }
  };

  return (
    <AuthLayout 
      title={t('welcome_back')}
      subtitle={
        <span>
          {t('new_here')}{' '}
          <Link 
            to="/signup" 
            className="font-medium text-teal-300 hover:text-teal-200 underline transition-colors"
          >
            {t('create_account')}
          </Link>
        </span>
      }
    >
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('email_address')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
             <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Login failed</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  {error.includes('not confirmed') && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resending || resendStatus === 'success'}
                        className={`text-sm font-bold px-3 py-1.5 rounded-md transition-all ${
                          resendStatus === 'success'
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 shadow-sm'
                        }`}
                      >
                        {resending ? 'Sending...' : resendStatus === 'success' ? 'Verification Link Sent!' : 'Resend Confirmation Email'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('loading') : t('sign_in')}
            {!loading && <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
    </AuthLayout>
  );
}
