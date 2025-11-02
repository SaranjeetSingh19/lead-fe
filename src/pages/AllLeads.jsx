import { useState, useEffect } from 'react';
import { Filter, Download, RefreshCw } from 'lucide-react';
import LeadsTable from '../components/LeadsTable';
import { leadService } from '../services/api';

const AllLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    status: '',
    limit: 100
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAllLeads(filters);
      setLeads(response.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Campaign', 'Status', 'Date'];
    const csvData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.source,
      lead.campaign || '',
      lead.status,
      new Date(lead.createdAt).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
          <p className="text-gray-500 mt-1">
            Total: {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <select
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limit
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="50">50 leads</option>
              <option value="100">100 leads</option>
              <option value="200">200 leads</option>
              <option value="500">500 leads</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ source: '', status: '', limit: 100 })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
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

export default AllLeads;