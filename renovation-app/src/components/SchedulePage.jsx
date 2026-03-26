// SchedulePage - 进度计划模块
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import PhaseList from './PhaseList';
import PhaseForm from './PhaseForm';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import {
  getScheduleData,
  savePhase,
  deletePhase,
  saveDailyTask,
  deleteDailyTask,
} from '../utils/storage';

export default function SchedulePage({ onBack }) {
  // 视图状态：calendar / phaseList / phaseForm / task / taskForm
  const [view, setView] = useState('calendar');
  const [phases, setPhases] = useState([]);
  const [tasks, setTasks] = useState({});
  const [editingPhase, setEditingPhase] = useState(null);

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

  function handleAddPhase() {
    setEditingPhase(null);
    setView('phaseForm');
  }

  function handleEditPhase(phase) {
    setEditingPhase(phase);
    setView('phaseForm');
  }

  function handleSavePhase(phaseData) {
    savePhase(phaseData);
    loadData();
    setView('phaseList');
    setEditingPhase(null);
  }

  function handleDeletePhase(phaseId) {
    if (confirm('确定删除这个阶段吗？')) {
      deletePhase(phaseId);
      loadData();
      setView('phaseList');
      setEditingPhase(null);
    }
  }

  function handleDeleteFromForm(phaseId) {
    handleDeletePhase(phaseId);
  }

  // ========== 任务操作 ==========

  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
    setView('task');
    setEditingTask(null);
  }

  function handleSelectRange(start, end) {
    alert(`已选择 ${start} 至 ${end}，请在阶段列表中创建`);
  }

  function handleCloseTask() {
    setView('calendar');
    setSelectedDate(null);
    setEditingTask(null);
  }

  function handleAddTask() {
    setEditingTask(null);
    setView('taskForm');
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setView('taskForm');
  }

  function handleSaveTask(taskData) {
    saveDailyTask(selectedDate, taskData);
    loadData();
    setView('task');
    setEditingTask(null);
  }

  function handleDeleteTask(taskId) {
    if (confirm('确定删除这个任务吗？')) {
      deleteDailyTask(selectedDate, taskId);
      loadData();
    }
  }

  function handleUpdatePhase(updatedPhase) {
    savePhase(updatedPhase);
    loadData();
  }

  return (
    <div className="pb-20">
      {/* 页面标题 */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">进度计划</h1>
            <p className="text-sm text-gray-400 mt-1">规划你的装修进度</p>
          </div>
          <button
            onClick={() => setView(view === 'phaseList' ? 'calendar' : 'phaseList')}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
          >
            {view === 'phaseList' ? '日历' : '阶段'}
          </button>
        </div>
      </div>

      {/* 日历视图 */}
      {view === 'calendar' && (
        <div className="px-4">
          <Calendar phases={phases} tasks={tasks} onSelectDate={handleSelectDate} />
        </div>
      )}

      {/* 阶段列表视图 */}
      {view === 'phaseList' && (
        <PhaseList
          phases={phases}
          onEdit={handleEditPhase}
          onDelete={handleDeletePhase}
          onAdd={handleAddPhase}
        />
      )}

      {/* 阶段表单视图 */}
      {view === 'phaseForm' && (
        <PhaseForm
          phase={editingPhase}
          onBack={() => setView('phaseList')}
          onSave={handleSavePhase}
          onDelete={editingPhase ? () => handleDeleteFromForm(editingPhase.id) : null}
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
    </div>
  );
}
