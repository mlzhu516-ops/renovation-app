// PhaseList - 阶段列表组件
import { getCategoryName, getPhaseColor, calculatePhaseDays } from '../utils/storage';
import Card from './Card';
import Button from './Button';

export default function PhaseList({ phases, onEdit, onDelete, onAdd }) {
  // 按开始日期排序
  const sortedPhases = [...phases].sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  // 计算总工期
  const totalDays = phases.reduce((sum, p) => sum + calculatePhaseDays(p.startDate, p.endDate), 0);

  return (
    <div className="px-4 pb-24">
      {/* 汇总信息 */}
      <Card className="mb-4 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-400">阶段总数</p>
            <p className="text-2xl font-bold text-gray-900">{phases.length}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-400">总工期</p>
            <p className="text-2xl font-bold text-emerald-600">{totalDays}天</p>
          </div>
          <Button onClick={onAdd} size="small" className="rounded-full w-10 h-10 p-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Button>
        </div>
      </Card>

      {/* 阶段列表 */}
      {sortedPhases.length === 0 ? (
        <div className="text-center py-12 animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">暂无阶段规划</p>
          <p className="text-sm text-gray-400 mt-1">点击上方按钮创建阶段</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedPhases.map((phase, index) => {
            const days = calculatePhaseDays(phase.startDate, phase.endDate);
            const color = getPhaseColor(phase.category);

            return (
              <Card
                key={phase.id}
                padding={false}
                className="animate-slideUp overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 阶段信息 */}
                <div className="flex items-center p-4">
                  {/* 颜色标记 */}
                  <div className={`w-1.5 h-10 rounded-full ${color} mr-3`}></div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-medium text-gray-900">
                        {getCategoryName(phase.category)}
                      </h3>
                      <span className="text-xs text-gray-400">({days}天)</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {phase.startDate} ~ {phase.endDate}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onEdit(phase)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这个阶段吗？')) {
                          onDelete(phase.id);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg active:bg-red-100 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
