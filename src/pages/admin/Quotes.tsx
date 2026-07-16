import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar, MapPin, Package, Tag, Filter } from 'lucide-react';

export default function Quotes() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchInquiries = async () => {
    try {
      let query = supabase
        .from('inquiries')
        .select('*')
        .eq('inquiry_type', 'Quote Request')
        .order('created_at', { ascending: false });
        
      if (searchTerm) {
         query = query.ilike('name', `%${searchTerm}%`);
      }
      
      const { data } = await query;
      
      if (data) {
        // Parse the JSON message field to extract extra fields
        const parsedData = data.map(item => {
          try {
            const parsed = JSON.parse(item.message);
            return {
              ...item,
              email: parsed.email || 'N/A',
              status: parsed.status || 'New',
              parsed_message: parsed.message || '',
              ip_address: parsed.ip_address || 'N/A',
            };
          } catch (e) {
            // Not a JSON message, just return original
            return {
              ...item,
              email: 'N/A',
              status: 'New',
              parsed_message: item.message,
              ip_address: 'N/A',
            };
          }
        });
        
        if (statusFilter !== 'All') {
          setInquiries(parsedData.filter(i => i.status === statusFilter));
        } else {
          setInquiries(parsedData);
        }
      } else {
        setInquiries([]);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [searchTerm, statusFilter]);

  const updateStatus = async (id: string, currentMessage: string, newStatus: string) => {
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(currentMessage);
      } catch (e) {}
      
      const updatedMessage = JSON.stringify({
        ...parsed,
        status: newStatus
      });
      
      await supabase.from('inquiries').update({ message: updatedMessage }).eq('id', id);
      fetchInquiries();
    } catch (e) {
      console.error('Error updating status', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes & Enquiries</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage free quote requests from website visitors</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green text-sm bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer Details</th>
                <th className="p-4 font-medium">Message</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                 <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading quotes...</td></tr>
              ) : inquiries.length === 0 ? (
                 <tr><td colSpan={4} className="p-8 text-center text-gray-500">No quotes found.</td></tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{new Date(inquiry.created_at).toLocaleDateString()}</div>
                      <div className="text-gray-500 text-xs">{new Date(inquiry.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 mb-1">{inquiry.name}</div>
                      <div className="flex flex-col gap-1 text-gray-600 text-xs">
                        <div className="flex items-center"><Phone size={12} className="mr-1" /> {inquiry.phone}</div>
                        {inquiry.email !== 'N/A' && <div className="flex items-center"><Mail size={12} className="mr-1" /> {inquiry.email}</div>}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-gray-600 line-clamp-3">{inquiry.parsed_message || <span className="italic text-gray-400">No message</span>}</p>
                    </td>
                    <td className="p-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry.id, inquiry.message, e.target.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-none focus:ring-2 focus:ring-offset-1 focus:outline-none cursor-pointer ${
                          inquiry.status === 'New' ? 'bg-green-100 text-green-700 focus:ring-green-500' :
                          inquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500' :
                          'bg-gray-100 text-gray-700 focus:ring-gray-500'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Closed">Closed</option>
                      </select>
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
