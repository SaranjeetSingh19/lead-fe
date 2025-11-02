import { useState } from 'react';
import { Mail, Phone, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { leadService } from '../services/api';

const LeadsTable = ({ leads, onStatusUpdate }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setUpdatingId(leadId);
      await leadService.updateLeadStatus(leadId, newStatus);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update lead status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getSourceBadge = (source) => {
    const badges = {
      website: 'bg-blue-100 text-blue-800',
      facebook: 'bg-indigo-100 text-indigo-800',
      instagram: 'bg-pink-100 text-pink-800',
      google: 'bg-green-100 text-green-800',
    };
    return badges[source] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No leads found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lead Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.uid}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={14} />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getSourceBadge(
                      lead.source
                    )}`}
                  >
                    {lead.source}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {lead.campaign && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <TrendingUp size={14} />
                        <span className="font-medium">{lead.campaign}</span>
                      </div>
                    )}
                    {lead.location && (
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <MapPin size={12} />
                        <span className="text-xs">{lead.location}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                    disabled={updatingId === lead._id}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border-none outline-none cursor-pointer ${getStatusBadge(
                      lead.status
                    )} ${updatingId === lead._id ? 'opacity-50' : ''}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar size={14} />
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;