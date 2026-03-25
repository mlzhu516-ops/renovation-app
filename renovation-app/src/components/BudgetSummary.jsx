// BudgetSummary - 预算汇总组件
// 显示总预算、已支出、剩余金额、进度条
import { formatMoney } from '../utils/formatters';

export default function BudgetSummary({ budget, expenses, onEditBudget }) {
  // 计算已支出总额
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  // 计算剩余金额
  const remaining = budget - totalSpent;
  // 计算进度百分比
  const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  // 进度条颜色：根据进度变化
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-4">
      {/* 预算卡片 */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        {/* 总预算 - 可编辑 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-500">总预算</span>
          <button
            onClick={onEditBudget}
            className="text-blue-500 text-sm font-medium"
          >
            修改
          </button>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-4">
          {formatMoney(budget)}
        </div>

        {/* 已花费 / 剩余 */}
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">已花费</span>
          <span className="text-gray-800 font-medium">{formatMoney(totalSpent)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-500">剩余</span>
          <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatMoney(remaining)}
          </span>
        </div>

        {/* 进度条 */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right text-sm text-gray-400 mt-1">
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
