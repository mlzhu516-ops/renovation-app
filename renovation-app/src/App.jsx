import { useState } from 'react';
import CategoryList from './components/CategoryList';
import ProblemList from './components/ProblemList';
import ProblemForm from './components/ProblemForm';
import BottomNav from './components/BottomNav';
import BudgetPage from './components/BudgetPage';
import SchedulePage from './components/SchedulePage';

// App 主组件 - 装修助手
export default function App() {
  // 当前活动模块：'technology' | 'budget' | 'schedule'
  const [activeTab, setActiveTab] = useState('technology');

  // 施工工艺模块状态
  const [techView, setTechView] = useState('category');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);

  // 施工工艺 - 点击分类
  function handleSelectCategory(category) {
    setCurrentCategory(category);
    setTechView('problem');
  }

  // 施工工艺 - 返回分类列表
  function handleBackToCategory() {
    setTechView('category');
    setCurrentCategory(null);
    setCurrentProblem(null);
  }

  // 施工工艺 - 返回问题列表
  function handleBackToProblem() {
    setTechView('problem');
    setCurrentProblem(null);
  }

  // 施工工艺 - 新增问题
  function handleAdd(category) {
    setCurrentCategory(category);
    setCurrentProblem(null);
    setTechView('form');
  }

  // 施工工艺 - 编辑问题
  function handleEdit(category, problem) {
    setCurrentCategory(category);
    setCurrentProblem(problem);
    setTechView('form');
  }

  // 施工工艺 - 保存成功
  function handleSaved() {
    setTechView('problem');
    setCurrentProblem(null);
  }

  // 底部导航切换
  function handleTabChange(tabId) {
    if (tabId === 'technology') {
      setActiveTab(tabId);
    } else if (tabId === 'budget') {
      setActiveTab(tabId);
    } else if (tabId === 'schedule') {
      setActiveTab(tabId);
    }
  }

  // 预算模块返回
  function handleBackFromBudget() {
    setActiveTab('technology');
  }

  // 进度模块返回
  function handleBackFromSchedule() {
    setActiveTab('technology');
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* 状态栏占位 - iPhone刘海屏适配 */}
      <div className="h-8 bg-white"></div>

      {/* 施工工艺模块 */}
      {activeTab === 'technology' && (
        <>
          {techView === 'category' && (
            <CategoryList onSelectCategory={handleSelectCategory} />
          )}

          {techView === 'problem' && currentCategory && (
            <ProblemList
              category={currentCategory}
              onBack={handleBackToCategory}
              onAdd={handleAdd}
              onEdit={handleEdit}
            />
          )}

          {techView === 'form' && currentCategory && (
            <ProblemForm
              category={currentCategory}
              problem={currentProblem}
              onBack={handleBackToProblem}
              onSaved={handleSaved}
            />
          )}
        </>
      )}

      {/* 预算支出模块 */}
      {activeTab === 'budget' && (
        <BudgetPage onBack={handleBackFromBudget} />
      )}

      {/* 进度计划模块 */}
      {activeTab === 'schedule' && (
        <SchedulePage onBack={handleBackFromSchedule} />
      )}

      {/* 底部导航栏 */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
