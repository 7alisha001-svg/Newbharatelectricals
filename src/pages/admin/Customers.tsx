import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // In a real scenario, this would join with the orders table to get total spent
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.first_name && c.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.last_name && c.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-heading text-gray-900">Customers</h2>
        <div className="bg-brand-green/10 text-brand-green px-4 py-2 rounded-lg font-bold text-sm">
          Total Customers: {customers.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white border border-gray-200 rounded-lg py-2 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green mx-auto mb-4"></div>
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center font-bold">
                          {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {customer.first_name || customer.last_name 
                              ? `${customer.first_name || ''} ${customer.last_name || ''}`
                              : 'Unnamed User'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-500 text-xs">
                          <Mail size={14} className="mr-1.5" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-gray-500 text-xs">
                            <Phone size={14} className="mr-1.5" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {customer.orders_count || 0}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{(customer.total_spent || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      {format(new Date(customer.created_at), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
