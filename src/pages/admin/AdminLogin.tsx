import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true); // Assume exists until checked

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      // Use the secure RPC function to check if any admin exists
      const { data, error } = await supabase.rpc('check_if_admin_exists');
      
      if (error) {
        console.error('Error checking admin users:', error);
      } else {
        if (data === false) {
          setAdminExists(false);
          setIsLogin(false);
        } else {
          setAdminExists(true);
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isLogin && !adminExists) {
        // Create the first admin
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Insert into admin_users
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert([{ id: authData.user.id, email }]);
            
          if (insertError) throw insertError;
          
          navigate('/admin/dashboard');
        }
      } else {
        // Regular login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Verify they are an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized. Not an admin.');
        }

        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-dark p-6 text-center">
          <h2 className="text-2xl font-heading font-bold text-white">
            {isLogin ? 'Admin Login' : 'Admin Setup'}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isLogin ? 'Secure access to WooCommerce Dashboard' : 'Create the first Super Admin account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-start text-sm">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg py-3 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg py-3 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-brand-green hover:bg-brand-green-dark text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Create Admin Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
