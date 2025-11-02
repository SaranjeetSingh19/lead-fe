const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <p className="text-sm text-green-600 mt-2 font-medium">
              ↑ {trend}% from last week
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-4 rounded-lg`}>
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;