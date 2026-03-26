import { useState, useEffect } from 'react';
import { getProblemsByCategory, deleteProblem } from '../utils/storage';
import Card from './Card';
import Button from './Button';

// ProblemList - 问题列表组件
// 展示某个分类下的所有问题，支持新增、编辑、删除
export default function ProblemList({ category, onBack, onAdd, onEdit }) {
  const [problems, setProblems] = useState([]);

  // 加载问题数据
  useEffect(() => {
    loadProblems();
  }, [category]);

  function loadProblems() {
    const data = getProblemsByCategory(category.id);
    setProblems(data);
  }

  // 删除问题
  function handleDelete(problemId) {
    if (confirm('确定要删除这个问题吗？')) {
      deleteProblem(category.id, problemId);
      loadProblems();
    }
  }

  return (
    <div className="px-4 pt-2 pb-24">
      {/* 顶部导航 */}
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-900 text-center pr-10">
          {category.name}
        </h1>
      </div>

      {/* 问题列表 */}
      {problems.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">暂无问题</p>
          <p className="text-sm text-gray-400 mt-1">点击下方按钮添加第一个问题</p>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((problem, index) => (
            <Card
              key={problem.id}
              padding={false}
              className="animate-slideUp overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* 问题内容 */}
              <div
                onClick={() => onEdit(category, problem)}
                className="p-4 cursor-pointer active:bg-gray-50 transition-colors"
              >
                <h3 className="text-base font-medium text-gray-900 mb-1.5">
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {problem.content}
                </p>
                {problem.solution && (
                  <div className="mt-2 flex items-start gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-emerald-600">
                      {problem.solution}
                    </p>
                  </div>
                )}
                {/* 图片预览 - 支持多张 */}
                {problem.images && problem.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {problem.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`图片${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => onEdit(category, problem)}
                  className="flex-1 py-3 text-sm font-medium text-gray-600 active:bg-gray-50 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(problem.id)}
                  className="flex-1 py-3 text-sm font-medium text-red-500 border-l border-gray-100 active:bg-red-50 transition-colors"
                >
                  删除
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 新增按钮 - 固定在底部 */}
      <div className="fixed bottom-24 left-4 right-4 z-40">
        <Button
          onClick={() => onAdd(category)}
          className="w-full shadow-lg"
          size="large"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新增问题
        </Button>
      </div>
    </div>
  );
}
