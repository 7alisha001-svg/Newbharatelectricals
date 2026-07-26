import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ErrorBoundary from '../../components/ErrorBoundary';
import { Menu, Shield } from 'lucide-react';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (isMounted) setIsAuthenticated(false);
          return;
        }

        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (isMounted) {
          if (adminData && !error) {
            setIsAuthenticated(true);
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }
      } catch (e) {
        if (isMounted) setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setIsAuthenticated(false);
          navigate('/admin-login');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          <Shield size={16} className="text-brand-green" />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 flex">
      <Helmet>
        <title>Admin Panel | New Bharat Electricals</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:hidden sticky top-0 z-30 shadow-xs flex-shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <div className="font-bold text-base text-gray-900 ml-2">Admin Portal</div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
