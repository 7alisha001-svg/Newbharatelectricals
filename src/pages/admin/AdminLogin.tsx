import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Mail, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: settingsData } = await supabase.from('settings').select('logo_url').eq('id', 'global').single();
        if (settingsData?.logo_url) setLogoUrl(settingsData.logo_url);

        const { data, error } = await supabase.rpc('check_if_admin_exists');
        if (error) {
          console.error("Error checking admin:", error);
          const { count, error: countError } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
          if (!countError) {
             setAdminExists((count || 0) > 0);
          } else {
             setAdminExists(false); 
          }
        } else {
          setAdminExists(data);
        }
      } catch (e) {
        setAdminExists(false);
      }
    };
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin/dashboard');
      else checkAdminStatus();
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (adminExists === false) {
        let { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        let currentUser = data.user;
        let currentSession = data.session;
        
        if (currentUser && currentUser.identities && currentUser.identities.length === 0) {
           const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
             email,
             password,
           });
           if (signInError) {
              if (signInError.message.toLowerCase().includes('email not confirmed')) {
                throw new Error("This account exists but email is not confirmed.");
              }
              throw new Error("This email is already registered.");
           }
           currentUser = signInData.user;
           currentSession = signInData.session;
        }

        if (!currentUser) {
          throw new Error("Failed to retrieve user information after signup.");
        }

        const { error: insertError } = await supabase.rpc('create_first_admin', {
          admin_id: currentUser.id,
          admin_email: email,
          admin_full_name: fullName
        });
        if (insertError) throw insertError;

        if (!currentSession) {
          const { error: finalSignInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (finalSignInError) {
            if (finalSignInError.message.toLowerCase().includes('email not confirmed')) {
              throw new Error("Account created! Please check your email to confirm before logging in.");
            }
            throw finalSignInError;
          }
        }
        
        navigate('/admin/dashboard');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data: adminData, error: adminErr } = await supabase.from('admin_users').select('*').eq('id', user.id).single();
           if (!adminData) {
             await supabase.auth.signOut();
             throw new Error(`Unauthorized access. You are not an administrator. Details: ${adminErr?.message || 'Row not found'}`);
           }
        }
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  if (adminExists === null) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Helmet>
        <title>{`${adminExists ? 'Admin Login' : 'Admin Setup'} | New Bharat Electricals`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
              <img src={logoUrl || "/header-logo-dark.png"} alt="New Bharat Electricals" className="h-20 w-auto object-contain" onError={(e) => { const target = e.currentTarget; if (!target.src.includes('images.unsplash.com')) target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop'; }} />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {adminExists ? 'Admin Portal' : 'Setup Super Admin'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {adminExists 
              ? 'Sign in to access the control panel' 
              : 'Create the first administrator account to secure the system.'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!adminExists && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-green-dark transition-colors flex items-center justify-center disabled:opacity-70 mt-4 shadow-lg shadow-brand-green/20"
          >
            {loading ? 'Processing...' : (adminExists ? 'Secure Login' : 'Create Admin Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
