// ========== 共享组件 ==========
// 提供页面通用的基础组件

/**
 * 页面头部组件
 * 包含返回按钮、标题和可选的操作按钮
 */
export function PageHeader({ title, onBack, onAction, actionIcon }) {
  return (
    <div className="flex items-center p-4 bg-white border-b border-gray-100">
      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl active:bg-gray-200"
      >
        <span className="text-xl">‹</span>
      </button>
      <h1 className="flex-1 text-xl font-bold text-gray-800 text-center pr-10">
        {title}
      </h1>
      {onAction && (
        <button
          onClick={onAction}
          className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-xl active:bg-blue-600"
        >
          <span className="text-xl">{actionIcon || '+'}</span>
        </button>
      )}
    </div>
  );
}

/**
 * 空状态组件
 * 当列表为空时显示
 */
export function EmptyState({ message, hint }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-lg">{message}</p>
      {hint && <p className="text-sm mt-2">{hint}</p>}
    </div>
  );
}

/**
 * 操作按钮组组件
 * 包含编辑和删除按钮
 */
export function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex border-t border-gray-100">
      <button
        onClick={onEdit}
        className="flex-1 py-2 text-blue-500 font-medium active:bg-blue-50 rounded-lg"
      >
        编辑
      </button>
      <button
        onClick={onDelete}
        className="flex-1 py-2 text-red-500 font-medium border-l border-gray-100 active:bg-red-50 rounded-lg"
      >
        删除
      </button>
    </div>
  );
}

/**
 * 固定底部按钮组件
 */
export function FixedBottomButton({ children, onClick, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500 active:bg-blue-600',
    green: 'bg-green-500 active:bg-green-600',
  };
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 left-4 right-4 ${colors[color]} text-white py-4 rounded-xl font-medium text-lg shadow-lg`}
    >
      {children}
    </button>
  );
}
