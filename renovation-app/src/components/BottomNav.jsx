// BottomNav - iOS风格底部导航栏
// 毛玻璃效果 + 圆角 + 优雅动效
export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'technology',
      name: '工艺',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.072-5.072a2.1 2.1 0 012.04-3.462h6.164a2.1 2.1 0 012.04 3.462l-5.072 5.072a3.6 3.6 0 01-5.124 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 12v3M2 12h3m12 0h3" />
        </svg>
      )
    },
    {
      id: 'budget',
      name: '预算',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'schedule',
      name: '进度',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-gray-200/50 safe-area-bottom">
      {/* 顶部高光线条 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full opacity-50" />

      <div className="flex">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex-1 py-2.5 pb-5 flex flex-col items-center justify-center gap-0.5
                transition-all duration-200
                ${isActive ? 'scale-105' : 'opacity-70 active:opacity-100'}
              `}
            >
              {/* 图标容器 */}
              <div className={`
                transition-transform duration-200
                ${isActive ? 'text-black' : 'text-gray-400'}
              `}>
                {tab.icon}
              </div>

              {/* 标签文字 */}
              <span className={`
                text-[10px] font-medium transition-colors duration-200
                ${isActive ? 'text-black' : 'text-gray-400'}
              `}>
                {tab.name}
              </span>

              {/* 选中指示点 */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
