// CategoryExpenseList - 分类支出列表组件
// 支持分类管理、分类内支出、占比显示
import { useState, useEffect } from 'react';
import { formatMoney } from '../utils/formatters';
import {
  getBudgetData,
  saveCategory,
  deleteCategory,
  saveExpenseItem,
  deleteExpenseItem,
  calculateCategoryTotal,
  calculateTotalExpense,
  calculateCategoryPercent,
} from '../utils/storage';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Progress from './Progress';

export default function CategoryExpenseList({ onBack }) {
  const [budgetData, setBudgetData] = useState({ budget: 0, categories: [] });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const data = getBudgetData();
    setBudgetData(data);
    setBudgetInput(data.budget?.toString() || '');
  }

  // 计算总支出
  const totalExpense = calculateTotalExpense();
  const remaining = budgetData.budget - totalExpense;
  const percent = budgetData.budget > 0 ? (totalExpense / budgetData.budget) * 100 : 0;

  // 添加分类
  function handleAddCategory() {
    if (!newCategoryName.trim()) {
      alert('请输入分类名称');
      return;
    }
    saveCategory({ name: newCategoryName.trim() });
    setNewCategoryName('');
    setShowAddCategory(false);
    loadData();
  }

  // 删除分类
  function handleDeleteCategory(catId) {
    if (confirm('确定删除该分类及其所有支出吗？')) {
      deleteCategory(catId);
      loadData();
    }
  }

  // 保存总预算
  function handleSaveBudget() {
    const amount = Number(budgetInput);
    if (!amount || amount <= 0) {
      alert('请输入有效金额');
      return;
    }
    const data = getBudgetData();
    data.budget = amount;
    // 保持categories结构
    if (!data.categories) data.categories = [];
    localStorage.setItem('renovation_budget', JSON.stringify(data));
    loadData();
    setShowBudgetModal(false);
  }

  // 进度条颜色
  const progressColor = percent >= 90 ? 'red' : percent >= 70 ? 'orange' : 'green';

  return (
    <div className="pb-20">
      {/* 页面标题 */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">预算支出</h1>
            <p className="text-sm text-gray-400 mt-1">管理你的装修预算</p>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="text-sm font-medium text-gray-500 active:text-gray-700"
          >
            修改预算
          </button>
        </div>
      </div>

      {/* 预算汇总卡片 */}
      <div className="px-4 mb-4">
        <Card className="animate-fadeIn">
          {/* 金额汇总 */}
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm text-gray-500">总预算</span>
            <span className="text-3xl font-bold text-gray-900">
              {formatMoney(budgetData.budget || 0)}
            </span>
          </div>

          {/* 已花费 / 剩余 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">已花费</p>
              <p className="text-lg font-semibold text-gray-800">{formatMoney(totalExpense)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">剩余</p>
              <p className={`text-lg font-semibold ${remaining < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                {formatMoney(remaining)}
              </p>
            </div>
          </div>

          {/* 进度条 */}
          {budgetData.budget > 0 && (
            <Progress value={totalExpense} max={budgetData.budget} color={progressColor} />
          )}
        </Card>
      </div>

      {/* 分类列表 */}
      <div className="px-4 space-y-3">
        {budgetData.categories?.length === 0 ? (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">暂无分类</p>
            <p className="text-sm text-gray-400 mt-1">点击下方添加第一个分类</p>
          </div>
        ) : (
          budgetData.categories?.map((category, index) => {
            const categoryTotal = calculateCategoryTotal(category.id);
            const catPercent = calculateCategoryPercent(category.id);
            const isExpanded = expandedCategory === category.id;

            return (
              <Card
                key={category.id}
                padding={false}
                className="animate-slideUp overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 分类标题（点击展开） */}
                <div
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className="p-4 cursor-pointer active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">
                        {formatMoney(categoryTotal)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* 占比进度条 */}
                  <Progress value={catPercent} color="blue" showLabel={false} />

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="text-xs text-red-400 hover:text-red-500 mt-2 transition-colors"
                  >
                    删除分类
                  </button>
                </div>

                {/* 展开的支出列表 */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 space-y-2 animate-slideUp">
                    {category.items?.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-3">暂无支出</p>
                    ) : (
                      category.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
                          <div>
                            <p className="text-sm text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-800">{formatMoney(item.amount)}</span>
                            <button
                              onClick={() => {
                                if (confirm('确定删除该支出吗？')) {
                                  deleteExpenseItem(category.id, item.id);
                                  loadData();
                                }
                              }}
                              className="text-xs text-red-500 active:text-red-600"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))
                    )}

                    {/* 新增支出按钮 */}
                    <ExpenseItemForm
                      categoryId={category.id}
                      onSave={() => loadData()}
                    />
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* 新增分类按钮 */}
      <div className="fixed bottom-[calc(80px+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40">
        {showAddCategory ? (
          <Card className="shadow-xl">
            <div className="space-y-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="输入分类名称，如：地板、门"
                className="w-full h-12 px-4 bg-gray-50 rounded-xl text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowAddCategory(false)} className="flex-1">
                  取消
                </Button>
                <Button onClick={handleAddCategory} className="flex-1">
                  确定
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Button onClick={() => setShowAddCategory(true)} className="w-full shadow-lg" size="large">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            新增分类
          </Button>
        )}
      </div>

      {/* 预算设置弹窗 */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <Card className="w-full max-w-sm animate-scaleIn">
            <h3 className="text-lg font-bold text-gray-900 mb-4">设置总预算</h3>
            <Input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="请输入预算金额"
            />
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" onClick={() => setShowBudgetModal(false)} className="flex-1">
                取消
              </Button>
              <Button onClick={handleSaveBudget} className="flex-1">
                确定
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// 支出条目表单（内嵌组件）
function ExpenseItemForm({ categoryId, onSave }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !amount) {
      alert('请填写完整信息');
      return;
    }
    saveExpenseItem(categoryId, {
      title: title.trim(),
      amount: Number(amount),
      date,
    });
    setTitle('');
    setAmount('');
    setShowForm(false);
    onSave();
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-2.5 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl active:bg-gray-50 active:border-gray-300 transition-colors"
      >
        + 添加支出
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-gray-100 animate-slideUp">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="支出名称（定金/尾款等）"
        className="w-full h-10 px-3 bg-gray-50 rounded-xl text-sm"
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="金额"
          className="flex-1 h-10 px-3 bg-gray-50 rounded-xl text-sm"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 px-3 bg-gray-50 rounded-xl text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium active:bg-gray-800"
        >
          保存
        </button>
      </div>
    </form>
  );
}
