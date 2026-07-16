import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        let query = supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (searchTerm) {
           query = query.ilike('full_name', `%${searchTerm}%`);
        }
        const { data } = await query;
        setCustomers(data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage customer profiles</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border-none overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {loading ? (
             <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : customers.length === 0 ? (
             <div className="col-span-full text-center text-gray-500">No customers found.</div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="border border-gray-200 rounded-xl p-5 hover:border-brand-green/30 transition-colors shadow-sm">
                 <h3 className="font-bold text-gray-900 text-lg mb-4">{customer.full_name}</h3>
                 <div className="space-y-2 text-sm text-gray-700">
                   <div className="flex items-center"><Mail size={16} className="mr-2 text-gray-400" /> {customer.email}</div>
                   <div className="flex items-center"><Phone size={16} className="mr-2 text-gray-400" /> {customer.phone || 'No phone'}</div>
                   <div className="flex items-center"><Calendar size={16} className="mr-2 text-gray-400" /> Joined {new Date(customer.created_at).toLocaleDateString()}</div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
