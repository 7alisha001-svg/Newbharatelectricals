import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, ShoppingCart, Package, AlertCircle, DollarSign,
  ImageIcon, Flag, FolderTree, ArrowUpRight, ShieldCheck,
  Plus, Upload, Settings, ExternalLink, Sparkles, RefreshCw, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMedia } from '../../context/MediaContext';

export default function Dashboard() {
  const { mediaItems } = useMedia();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: 0,
    brands: 0,
    totalLeads: 0,
    totalQuotes: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      // Fetch Orders count & Revenue
      const { data: orders } = await supabase.from('orders').select('total_amount, created_at');
      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

      // Fetch Products
      const { data: products } = await supabase.from('products').select('stock_quantity, is_active');
      const totalProducts = products?.length || 0;
      const lowStock = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length || 0;
      const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;

      // Fetch Customers
      const { count: totalCustomers } = await supabase.from('customers').select('*', { count: 'exact', head: true });
      
      // Fetch Categories & Brands
      const { count: categories } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const { count: brands } = await supabase.from('brands').select('*', { count: 'exact', head: true });

      // Fetch Leads & Quotes
      const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      const { count: totalQuotes } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true });

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers: totalCustomers || 0,
        lowStock,
        outOfStock,
        categories: categories || 0,
        brands: brands || 0,
        totalLeads: totalLeads || 0,
        totalQuotes: totalQuotes || 0
      });

      // Fetch Recent Orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      setRecentOrders(recent || []);

      // Fetch Recent Leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setRecentLeads(leadsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const estimatedStorage = (mediaItems.length * 0.45).toFixed(1); // Avg ~450KB per image

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-dark to-gray-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 text-brand-lime text-xs font-bold uppercase tracking-wider mb-3 border border-brand-green/30">
            <Sparkles size={14} />
            <span>Admin CMS Control Panel</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight">Website Overview & Metrics</h1>
          <p className="text-gray-300 text-xs md:text-sm mt-1 max-w-xl">
            Real-time control over orders, products, media assets, leads, and website configuration.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-md transition-all border border-white/10"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-lime hover:text-gray-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg"
          >
            <ExternalLink size={14} />
            <span>Live Website</span>
          </a>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <Link 
            to="/admin/products/new"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-emerald-50 text-gray-800 hover:text-brand-green rounded-xl transition-all border border-gray-100 hover:border-emerald-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-brand-green group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <Plus size={18} />
            </div>
            <span className="text-xs font-bold">Add Product</span>
          </Link>

          <Link 
            to="/admin/media-library"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-blue-50 text-gray-800 hover:text-blue-600 rounded-xl transition-all border border-gray-100 hover:border-blue-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-blue-600 group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <Upload size={18} />
            </div>
            <span className="text-xs font-bold">Media Library</span>
          </Link>

          <Link 
            to="/admin/settings"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-purple-50 text-gray-800 hover:text-purple-600 rounded-xl transition-all border border-gray-100 hover:border-purple-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-purple-600 group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <Settings size={18} />
            </div>
            <span className="text-xs font-bold">Site Settings</span>
          </Link>

          <Link 
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-amber-50 text-gray-800 hover:text-amber-600 rounded-xl transition-all border border-gray-100 hover:border-amber-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-amber-500 group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <ShoppingCart size={18} />
            </div>
            <span className="text-xs font-bold">Manage Orders</span>
          </Link>

          <Link 
            to="/admin/leads"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-teal-50 text-gray-800 hover:text-teal-600 rounded-xl transition-all border border-gray-100 hover:border-teal-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-teal-600 group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <Users size={18} />
            </div>
            <span className="text-xs font-bold">Leads & Inquiries</span>
          </Link>

          <Link 
            to="/admin/categories"
            className="flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-indigo-50 text-gray-800 hover:text-indigo-600 rounded-xl transition-all border border-gray-100 hover:border-indigo-200 group text-center"
          >
            <div className="p-2.5 bg-white group-hover:bg-indigo-600 group-hover:text-white rounded-lg shadow-sm mb-2 transition-colors">
              <FolderTree size={18} />
            </div>
            <span className="text-xs font-bold">Categories</span>
          </Link>
        </div>
      </div>

      {/* Main Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-brand-green rounded-xl">
              <DollarSign size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-gray-500 font-medium">
            <span className="text-emerald-600 font-bold flex items-center mr-1">
              <ArrowUpRight size={14} /> Active
            </span>
            <span>All completed customer orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-gray-500 font-medium">
            <Link to="/admin/orders" className="text-blue-600 hover:underline font-bold">View Orders &rarr;</Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Package size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-gray-500 font-medium">
            <span className="text-amber-600 font-bold mr-1">{stats.lowStock} Low Stock</span>
            <span>/ {stats.outOfStock} Out of Stock</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Media Images</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{mediaItems.length}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <ImageIcon size={22} />
            </div>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-gray-500 font-medium">
            <span className="text-purple-600 font-bold mr-1">~{estimatedStorage} MB</span>
            <span>storage usage</span>
          </div>
        </div>
      </div>

      {/* Secondary Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <FolderTree size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Categories</p>
            <p className="text-lg font-bold text-gray-900">{stats.categories}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-pink-50 text-pink-600 rounded-lg">
            <Flag size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Brands</p>
            <p className="text-lg font-bold text-gray-900">{stats.brands}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Leads</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalLeads}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Quotes</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalQuotes}</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Orders Table & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-base">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Latest transactions submitted on the website</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-brand-green font-bold hover:underline">View All Orders &rarr;</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">No recent orders recorded yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 font-bold text-gray-900">{order.order_id || `#${order.id.slice(0, 8)}`}</td>
                      <td className="py-3.5 text-gray-700">{order.first_name || 'Guest'} {order.last_name || ''}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Website Health & Recent Uploads */}
        <div className="space-y-6">
          {/* Website Health */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center">
              <ShieldCheck size={18} className="text-emerald-500 mr-2" />
              Website Health & Status
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="font-medium text-emerald-900">Database Connection</span>
                <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-medium text-blue-900">Supabase Storage</span>
                <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-[10px]">Ready</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <span className="font-medium text-purple-900">CMS Media Sync</span>
                <span className="font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded text-[10px]">{mediaItems.length} Slots</span>
              </div>
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-4 flex items-center">
              <AlertCircle size={18} className="text-amber-500 mr-2" />
              Inventory Alert Center
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-xs font-bold text-red-900">Out of Stock</p>
                  <p className="text-[10px] text-red-700">Immediate reorder needed</p>
                </div>
                <span className="text-xl font-black text-red-600">{stats.outOfStock}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <div>
                  <p className="text-xs font-bold text-yellow-900">Low Stock</p>
                  <p className="text-[10px] text-yellow-700">Under 5 units remaining</p>
                </div>
                <span className="text-xl font-black text-yellow-600">{stats.lowStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
