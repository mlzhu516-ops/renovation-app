// ExpenseList - 支出列表组件
// 显示支出记录卡片列表，支持编辑、删除
import { EmptyState, FixedBottomButton } from './PageHeader';
import { formatMoney, formatDateShort } from '../utils/formatters';

export default function ExpenseList({ expenses, onEdit, onDelete, onAdd }) {
  // 分类颜色映射
  const categoryColors = {
    '材料': 'bg-blue-100 text-blue-600',
    '人工': 'bg-orange-100 text-orange-600',
    '其他': 'bg-gray-100 text-gray-600',
  };

  // 按日期倒序排列
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="p-4 pt-0 pb-20">
      {/* 支出列表 */}
      {sortedExpenses.length === 0 ? (
        <EmptyState message="暂无支出记录" hint="点击下方按钮添加第一笔支出" />
      ) : (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 支出名称 */}
                  <h3 className="text-lg font-medium text-gray-800 mb-1">
                    {expense.title}
                  </h3>
                  {/* 分类标签 */}
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mb-2 ${
                    categoryColors[expense.category] || categoryColors['其他']
                  }`}>
                    {expense.category}
                  </span>
                  {/* 日期 */}
                  <p className="text-gray-400 text-sm">
                    {formatDateShort(expense.date)}
                  </p>
                </div>
                {/* 金额 */}
                <div className="text-xl font-bold text-gray-800">
                  {formatMoney(expense.amount)}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex border-t border-gray-100 mt-3 pt-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="flex-1 py-2 text-blue-500 font-medium active:bg-blue-50 rounded-lg"
                >
                  编辑
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="flex-1 py-2 text-red-500 font-medium border-l border-gray-100 active:bg-red-50 rounded-lg"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新增按钮 */}
      <FixedBottomButton onClick={onAdd} color="green">
        + 新增支出
      </FixedBottomButton>
    </div>
  );
}
