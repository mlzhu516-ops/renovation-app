// Progress - 进度条组件（带动画）
// 统一的进度条样式

export default function Progress({ value, max = 100, color, showLabel = true, className = '' }) {
  const percentage = Math.min((value / max) * 100, 100);

  // 颜色映射
  const colors = {
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    black: 'bg-black',
  };

  const progressColor = colors[color] || colors.black;

  return (
    <div className={className}>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 text-right mt-1">
          {percentage.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

// ProgressRing - 环形进度图（SVG实现）
export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'black',
  showPercent = true,
  children
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // 颜色
  const colors = {
    green: '#10b981',
    yellow: '#eab308',
    orange: '#f97316',
    red: '#ef4444',
    blue: '#3b82f6',
    black: '#000000',
  };

  const progressColor = colors[color] || colors.black;
  const bgColor = '#f3f4f6';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* 进度圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* 中间内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          showPercent && (
            <span className="text-xl font-semibold text-gray-900">
              {percentage.toFixed(0)}%
            </span>
          )
        )}
      </div>
    </div>
  );
}

// ProgressBar - 带标题的进度条
export function ProgressBar({ label, value, max = 100, color, showPercent = true }) {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    black: 'bg-black',
  };

  const progressColor = colors[color] || colors.black;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercent && (
          <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
        )}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
