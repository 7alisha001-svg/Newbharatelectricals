import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Users, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStock: 0,
    outOfStock: 0
  });
  
  const [loading, setLoading] = useState(true);

  // Dummy chart data for now, since we need to aggregate orders by date
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        { count: productsCount }, 
        { count: ordersCount }, 
        { count: customersCount },
        { count: lowStockCount },
        { count: outOfStockCount },
        { data: ordersData }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('customers').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).lt('stock_quantity', 6).gt('stock_quantity', 0),
        supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock_quantity', 0),
        supabase.from('orders').select('total_amount')
      ]);

      const revenue = ordersData ? ordersData.reduce((acc, order) => acc + Number(order.total_amount || 0), 0) : 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalCustomers: customersCount || 0,
        totalRevenue: revenue,
        lowStock: lowStockCount || 0,
        outOfStock: outOfStockCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-purple-500' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Dashboard Overview</h1>
        <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2">
          <TrendingUp size={16} /> Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start">
          <AlertTriangle className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-yellow-800">Inventory Alerts</h4>
            <p className="text-yellow-700 text-sm mt-1">
              {stats.lowStock > 0 && <span>You have <strong>{stats.lowStock}</strong> products low on stock. </span>}
              {stats.outOfStock > 0 && <span>You have <strong>{stats.outOfStock}</strong> products out of stock.</span>}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">Revenue Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 font-heading">Orders Volume</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
