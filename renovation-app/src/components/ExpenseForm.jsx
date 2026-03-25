import { useState } from 'react';

// ExpenseForm - 支出表单组件
// 用于新增和编辑支出记录
export default function ExpenseForm({ expense, onBack, onSave }) {
  const isEdit = !!expense;
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || '材料',
    date: expense?.date || today,
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
      alert('请输入支出名称');
      return;
    }

    const amount = Number(formData.amount);
    if (!amount || amount <= 0) {
      alert('请输入有效金额');
      return;
    }

    const expenseData = {
      id: expense?.id || null,
      title: formData.title.trim(),
      amount: amount,
      category: formData.category,
      date: formData.date,
      updatedAt: Date.now(),
    };

    onSave(expenseData);
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
          {isEdit ? '编辑支出' : '新增支出'}
        </h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 支出名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            支出名称
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="如：瓷砖、人工费"
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
          />
        </div>

        {/* 金额 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            金额（元）
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="请输入金额"
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            分类
          </label>
          <div className="flex gap-2">
            {['材料', '人工', '其他'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  formData.category === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            日期
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="fixed bottom-20 left-4 right-4 bg-green-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg active:bg-green-600"
        >
          保存
        </button>
      </form>
    </div>
  );
}
