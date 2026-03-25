// localStorage 存储工具
// 用于保存和读取装修问题数据

const STORAGE_KEY = 'renovation_problems';

// 获取所有问题数据
export function getProblems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取数据失败:', error);
    return {};
  }
}

// 保存问题数据
export function saveProblems(problems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// 获取某个分类的问题列表
export function getProblemsByCategory(categoryId) {
  const problems = getProblems();
  return problems[categoryId] || [];
}

// 添加或更新问题
export function saveProblem(categoryId, problem) {
  const problems = getProblems();
  if (!problems[categoryId]) {
    problems[categoryId] = [];
  }

  // 如果有id说明是编辑，否则是新增
  if (problem.id) {
    const index = problems[categoryId].findIndex(p => p.id === problem.id);
    if (index !== -1) {
      problems[categoryId][index] = problem;
    }
  } else {
    // 生成唯一id
    problem.id = Date.now().toString();
    problems[categoryId].push(problem);
  }

  return saveProblems(problems);
}

// 删除问题
export function deleteProblem(categoryId, problemId) {
  const problems = getProblems();
  if (problems[categoryId]) {
    problems[categoryId] = problems[categoryId].filter(p => p.id !== problemId);
    return saveProblems(problems);
  }
  return false;
}
