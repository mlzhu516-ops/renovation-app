// TaskForm - 每日任务表单
import { useState } from 'react';
import { PHASE_CATEGORIES } from '../utils/storage';
import Input, { TextArea } from './Input';
import Button from './Button';
import Card from './Card';

export default function TaskForm({ task, dateStr, onBack, onSave }) {
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'electrical',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

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
          {isEdit ? '编辑任务' : '新增任务'}
        </h1>
      </div>

      {/* 日期显示 */}
      <Card className="mb-5 text-center animate-fadeIn">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-sm text-gray-600 font-medium">{dateStr}</span>
        </div>
      </Card>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 任务标题 */}
        <div className="animate-slideUp">
          <Input
            label="任务标题"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="如：水电验收"
          />
        </div>

        {/* 描述 */}
        <div className="animate-slideUp" style={{ animationDelay: '50ms' }}>
          <TextArea
            label="描述（选填）"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="请输入任务描述"
            rows={3}
          />
        </div>

        {/* 分类选择 */}
        <div className="animate-slideUp" style={{ animationDelay: '100ms' }}>
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

        {/* 提交按钮 */}
        <div className="fixed bottom-24 left-4 right-4 z-40 pt-2">
          <Button type="submit" className="w-full shadow-lg" size="large">
            保存
          </Button>
        </div>
      </form>
    </div>
  );
}
