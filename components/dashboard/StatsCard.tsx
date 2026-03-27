interface StatsCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'gray';
}

const colorClasses = {
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  gray: 'from-gray-500 to-gray-600',
};

export default function StatsCard({ label, value, description, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
