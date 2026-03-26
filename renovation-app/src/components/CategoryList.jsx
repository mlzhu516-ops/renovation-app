import categories from '../data/categories';
import Card from './Card';

// CategoryList - 分类列表组件
// 展示8个施工工艺分类卡片，点击进入问题列表
export default function CategoryList({ onSelectCategory }) {
  return (
    <div className="px-4 pt-2 pb-6">
      {/* 页面标题 */}
      <div className="mb-5 px-1">
        <h1 className="text-2xl font-bold text-gray-900">
          施工工艺
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          点击分类查看工艺要点
        </p>
      </div>

      {/* 分类卡片列表 */}
      <div className="space-y-3">
        {categories.map((category, index) => (
          <Card
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className="animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center">
              {/* 图标 */}
              <div className={`w-11 h-11 rounded-xl ${category.color} flex items-center justify-center text-xl shadow-sm`}>
                {category.icon}
              </div>

              {/* 分类名称 */}
              <div className="flex-1 ml-3">
                <span className="text-base font-medium text-gray-900">
                  {category.name}
                </span>
              </div>

              {/* 箭头指示器 */}
              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
