// Header - iOS风格顶部导航栏
// 毛玻璃效果 + 固定定位

export default function Header({ title, subtitle, rightAction }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* 左侧留空（返回按钮由页面处理） */}
        <div className="w-10"></div>

        {/* 标题区域 */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* 右侧操作 */}
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}

// PageHeader - 页面标题组件（非固定）
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
