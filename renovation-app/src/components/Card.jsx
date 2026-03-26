// Card - iOS风格卡片组件
// 提供统一的卡片样式和交互效果

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  padding = true
}) {
  const baseClasses = `
    bg-white rounded-2xl shadow-sm border border-gray-100
    ${padding ? 'p-4' : ''}
    ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
    ${onClick ? 'cursor-pointer active:scale-[0.98] active:opacity-90 transition-all duration-150' : ''}
  `;

  return (
    <div onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

// CardSection - 卡片内的分组区域
export function CardSection({ title, children, className = '' }) {
  return (
    <div className={className}>
      {title && (
        <h3 className="text-sm font-medium text-gray-500 mb-3 px-1">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// CardItem - 卡片内的列表项
export function CardItem({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0
        ${onClick ? 'cursor-pointer active:bg-gray-50 -mx-4 px-4' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
