// localStorage 存储工具
// 用于保存和读取装修问题数据和预算支出数据

const PROBLEMS_KEY = 'renovation_problems';
const BUDGET_KEY = 'renovation_budget';

// ========== 施工工艺模块 ==========

// 获取所有问题数据
export function getProblems() {
  try {
    const data = localStorage.getItem(PROBLEMS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('读取数据失败:', error);
    return {};
  }
}

// 保存问题数据
export function saveProblems(problems) {
  try {
    localStorage.setItem(PROBLEMS_KEY, JSON.stringify(problems));
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

// ========== 预算支出模块 ==========

// 获取预算数据
export function getBudgetData() {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // 默认值
    return { budget: 0, expenses: [] };
  } catch (error) {
    console.error('读取预算数据失败:', error);
    return { budget: 0, expenses: [] };
  }
}

// 保存预算数据
export function saveBudgetData(data) {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存预算数据失败:', error);
    return false;
  }
}

// 设置总预算
export function setBudget(amount) {
  const data = getBudgetData();
  data.budget = amount;
  return saveBudgetData(data);
}

// 添加或更新支出
export function saveExpense(expense) {
  const data = getBudgetData();
  if (!data.expenses) {
    data.expenses = [];
  }

  if (expense.id) {
    // 编辑
    const index = data.expenses.findIndex(e => e.id === expense.id);
    if (index !== -1) {
      data.expenses[index] = expense;
    }
  } else {
    // 新增
    expense.id = Date.now().toString();
    data.expenses.push(expense);
  }

  return saveBudgetData(data);
}

// 删除支出
export function deleteExpense(expenseId) {
  const data = getBudgetData();
  if (data.expenses) {
    data.expenses = data.expenses.filter(e => e.id !== expenseId);
    return saveBudgetData(data);
  }
  return false;
}
