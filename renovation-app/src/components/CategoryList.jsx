import categories from '../data/categories';

// CategoryList - 分类列表组件
// 展示8个施工工艺分类卡片，点击进入问题列表
export default function CategoryList({ onSelectCategory }) {
  return (
    <div className="p-4">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        施工工艺
      </h1>

      {/* 分类卡片网格 - 单列布局，手机端适配 */}
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="w-full flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-[0.98] active:bg-gray-50"
          >
            {/* 图标 */}
            <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl`}>
              {category.icon}
            </div>

            {/* 分类名称 */}
            <span className="flex-1 text-left text-lg font-medium text-gray-700 ml-4">
              {category.name}
            </span>

            {/* 箭头指示器 */}
            <span className="text-gray-400 text-xl">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
