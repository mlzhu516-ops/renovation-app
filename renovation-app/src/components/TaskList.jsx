// TaskList - 每日任务列表
import { getPhaseColor, getCategoryName } from '../utils/storage';
import Card from './Card';
import Button from './Button';

export default function TaskList({ dateStr, tasks, onEdit, onDelete, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-50 z-[60] overflow-y-auto pb-safe">
      {/* 顶部导航 */}
      <div className="flex items-center px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-gray-900">{dateStr}</h1>
          <p className="text-xs text-gray-400">{tasks.length}个任务</p>
        </div>
        <Button onClick={onAdd} size="small" className="rounded-full w-10 h-10 p-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Button>
      </div>

      {/* 任务列表 */}
      <div className="p-4 pb-[calc(100px+env(safe-area-inset-bottom,0px))]">
        {tasks.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">当天暂无任务</p>
            <p className="text-sm text-gray-400 mt-1">点击右上角添加任务</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => {
              const colorClass = getPhaseColor(task.category);

              return (
                <Card
                  key={task.id}
                  padding={false}
                  className="animate-slideUp overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* 任务内容 */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* 分类颜色标记 */}
                      <div className={`w-1 h-10 rounded-full ${colorClass}`} />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-base font-medium text-gray-900">
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
                      className="flex-1 py-3 text-sm font-medium text-gray-600 active:bg-gray-50 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这个任务吗？')) {
                          onDelete(task.id);
                        }
                      }}
                      className="flex-1 py-3 text-sm font-medium text-red-500 border-l border-gray-100 active:bg-red-50 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
