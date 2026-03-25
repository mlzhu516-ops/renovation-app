// PhaseSelector - 阶段分类选择器组件
// 在拖动选择日期后弹出，选择阶段分类
import { PHASE_CATEGORIES, getPhaseColor, getCategoryName } from '../utils/storage';

export default function PhaseSelector({ startDate, endDate, onConfirm, onCancel }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 计算选择的天数
  const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

  // 确认创建阶段
  function handleConfirm() {
    if (!selectedCategory) {
      alert('请选择一个分类');
      return;
    }
    onConfirm({
      category: selectedCategory,
      startDate,
      endDate,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
          选择阶段分类
        </h3>

        {/* 选择的日期范围 */}
        <p className="text-sm text-gray-500 text-center mb-4">
          {startDate} 至 {endDate}（{days}天）
        </p>

        {/* 分类选择 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {PHASE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg mr-1">
                {cat.id === 'masonry' && '🧱'}
                {cat.id === 'electrical' && '⚡'}
                {cat.id === 'waterproof' && '💧'}
                {cat.id === 'tiling' && '🔨'}
                {cat.id === 'carpentry' && '🪵'}
                {cat.id === 'painting' && '🎨'}
                {cat.id === 'custom' && '📐'}
                {cat.id === 'furniture' && '🛋️'}
              </span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 rounded-xl font-medium"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
