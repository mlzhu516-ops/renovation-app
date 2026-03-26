// PhaseForm - 阶段表单组件
import { useState } from 'react';
import { PHASE_CATEGORIES, calculatePhaseDays } from '../utils/storage';
import { getTodayStr } from '../utils/formatters';
import Input from './Input';
import Button from './Button';
import Card from './Card';

export default function PhaseForm({ phase, onBack, onSave, onDelete }) {
  const isEdit = !!phase;
  const today = getTodayStr();

  const [formData, setFormData] = useState({
    category: phase?.category || 'electrical',
    startDate: phase?.startDate || today,
    endDate: phase?.endDate || today,
  });

  const days = formData.startDate && formData.endDate
    ? calculatePhaseDays(formData.startDate, formData.endDate)
    : 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.endDate < formData.startDate) {
      alert('结束日期不能早于开始日期');
      return;
    }

    onSave({
      id: phase?.id || null,
      ...formData,
    });
  }

  return (
    <div className="px-4 pt-2 pb-24">
      {/* 顶部导航 */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-900 text-center pr-10">
          {isEdit ? '编辑阶段' : '新增阶段'}
        </h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 分类选择 */}
        <div className="animate-slideUp">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            施工阶段
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PHASE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                className={`
                  py-2 px-1 rounded-xl text-xs font-medium transition-all
                  ${formData.category === cat.id
                    ? `${cat.color} text-white shadow-sm`
                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 开始日期 */}
        <div className="animate-slideUp" style={{ animationDelay: '50ms' }}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            开始日期
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 text-base"
          />
        </div>

        {/* 结束日期 */}
        <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            结束日期
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 text-base"
          />
        </div>

        {/* 工期显示 */}
        <Card className="animate-slideUp text-center" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-base font-medium text-gray-700">
              工期：<span className="text-emerald-600 font-bold">{days}</span> 天
            </span>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="space-y-3 pt-2">
          <div className="fixed bottom-20 left-4 right-4 z-40">
            <Button type="submit" className="w-full shadow-lg" size="large">
              保存
            </Button>
          </div>

          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="fixed bottom-36 left-4 right-4 z-40 bg-red-50 text-red-500 py-3 rounded-xl font-medium text-base active:bg-red-100 transition-colors"
            >
              删除阶段
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
