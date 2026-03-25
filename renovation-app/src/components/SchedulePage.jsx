// SchedulePage - 进度计划模块（增强版）
// 整合日历、阶段管理、每日任务
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import PhaseList from './PhaseList';
import PhaseSelector from './PhaseSelector';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import {
  getScheduleData,
  savePhase,
  deletePhase,
  getAllTasks,
  saveDailyTask,
  deleteDailyTask,
  PHASE_CATEGORIES,
  getCategoryName,
  calculatePhaseDays,
} from '../utils/storage';

export default function SchedulePage({ onBack }) {
  // 视图状态：calendar / phaseList / task
  const [view, setView] = useState('calendar');
  const [phases, setPhases] = useState([]);
  const [tasks, setTasks] = useState({});

  // 阶段选择弹窗
  const [showPhaseSelector, setShowPhaseSelector] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  // 任务相关
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const data = getScheduleData();
    setPhases(data.phases || []);
    setTasks(data.tasks || {});
  }

  // ========== 阶段操作 ==========

  // 拖动选择日期范围
  function handleSelectRange(start, end) {
    setSelectedRange({ start, end });
    setShowPhaseSelector(true);
  }

  // 确认创建阶段
  function handleConfirmPhase(phaseData) {
    savePhase(phaseData);
    loadData();
    setShowPhaseSelector(false);
    setSelectedRange({ start: null, end: null });
  }

  // 取消创建阶段
  function handleCancelPhase() {
    setShowPhaseSelector(false);
    setSelectedRange({ start: null, end: null });
  }

  // 删除阶段
  function handleDeletePhase(phaseId) {
    deletePhase(phaseId);
    loadData();
  }

  // 编辑阶段（暂用简单编辑：删除后重新创建）
  function handleEditPhase(phase) {
    if (confirm('将删除此阶段，是否继续？')) {
      deletePhase(phase.id);
      setSelectedRange({ start: phase.startDate, end: phase.endDate });
      setShowPhaseSelector(true);
    }
  }

  // 调整阶段工期（拖动边界）
  function handleUpdatePhase(updatedPhase) {
    savePhase(updatedPhase);
    loadData();
  }

  // ========== 任务操作 ==========

  // 点击日期打开任务列表
  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
    setView('task');
    setEditingTask(null);
  }

  // 关闭任务列表
  function handleCloseTask() {
    setView('calendar');
    setSelectedDate(null);
    setEditingTask(null);
  }

  // 新增任务
  function handleAddTask() {
    setEditingTask(null);
    setView('taskForm');
  }

  // 编辑任务
  function handleEditTask(task) {
    setEditingTask(task);
    setView('taskForm');
  }

  // 保存任务
  function handleSaveTask(taskData) {
    saveDailyTask(selectedDate, taskData);
    loadData();
    setView('task');
    setEditingTask(null);
  }

  // 删除任务
  function handleDeleteTask(taskId) {
    if (confirm('确定删除这个任务吗？')) {
      deleteDailyTask(selectedDate, taskId);
      loadData();
    }
  }

  // ========== 视图切换 ==========
  function handleBackToCalendar() {
    setView('calendar');
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* 顶部状态栏占位 */}
      <div className="h-8 bg-white"></div>

      {/* 顶部标题 - 与施工工艺一致，居中显示 */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100">
        <div className="flex-1"></div>
        <h1 className="text-2xl font-bold text-gray-800">
          进度计划
        </h1>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setView(view === 'phaseList' ? 'calendar' : 'phaseList')}
            className="text-blue-500 text-sm font-medium"
          >
            {view === 'phaseList' ? '日历' : '阶段'}
          </button>
        </div>
      </div>

      {/* 日历视图 */}
      {view === 'calendar' && (
        <div className="p-4">
          <Calendar
            phases={phases}
            tasks={tasks}
            onSelectDate={handleSelectDate}
            onSelectRange={handleSelectRange}
            onUpdatePhase={handleUpdatePhase}
          />
        </div>
      )}

      {/* 阶段列表视图 */}
      {view === 'phaseList' && (
        <PhaseList
          phases={phases}
          onEdit={handleEditPhase}
          onDelete={handleDeletePhase}
          onAdd={() => setView('calendar')}
        />
      )}

      {/* 任务列表视图 */}
      {view === 'task' && selectedDate && (
        <TaskList
          dateStr={selectedDate}
          tasks={tasks[selectedDate] || []}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAdd={handleAddTask}
          onClose={handleCloseTask}
        />
      )}

      {/* 任务表单视图 */}
      {view === 'taskForm' && selectedDate && (
        <TaskForm
          task={editingTask}
          dateStr={selectedDate}
          onBack={() => setView('task')}
          onSave={handleSaveTask}
        />
      )}

      {/* 阶段选择弹窗 */}
      {showPhaseSelector && (
        <PhaseSelector
          startDate={selectedRange.start}
          endDate={selectedRange.end}
          onConfirm={handleConfirmPhase}
          onCancel={handleCancelPhase}
        />
      )}
    </div>
  );
}
