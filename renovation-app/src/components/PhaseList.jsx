// PhaseList - 阶段列表组件
// 显示所有阶段及其天数，支持编辑、删除
import { getCategoryName, getPhaseColor, calculatePhaseDays, deletePhase } from '../utils/storage';

export default function PhaseList({ phases, onEdit, onDelete, onAdd }) {
  // 按开始日期排序
  const sortedPhases = [...phases].sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  // 计算总工期
  const totalDays = phases.reduce((sum, p) => sum + calculatePhaseDays(p.startDate, p.endDate), 0);

  return (
    <div className="p-4">
      {/* 汇总信息 */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">阶段总数</p>
            <p className="text-2xl font-bold text-gray-800">{phases.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">总工期</p>
            <p className="text-2xl font-bold text-blue-500">{totalDays}天</p>
          </div>
          <button
            onClick={onAdd}
            className="w-12 h-12 bg-blue-500 text-white rounded-full text-2xl flex items-center justify-center shadow-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* 阶段列表 */}
      {sortedPhases.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>暂无阶段规划</p>
          <p className="text-sm mt-1">在日历上拖动选择日期创建</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPhases.map((phase) => {
            const days = calculatePhaseDays(phase.startDate, phase.endDate);
            const color = getPhaseColor(phase.category);

            return (
              <div
                key={phase.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* 阶段信息 */}
                <div className="flex items-center p-4">
                  {/* 颜色标记 */}
                  <div className={`w-3 h-12 rounded-full ${color} mr-3`}></div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {getCategoryName(phase.category)}
                      </h3>
                      <span className="text-sm text-gray-400">({days}天)</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {phase.startDate} ~ {phase.endDate}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(phase)}
                      className="px-3 py-1 text-blue-500 text-sm bg-blue-50 rounded-lg"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这个阶段吗？')) {
                          onDelete(phase.id);
                        }
                      }}
                      className="px-3 py-1 text-red-500 text-sm bg-red-50 rounded-lg"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
