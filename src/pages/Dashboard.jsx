import { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Facebook, 
  Instagram, 
  Search, 
  TrendingUp,
  RefreshCw 
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';
import { leadService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes] = await Promise.all([
        leadService.getLeadStats(),
        leadService.getAllLeads({ limit: 100 })
      ]);
      setStats(statsRes.data || []);
      setLeads(leadsRes.data || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate totals
  const totalLeads = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalNew = stats.reduce((sum, stat) => sum + stat.newLeads, 0);
  const totalConverted = stats.reduce((sum, stat) => sum + stat.converted, 0);
  const conversionRate = totalLeads > 0 ? ((totalConverted / totalLeads) * 100).toFixed(1) : 0;

  // Prepare chart data
  const sourceData = stats.map(stat => ({
    name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
    value: stat.count,
    new: stat.newLeads,
    converted: stat.converted
  }));

  const COLORS = ['#3b82f6', '#6366f1', '#ec4899', '#10b981'];

  // Recent leads trend (last 7 days)
  const getTrendData = () => {
    const days = 7;
    const trendData = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate.toDateString() === date.toDateString();
      });

      trendData.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        leads: dayLeads.length
      });
    }

    return trendData;
  };

  const trendData = getTrendData();

  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString('en-IN')}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          color="blue"
          trend={15}
        />
        <StatCard
          title="New Leads"
          value={totalNew}
          icon={TrendingUp}
          color="green"
          trend={23}
        />
        <StatCard
          title="Converted"
          value={totalConverted}
          icon={Users}
          color="purple"
          trend={8}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Leads by Source */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leads by Source
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Performance by Source */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance by Source
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#3b82f6" name="New" />
              <Bar dataKey="converted" fill="#10b981" name="Converted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart - 7 Day Trend */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Leads"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={24} />
            <h3 className="text-lg font-semibold">Website</h3>
          </div>
          <p className="text-3xl font-bold">
            {sourceData.find(s => s.name === 'Website')?.value || 0}
          </p>
          <p className="text-blue-100 text-sm mt-1">Direct form submissions</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Facebook size={24} />
            <h3 className="text-lg font-semibold">Facebook</h3>
          </div>
          <p className="text-3xl font-bold">
            {sourceData.find(s => s.name === 'Facebook')?.value || 0}
          </p>
          <p className="text-indigo-100 text-sm mt-1">Meta Lead Ads</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Instagram size={24} />
            <h3 className="text-lg font-semibold">Instagram</h3>
          </div>
          <p className="text-3xl font-bold">
            {sourceData.find(s => s.name === 'Instagram')?.value || 0}
          </p>
          <p className="text-pink-100 text-sm mt-1">Story & Reel Ads</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Search size={24} />
            <h3 className="text-lg font-semibold">Google</h3>
          </div>
          <p className="text-3xl font-bold">
            {sourceData.find(s => s.name === 'Google')?.value || 0}
          </p>
          <p className="text-green-100 text-sm mt-1">Search & Display Ads</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;