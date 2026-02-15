import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portal = searchParams.get('portal');
  const { session, role } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session && role) {
      if (role === 'patient') navigate('/dashboard/patient');
      else if (role === 'doctor' || role === 'caretaker') navigate('/dashboard/caretaker');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    }
  }, [session, role, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Determine role based on portal
    const signupRole = portal === 'caretaker' || portal === 'doctor' ? 'caretaker' : 'patient';

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: signupRole,
        }
      }
    });

    if (error) {
      if (error.status === 429) {
        setError('Sign up rate limit exceeded. To continue testing without delays, please disable "Email Confirmation" in your Supabase Dashboard (Authentication -> Providers -> Email).');
      } else {
        setError(error.message);
      }
    } else {
      setMessage(`Registration successful as a ${signupRole}! Please check your email for verification. If testing with email confirmation disabled, you can sign in directly now.`);
    }
    setLoading(false);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-300 hover:text-teal-200 underline transition-colors">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-6" onSubmit={handleSignUp}>
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
              placeholder="Email address"
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
              autoComplete="new-password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300/50 rounded-lg bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Password"
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
                <h3 className="text-sm font-medium text-red-800">Sign up failed</h3>
                <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                </div>
                </div>
            </div>
            </div>
        )}

        {message && (
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="flex">
                <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Verify your email</h3>
                <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                </div>
                </div>
            </div>
            </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Get Started'}
          {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>
    </AuthLayout>
  );
}
