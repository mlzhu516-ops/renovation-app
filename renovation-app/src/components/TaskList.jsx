// TaskList - 每日任务列表（增强版）
// 显示某天的所有任务，支持新增、编辑、删除
import { formatDateShort } from '../utils/formatters';
import { getPhaseColor, PHASE_CATEGORIES, getCategoryName } from '../utils/storage';

export default function TaskList({ dateStr, tasks, onEdit, onDelete, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-100 z-40 overflow-y-auto">
      {/* 顶部导航 */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl"
        >
          <span className="text-xl">‹</span>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-gray-800">{dateStr}</h1>
          <p className="text-sm text-gray-400">{tasks.length}个任务</p>
        </div>
        <button
          onClick={onAdd}
          className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-xl"
        >
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* 任务列表 */}
      <div className="p-4 pb-24">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">当天暂无任务</p>
            <p className="text-sm mt-2">点击右上角添加任务</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const colorClass = getPhaseColor(task.category);

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* 任务内容 */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* 分类颜色标记 */}
                      <div className={`w-1 h-12 rounded-full ${colorClass}`} />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-800">
                            {task.title}
                          </h3>
                        </div>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${colorClass}/20 ${colorClass.replace('bg-', 'text-')}`}>
                          {getCategoryName(task.category)}
                        </span>
                        {task.description && (
                          <p className="text-gray-500 text-sm mt-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex border-t border-gray-100">
                    <button
                      onClick={() => onEdit(task)}
                      className="flex-1 py-3 text-blue-500 font-medium active:bg-blue-50"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这个任务吗？')) {
                          onDelete(task.id);
                        }
                      }}
                      className="flex-1 py-3 text-red-500 font-medium border-l border-gray-100 active:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
