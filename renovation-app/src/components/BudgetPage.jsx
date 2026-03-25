// BudgetPage - 预算支出模块页面
// 整合预算汇总、支出列表、支出表单
import { useState, useEffect } from 'react';
import BudgetSummary from './BudgetSummary';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import { getBudgetData, setBudget, saveExpense, deleteExpense } from '../utils/storage';

export default function BudgetPage({ onBack }) {
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [budgetData, setBudgetData] = useState({ budget: 0, expenses: [] });
  const [editingExpense, setEditingExpense] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const data = getBudgetData();
    setBudgetData(data);
    setBudgetInput(data.budget.toString());
  }

  // 保存预算金额
  function handleSaveBudget() {
    const amount = Number(budgetInput);
    if (!amount || amount <= 0) {
      alert('请输入有效金额');
      return;
    }
    setBudget(amount);
    loadData();
    setShowBudgetModal(false);
  }

  // 保存支出
  function handleSaveExpense(expenseData) {
    saveExpense(expenseData);
    loadData();
    setView('list');
    setEditingExpense(null);
  }

  // 删除支出
  function handleDeleteExpense(id) {
    if (confirm('确定要删除这笔支出吗？')) {
      deleteExpense(id);
      loadData();
    }
  }

  // 编辑支出
  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setView('form');
  }

  // 新增支出
  function handleAddExpense() {
    setEditingExpense(null);
    setView('form');
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* 顶部状态栏占位 */}
      <div className="h-8 bg-white"></div>

      {/* 顶部导航 */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl"
        >
          <span className="text-xl">‹</span>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-800 text-center pr-10">
          预算支出
        </h1>
      </div>

      {/* 预算金额设置弹窗 */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">设置总预算</h3>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="请输入预算金额"
              className="w-full p-4 bg-gray-50 rounded-xl text-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSaveBudget}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'list' && (
        <>
          <BudgetSummary
            budget={budgetData.budget}
            expenses={budgetData.expenses}
            onEditBudget={() => setShowBudgetModal(true)}
          />
          <ExpenseList
            expenses={budgetData.expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onAdd={handleAddExpense}
          />
        </>
      )}

      {view === 'form' && (
        <ExpenseForm
          expense={editingExpense}
          onBack={() => {
            setView('list');
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
}
