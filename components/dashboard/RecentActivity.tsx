'use client';

// 模拟数据（后续从 Firestore 获取）
const mockActivities = [
  {
    id: '1',
    type: 'analysis',
    title: 'SEO Article Analysis',
    date: '2026-03-28 14:30',
    keywords: 156,
    density: '2.3%',
  },
  {
    id: '2',
    type: 'analysis',
    title: 'Blog Post Check',
    date: '2026-03-28 12:15',
    keywords: 89,
    density: '1.8%',
  },
  {
    id: '3',
    type: 'analysis',
    title: 'Product Description',
    date: '2026-03-27 16:45',
    keywords: 45,
    density: '3.1%',
  },
];

export default function RecentActivity() {
  return (
    <div className="space-y-4">
      {mockActivities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-2">Start analyzing your content!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{activity.keywords} keywords</p>
                <p className="text-xs text-gray-500">{activity.density} density</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
