import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar, MapPin, Tag, Filter, Trash2, Download, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .in('inquiry_type', ['Lead Capture', 'Product Enquiry'])
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        const parsedData = data.map(item => {
          let email = 'N/A';
          let city = 'N/A';
          let interestedIn = 'Other';
          let status = 'New';
          let parsedMessage = '';
          let productName = '';
          let productSku = '';
          let productId = '';

          try {
            const parsed = JSON.parse(item.message);
            email = parsed.email || 'N/A';
            city = parsed.city || 'N/A';
            interestedIn = parsed.interested_in || 'Other';
            status = parsed.status || 'New';
            parsedMessage = parsed.message || '';
            productName = parsed.product_name || '';
            productSku = parsed.product_sku || '';
            productId = parsed.product_id || '';
          } catch (e) {
            // Fallback for non-JSON or partial message
            parsedMessage = item.message || '';
          }

          return {
            ...item,
            email,
            city,
            interestedIn,
            status,
            parsedMessage,
            productName,
            productSku,
            productId
          };
        });

        // Apply client-side filters (Search, Status, Product)
        let filtered = parsedData;

        if (searchTerm) {
          const lowerSearch = searchTerm.toLowerCase();
          filtered = filtered.filter(lead => 
            (lead.name || '').toLowerCase().includes(lowerSearch) ||
            (lead.phone || '').toLowerCase().includes(lowerSearch) ||
            (lead.email || '').toLowerCase().includes(lowerSearch) ||
            (lead.city || '').toLowerCase().includes(lowerSearch) ||
            (lead.interestedIn || '').toLowerCase().includes(lowerSearch) ||
            (lead.productName || '').toLowerCase().includes(lowerSearch) ||
            (lead.productSku || '').toLowerCase().includes(lowerSearch)
          );
        }

        if (statusFilter !== 'All') {
          filtered = filtered.filter(lead => lead.status === statusFilter);
        }

        if (productFilter !== 'All') {
          filtered = filtered.filter(lead => lead.interestedIn === productFilter);
        }

        setLeads(filtered);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchTerm, statusFilter, productFilter]);

  const updateLeadStatus = async (id: string, originalMessage: string, newStatus: string) => {
    try {
      let parsed: any = {};
      try {
        parsed = JSON.parse(originalMessage);
      } catch (e) {
        parsed = { message: originalMessage };
      }

      const updatedMessage = JSON.stringify({
        ...parsed,
        status: newStatus
      });

      const { error } = await supabase
        .from('inquiries')
        .update({ message: updatedMessage })
        .eq('id', id);

      if (error) throw error;
      fetchLeads();
    } catch (e) {
      console.error('Error updating lead status:', e);
      alert('Failed to update status. Please try again.');
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLeads();
    } catch (e) {
      console.error('Error deleting lead:', e);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) {
      alert('No leads to export.');
      return;
    }

    const headers = ['Lead ID', 'Name', 'Mobile Number', 'Email', 'City', 'Interested Product', 'Product Name', 'Product SKU', 'Date & Time', 'Status'];
    const rows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.phone,
      lead.email,
      lead.city,
      lead.interestedIn,
      lead.productName || '',
      lead.productSku || '',
      new Date(lead.created_at).toLocaleString(),
      lead.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Leads_Export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Lead Capture System</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage first-time visitor consultation requests and marketing leads</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-brand-green hover:bg-brand-orange text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm self-stretch sm:self-auto justify-center"
        >
          <Download size={16} /> Export to CSV
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search leads by name, phone, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-green transition-all"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-green cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Tag size={16} className="text-gray-400" />
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-green cursor-pointer"
            >
              <option value="All">All Products</option>
              <option value="Solar Panel">Solar Panel</option>
              <option value="Solar Inverter">Solar Inverter</option>
              <option value="Battery">Battery</option>
              <option value="UPS">UPS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button 
            onClick={fetchLeads} 
            title="Refresh list"
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-brand-green transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase text-gray-500 tracking-wider">
                <th className="py-4 px-6">Lead ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Interested Product</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-brand-green" size={24} />
                    Loading leads data...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                    No leads found matching the filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-400 max-w-[100px] truncate" title={lead.id}>
                      {lead.id}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {lead.name}
                    </td>
                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                        <Phone size={12} className="text-gray-400" />
                        <a href={`tel:${lead.phone}`} className="hover:text-brand-green hover:underline">{lead.phone}</a>
                      </div>
                      {lead.email !== 'N/A' && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                          <Mail size={12} className="text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-brand-green hover:underline">{lead.email}</a>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-xs">
                        <MapPin size={12} className="text-gray-400" />
                        {lead.city}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {lead.productName ? (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-green-light text-brand-green uppercase tracking-wide mb-1">
                            {lead.interestedIn}
                          </span>
                          <div className="text-xs text-gray-800 font-semibold mt-1 max-w-[200px] truncate" title={lead.productName}>
                            {lead.productName}
                          </div>
                          {lead.productSku && (
                            <div className="text-[10px] text-gray-500 font-medium">
                              SKU: {lead.productSku}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-green-light text-brand-green uppercase tracking-wide">
                          {lead.interestedIn}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-800 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {new Date(lead.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, lead.message, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border-none focus:ring-2 focus:ring-brand-green cursor-pointer uppercase tracking-wider ${
                          lead.status === 'Converted' 
                            ? 'bg-green-100 text-green-800' 
                            : lead.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
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
