import { useState, useEffect } from 'react';
import { Facebook, RefreshCw } from 'lucide-react';
import LeadsTable from '../components/LeadsTable';
import { leadService } from '../services/api';

const MetaLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getMetaLeads();
      setLeads(response.data || []);
    } catch (error) {
      console.error('Error fetching Meta leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Facebook size={28} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meta (Facebook) Leads</h1>
            <p className="text-gray-500 mt-1">
              Leads from Facebook Lead Ads campaigns
            </p>
          </div>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <p className="text-indigo-800">
          <strong>Total Facebook Leads:</strong> {leads.length}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <LeadsTable leads={leads} onStatusUpdate={fetchLeads} />
      )}
    </div>
  );
};

export default MetaLeads;