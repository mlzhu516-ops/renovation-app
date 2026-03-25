// TaskForm - 每日任务表单（增强版）
// 支持分类选择（8大施工类别）
import { useState } from 'react';
import { PHASE_CATEGORIES, getPhaseColor } from '../utils/storage';
import { getTodayStr } from '../utils/formatters';

export default function TaskForm({ task, dateStr, onBack, onSave }) {
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'electrical', // 默认水电
  });

  // 处理输入变化
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // 提交表单
  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('请输入任务标题');
      return;
    }

    const taskData = {
      id: task?.id || null,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      updatedAt: Date.now(),
    };

    onSave(taskData);
  }

  return (
    <div className="p-4 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
        >
          <span className="text-xl">‹</span>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-800 text-center pr-10">
          {isEdit ? '编辑任务' : '新增任务'}
        </h1>
      </div>

      {/* 日期显示 */}
      <div className="bg-blue-50 rounded-xl p-3 mb-4 text-center">
        <span className="text-blue-600 font-medium">{dateStr}</span>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 任务标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            任务标题
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="如：水电验收"
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            描述（选填）
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="请输入任务描述"
            rows={3}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg resize-none"
          />
        </div>

        {/* 分类选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            分类
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PHASE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`
                  py-2 px-1 rounded-lg text-xs font-medium transition-all
                  ${formData.category === cat.id
                    ? `${cat.color} text-white scale-105`
                    : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="fixed bottom-20 left-4 right-4 bg-blue-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg active:bg-blue-600"
        >
          保存
        </button>
      </form>
    </div>
  );
}
