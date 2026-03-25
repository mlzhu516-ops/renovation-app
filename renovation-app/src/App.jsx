import { useState } from 'react';
import CategoryList from './components/CategoryList';
import ProblemList from './components/ProblemList';
import ProblemForm from './components/ProblemForm';
import BottomNav from './components/BottomNav';

// App 主组件 - 装修助手施工工艺模块
export default function App() {
  // 页面状态：'category' 分类列表 | 'problem' 问题列表 | 'form' 表单
  const [view, setView] = useState('category');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('technology');

  // 点击分类 - 进入问题列表
  function handleSelectCategory(category) {
    setCurrentCategory(category);
    setView('problem');
  }

  // 返回分类列表
  function handleBackToCategory() {
    setView('category');
    setCurrentCategory(null);
    setCurrentProblem(null);
  }

  // 返回问题列表
  function handleBackToProblem() {
    setView('problem');
    setCurrentProblem(null);
  }

  // 新增问题
  function handleAdd(category) {
    setCurrentCategory(category);
    setCurrentProblem(null);
    setView('form');
  }

  // 编辑问题
  function handleEdit(category, problem) {
    setCurrentCategory(category);
    setCurrentProblem(problem);
    setView('form');
  }

  // 保存成功后返回问题列表
  function handleSaved() {
    setView('problem');
    setCurrentProblem(null);
  }

  // 底部导航切换
  function handleTabChange(tabId) {
    // 目前只做施工工艺，其他模块预留
    if (tabId === 'technology') {
      setActiveTab(tabId);
    } else {
      alert('该模块正在开发中...');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* 状态栏占位 - iPhone刘海屏适配 */}
      <div className="h-8 bg-white"></div>

      {/* 主体内容 */}
      {view === 'category' && (
        <CategoryList onSelectCategory={handleSelectCategory} />
      )}

      {view === 'problem' && currentCategory && (
        <ProblemList
          category={currentCategory}
          onBack={handleBackToCategory}
          onAdd={handleAdd}
          onEdit={handleEdit}
        />
      )}

      {view === 'form' && currentCategory && (
        <ProblemForm
          category={currentCategory}
          problem={currentProblem}
          onBack={handleBackToProblem}
          onSaved={handleSaved}
        />
      )}

      {/* 底部导航栏 */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
