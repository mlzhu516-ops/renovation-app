import { useState, useEffect } from 'react';
import { getProblemsByCategory, deleteProblem } from '../utils/storage';

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
    <div className="p-4 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
        >
          <span className="text-xl">‹</span>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-800 text-center pr-10">
          {category.name}
        </h1>
      </div>

      {/* 问题列表 */}
      {problems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">暂无问题</p>
          <p className="text-sm mt-2">点击下方按钮添加第一个问题</p>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* 问题标题 */}
              <div
                onClick={() => onEdit(category, problem)}
                className="p-4 cursor-pointer active:bg-gray-50"
              >
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {problem.title}
                </h3>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                  {problem.content}
                </p>
                {problem.solution && (
                  <p className="text-green-600 text-sm">
                    解决方案: {problem.solution}
                  </p>
                )}
                {/* 图片预览 - 支持多张 */}
                {problem.images && problem.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {problem.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`图片${index + 1}`}
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
                  className="flex-1 py-3 text-blue-500 font-medium active:bg-blue-50"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(problem.id)}
                  className="flex-1 py-3 text-red-500 font-medium border-l border-gray-100 active:bg-red-50"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新增按钮 - 固定在底部 */}
      <button
        onClick={() => onAdd(category)}
        className="fixed bottom-20 left-4 right-4 bg-blue-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg active:bg-blue-600"
      >
        + 新增问题
      </button>
    </div>
  );
}
