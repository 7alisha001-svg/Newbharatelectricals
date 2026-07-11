import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
Users, ShoppingCart, Package, 
  AlertCircle, DollarSign, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStock: 0,
    outOfStock: 0,
    categories: 0,
    brands: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Orders count & Revenue
      const { data: orders } = await supabase.from('orders').select('total_amount');
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

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers: totalCustomers || 0,
        lowStock,
        outOfStock,
        categories: categories || 0,
        brands: brands || 0
      });

      // Fetch Recent Orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      setRecentOrders(recent || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          bg="bg-green-50"
          color="text-green-600"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders}
          icon={ShoppingCart}
          bg="bg-blue-50"
          color="text-blue-600"
        />
        <StatCard 
          title="Total Customers" 
          value={stats.totalCustomers}
          icon={Users}
          bg="bg-purple-50"
          color="text-purple-600"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts}
          icon={Package}
          bg="bg-orange-50"
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-brand-green font-medium hover:underline">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">{order.order_id}</td>
                      <td className="py-4 text-gray-600">{order.first_name} {order.last_name}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-medium text-gray-900">₹{order.total_amount?.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              Inventory Alerts
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-red-900">Out of Stock</p>
                  <p className="text-xs text-red-700 mt-0.5">Products needing attention</p>
                </div>
                <span className="text-2xl font-bold text-red-600">{stats.outOfStock}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-yellow-900">Low Stock</p>
                  <p className="text-xs text-yellow-700 mt-0.5">Products under 5 units</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.lowStock}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6 flex items-center">
              <Activity size={20} className="text-blue-500 mr-2" />
              Store Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-600 text-sm">Categories</span>
                <span className="font-bold text-gray-900">{stats.categories}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Brands</span>
                <span className="font-bold text-gray-900">{stats.brands}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
