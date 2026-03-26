// Input - iOS风格输入框组件
// 统一的输入框样式

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 px-4 bg-gray-50 rounded-xl
          border border-gray-200 text-base text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-300
          transition-all duration-150
          ${error ? 'border-red-300 focus:ring-red-200' : ''}
        `}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

// TextArea - 多行输入框
export function TextArea({
  value,
  onChange,
  placeholder,
  label,
  rows = 3,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-3 bg-gray-50 rounded-xl
          border border-gray-200 text-base text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-gray-300
          transition-all duration-150 resize-none
        `}
      />
    </div>
  );
}

// Select - 选择按钮组
export function Select({
  options,
  value,
  onChange,
  label,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              px-4 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-150 active:scale-95
              ${value === opt.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
