// Button - iOS风格按钮组件
// 统一按钮样式和点击动效

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = ''
}) {
  // 变体样式
  const variants = {
    primary: 'bg-black text-white active:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 active:bg-gray-200',
    destructive: 'bg-red-500 text-white active:bg-red-600',
    ghost: 'bg-transparent text-gray-600 active:bg-gray-100',
  };

  // 尺寸样式
  const sizes = {
    small: 'h-9 px-3 text-sm',
    medium: 'h-12 px-4 text-base',
    large: 'h-14 px-6 text-lg',
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-150
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}

// IconButton - 图标按钮
export function IconButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center rounded-xl
        bg-gray-100 text-gray-600
        active:scale-95 active:bg-gray-200
        transition-all duration-150
        ${className}
      `}
    >
      {children}
    </button>
  );
}
