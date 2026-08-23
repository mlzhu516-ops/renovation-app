// localStorage 存储工具
// 用于保存和读取装修问题数据和预算支出数据

const PROBLEMS_KEY = 'renovation_problems';
const BUDGET_KEY = 'renovation_budget';

function createId() {
  return globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeProblems(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).map(([categoryId, problems]) => [
      categoryId,
      Array.isArray(problems)
        ? problems.filter((problem) => problem && typeof problem === 'object').map((problem) => ({
          ...problem,
          id: String(problem.id || createId()),
          title: typeof problem.title === 'string' ? problem.title : '',
          content: typeof problem.content === 'string' ? problem.content : '',
          solution: typeof problem.solution === 'string' ? problem.solution : '',
          images: Array.isArray(problem.images) ? problem.images : [],
        }))
        : [],
    ]),
  );
}

function normalizeBudgetData(value) {
  const categories = Array.isArray(value?.categories) ? value.categories : [];
  return {
    budget: Math.max(0, finiteNumber(value?.budget)),
    categories: categories
      .filter((category) => category && typeof category === 'object')
      .map((category) => ({
        ...category,
        id: String(category.id || createId()),
        name: typeof category.name === 'string' ? category.name : '未命名分类',
        items: Array.isArray(category.items)
          ? category.items.filter((item) => item && typeof item === 'object').map((item) => ({
            ...item,
            id: String(item.id || createId()),
            title: typeof item.title === 'string' ? item.title : '未命名支出',
            amount: Math.max(0, finiteNumber(item.amount)),
            date: typeof item.date === 'string' ? item.date : '',
          }))
          : [],
      })),
  };
}

function normalizeScheduleData(value) {
  const phases = Array.isArray(value?.phases) ? value.phases : [];
  const tasks = value?.tasks && typeof value.tasks === 'object' && !Array.isArray(value.tasks)
    ? value.tasks
    : {};
  return {
    phases: phases.filter((phase) => phase && typeof phase === 'object').map((phase) => ({
      ...phase,
      id: String(phase.id || createId()),
      category: typeof phase.category === 'string' ? phase.category : 'electrical',
      startDate: typeof phase.startDate === 'string' ? phase.startDate : '',
      endDate: typeof phase.endDate === 'string' ? phase.endDate : '',
    })),
    tasks: Object.fromEntries(
      Object.entries(tasks).map(([date, entries]) => [
        date,
        Array.isArray(entries)
          ? entries.filter((task) => task && typeof task === 'object').map((task) => ({
            ...task,
            id: String(task.id || createId()),
            title: typeof task.title === 'string' ? task.title : '未命名任务',
            description: typeof task.description === 'string' ? task.description : '',
            category: typeof task.category === 'string' ? task.category : 'electrical',
          }))
          : [],
      ]),
    ),
  };
}

// ========== 施工工艺模块 ==========

// 获取所有问题数据
export function getProblems() {
  try {
    const data = localStorage.getItem(PROBLEMS_KEY);
    return data ? normalizeProblems(JSON.parse(data)) : {};
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
  if (!categoryId || !problem || !problem.title?.trim() || !problem.content?.trim()) return false;
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
    problem.id = createId();
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

// ========== 预算支出模块（分类+多笔支出结构）==========

// 获取预算数据
export function getBudgetData() {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    if (data) {
      return normalizeBudgetData(JSON.parse(data));
    }
    // 默认值：支持旧数据结构迁移
    return { budget: 0, categories: [] };
  } catch (error) {
    console.error('读取预算数据失败:', error);
    return { budget: 0, categories: [] };
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
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return false;
  const data = getBudgetData();
  data.budget = Number(amount);
  return saveBudgetData(data);
}

// ========== 分类操作 ==========

// 添加或更新分类
export function saveCategory(category) {
  if (!category || !category.name?.trim()) return false;
  const data = getBudgetData();
  if (!data.categories) {
    data.categories = [];
  }

  if (category.id) {
    // 编辑分类
    const index = data.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      data.categories[index] = category;
    }
  } else {
    // 新增分类
    category.id = createId();
    category.items = [];
    data.categories.push(category);
  }

  return saveBudgetData(data);
}

// 删除分类（同时删除分类下所有支出）
export function deleteCategory(categoryId) {
  const data = getBudgetData();
  if (data.categories) {
    data.categories = data.categories.filter(c => c.id !== categoryId);
    return saveBudgetData(data);
  }
  return false;
}

// ========== 支出条目操作 ==========

// 添加或更新支出条目
export function saveExpenseItem(categoryId, item) {
  const amount = Number(item?.amount);
  if (!item?.title?.trim() || !Number.isFinite(amount) || amount <= 0 || !item.date) return false;
  const data = getBudgetData();
  const category = data.categories?.find(c => c.id === categoryId);

  if (!category) return false;
  item = { ...item, title: item.title.trim(), amount };

  if (!category.items) {
    category.items = [];
  }

  if (item.id) {
    // 编辑条目
    const index = category.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      category.items[index] = item;
    }
  } else {
    // 新增条目
    item.id = createId();
    category.items.push(item);
  }

  return saveBudgetData(data);
}

// 删除支出条目
export function deleteExpenseItem(categoryId, itemId) {
  const data = getBudgetData();
  const category = data.categories?.find(c => c.id === categoryId);

  if (!category || !category.items) return false;

  category.items = category.items.filter(i => i.id !== itemId);
  return saveBudgetData(data);
}

// ========== 计算函数 ==========

// 计算某个分类的总金额
export function calculateCategoryTotal(categoryId) {
  const data = getBudgetData();
  const category = data.categories?.find(c => c.id === categoryId);
  if (!category?.items) return 0;
  return category.items.reduce((sum, item) => sum + finiteNumber(item.amount), 0);
}

// 计算总支出金额
export function calculateTotalExpense() {
  const data = getBudgetData();
  if (!data.categories) return 0;
  return data.categories.reduce((total, cat) => {
    return total + (cat.items?.reduce((sum, item) => sum + finiteNumber(item.amount), 0) || 0);
  }, 0);
}

// 计算分类占比（百分比）
export function calculateCategoryPercent(categoryId) {
  const total = calculateTotalExpense();
  if (total <= 0) return 0;
  const categoryTotal = calculateCategoryTotal(categoryId);
  return (categoryTotal / total) * 100;
}

// ========== 进度计划模块 ==========

const SCHEDULE_KEY = 'renovation_schedule';

// 阶段分类映射（8大施工类别）
export const PHASE_CATEGORIES = [
  { id: 'masonry', name: '砌墙', color: 'bg-orange-500' },
  { id: 'electrical', name: '水电', color: 'bg-yellow-500' },
  { id: 'waterproof', name: '防水', color: 'bg-blue-500' },
  { id: 'tiling', name: '泥工', color: 'bg-gray-500' },
  { id: 'carpentry', name: '木工', color: 'bg-amber-500' },
  { id: 'painting', name: '油工', color: 'bg-pink-500' },
  { id: 'custom', name: '定制', color: 'bg-purple-500' },
  { id: 'furniture', name: '家具', color: 'bg-green-500' },
];

// 获取阶段分类颜色
export function getPhaseColor(categoryId) {
  const cat = PHASE_CATEGORIES.find(c => c.id === categoryId);
  return cat?.color || 'bg-gray-500';
}

// 获取分类名称
export function getCategoryName(categoryId) {
  const cat = PHASE_CATEGORIES.find(c => c.id === categoryId);
  return cat?.name || categoryId;
}

// 获取进度计划数据
export function getScheduleData() {
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    if (data) {
      return normalizeScheduleData(JSON.parse(data));
    }
    // 默认值：phases 数组 + tasks 对象
    return { phases: [], tasks: {} };
  } catch (error) {
    console.error('读取进度数据失败:', error);
    return { phases: [], tasks: {} };
  }
}

// 保存进度计划数据
export function saveScheduleData(data) {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存进度数据失败:', error);
    return false;
  }
}

// ========== 阶段（Phase）操作 ==========

// 添加或更新阶段
export function savePhase(phase) {
  if (!phase?.category || !phase.startDate || !phase.endDate || phase.endDate < phase.startDate) return false;
  const data = getScheduleData();
  if (!data.phases) {
    data.phases = [];
  }

  if (phase.id) {
    // 编辑
    const index = data.phases.findIndex(p => p.id === phase.id);
    if (index !== -1) {
      data.phases[index] = phase;
    }
  } else {
    // 新增
    phase.id = createId();
    data.phases.push(phase);
  }

  return saveScheduleData(data);
}

// 删除阶段
export function deletePhase(phaseId) {
  const data = getScheduleData();
  if (data.phases) {
    data.phases = data.phases.filter(p => p.id !== phaseId);
    return saveScheduleData(data);
  }
  return false;
}

// 计算阶段天数
export function calculatePhaseDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return Number.isFinite(diff) && diff >= 0 ? Math.floor(diff) + 1 : 0;
}

// 计算所有阶段覆盖的实际日历天数，重叠日期只计算一次
export function calculateTotalPhaseDays(phases) {
  const ranges = phases
    .map((phase) => ({
      start: new Date(`${phase.startDate}T00:00:00Z`).getTime(),
      end: new Date(`${phase.endDate}T00:00:00Z`).getTime(),
    }))
    .filter(({ start, end }) => Number.isFinite(start) && Number.isFinite(end) && end >= start)
    .sort((a, b) => a.start - b.start);

  if (ranges.length === 0) return 0;
  const day = 24 * 60 * 60 * 1000;
  let total = 0;
  let current = { ...ranges[0] };

  ranges.slice(1).forEach((range) => {
    if (range.start <= current.end + day) {
      current.end = Math.max(current.end, range.end);
    } else {
      total += Math.floor((current.end - current.start) / day) + 1;
      current = { ...range };
    }
  });

  return total + Math.floor((current.end - current.start) / day) + 1;
}

// ========== 每日任务（Task）操作 ==========

// 获取某一天的任务
export function getTasksByDate(dateStr) {
  const data = getScheduleData();
  return data.tasks?.[dateStr] || [];
}

// 获取所有任务
export function getAllTasks() {
  const data = getScheduleData();
  return data.tasks || {};
}

// 添加或更新任务
export function saveDailyTask(dateStr, task) {
  if (!dateStr || !task?.title?.trim() || !task.category) return false;
  const data = getScheduleData();
  task = { ...task, title: task.title.trim() };
  if (!data.tasks) {
    data.tasks = {};
  }
  if (!data.tasks[dateStr]) {
    data.tasks[dateStr] = [];
  }

  if (task.id) {
    // 编辑
    const index = data.tasks[dateStr].findIndex(t => t.id === task.id);
    if (index !== -1) {
      data.tasks[dateStr][index] = task;
    }
  } else {
    // 新增
    task.id = createId();
    data.tasks[dateStr].push(task);
  }

  return saveScheduleData(data);
}

// 删除任务
export function deleteDailyTask(dateStr, taskId) {
  const data = getScheduleData();
  if (data.tasks?.[dateStr]) {
    data.tasks[dateStr] = data.tasks[dateStr].filter(t => t.id !== taskId);
    return saveScheduleData(data);
  }
  return false;
}
