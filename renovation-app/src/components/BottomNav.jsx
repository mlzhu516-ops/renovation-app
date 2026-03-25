// BottomNav - 底部导航栏组件
// 三个模块：施工工艺、预算支出、进度计划
export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'technology', name: '施工工艺', icon: '🔨' },
    { id: 'budget', name: '预算支出', icon: '💰' },
    { id: 'schedule', name: '进度计划', icon: '📅' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 flex flex-col items-center justify-center transition-colors ${
              activeTab === tab.id
                ? 'text-blue-500 bg-blue-50'
                : 'text-gray-400 active:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
