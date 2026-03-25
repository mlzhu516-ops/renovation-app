// Calendar - 日历组件（增强版）
// 支持：点击日期、拖动选区、阶段色块渲染、拖动调整阶段、任务标记
import { useState, useRef } from 'react';
import { formatDateISO } from '../utils/formatters';
import { getPhaseColor } from '../utils/storage';

export default function Calendar({
  phases,
  tasks,
  onSelectDate,
  onSelectRange,
  onUpdatePhase,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 拖动选择状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);

  // 阶段调整拖动状态
  const [isResizing, setIsResizing] = useState(false);
  const [resizeTarget, setResizeTarget] = useState(null);
  const [resizePreview, setResizePreview] = useState(null);

  // 点击状态（用于区分点击和拖动）
  const [clickStart, setClickStart] = useState(null);

  const calendarRef = useRef(null);

  // 获取当前月份信息
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月天数和第一天星期
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // 上个月切换
  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  // 下个月切换
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // 获取某天的阶段
  function getPhaseForDate(dateStr) {
    return phases.find(p => dateStr >= p.startDate && dateStr <= p.endDate);
  }

  // 获取某天的任务数量
  function getTaskCountForDate(dateStr) {
    return tasks[dateStr]?.length || 0;
  }

  // ========== 拖动/点击处理（支持鼠标和触摸） ==========

  function handleMouseDown(dateStr) {
    if (isResizing) return;
    setIsDragging(true);
    setDragStart(dateStr);
    setDragEnd(dateStr);
  }

  function handleMouseMove(e, dateStr) {
    if (isResizing && resizeTarget) {
      setResizePreview(dateStr);
      return;
    }

    if (!isDragging || !dragStart) return;

    const start = dragStart <= dateStr ? dragStart : dateStr;
    const end = dragStart <= dateStr ? dateStr : dragStart;
    setDragStart(start);
    setDragEnd(end);
  }

  function handleMouseUp() {
    handleDragEnd();
  }

  // 统一处理拖动结束逻辑
  function handleDragEnd() {
    // 处理阶段调整
    if (isResizing && resizeTarget && resizePreview) {
      const phase = phases.find(p => p.id === resizeTarget.phaseId);
      if (phase) {
        const updatedPhase = { ...phase };
        if (resizeTarget.edge === 'left') {
          updatedPhase.startDate = resizePreview;
        } else {
          updatedPhase.endDate = resizePreview;
        }
        if (updatedPhase.startDate <= updatedPhase.endDate) {
          onUpdatePhase(updatedPhase);
        }
      }
      setIsResizing(false);
      setResizeTarget(null);
      setResizePreview(null);
      return;
    }

    // 完成拖动选择（多天）
    if (isDragging && dragStart && dragEnd) {
      const start = dragStart <= dragEnd ? dragStart : dragEnd;
      const end = dragStart <= dragEnd ? dragEnd : dragStart;
      const days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1;

      if (days > 1) {
        onSelectRange(start, end);
      } else {
        onSelectDate(start);
      }
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }

  // ========== 触摸事件处理 ==========
  function handleTouchStart(e, dateStr) {
    e.preventDefault(); // 防止滚动
    if (isResizing) return;
    setIsDragging(true);
    setDragStart(dateStr);
    setDragEnd(dateStr);
  }

  function handleTouchMove(e) {
    if (!isDragging || !dragStart) return;
    e.preventDefault();

    // 获取触摸位置
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // 找到对应的日期格子
    const dayCell = element?.closest('[data-date]');
    if (dayCell) {
      const dateStr = dayCell.getAttribute('data-date');
      if (dateStr) {
        const start = dragStart <= dateStr ? dragStart : dateStr;
        const end = dragStart <= dateStr ? dateStr : dragStart;
        setDragStart(start);
        setDragEnd(end);
      }
    }
  }

  function handleTouchEnd(e) {
    e.preventDefault();
    handleDragEnd();
  }

  function handleMouseLeave() {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    }
  }

  // ========== 阶段调整拖动处理 ==========

  function handleResizeStart(e, phase, edge) {
    e.stopPropagation(); // 防止触发日期选择
    setIsResizing(true);
    setResizeTarget({ phaseId: phase.id, edge });
  }

  // ========== 生成日历格子 ==========
  const days = [];

  // 填充空白
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 bg-gray-50"></div>);
  }

  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateISO(new Date(year, month, day));
    const phase = getPhaseForDate(dateStr);
    const taskCount = getTaskCountForDate(dateStr);

    // 计算拖动选择范围
    const isInDragRange = isDragging && dragStart && dragEnd &&
      dateStr >= Math.min(dragStart, dragEnd) &&
      dateStr <= Math.max(dragStart, dragEnd);

    // 计算阶段调整预览
    let isInResizePreview = false;
    if (isResizing && resizePreview && resizeTarget) {
      const phase = phases.find(p => p.id === resizeTarget.phaseId);
      if (phase) {
        if (resizeTarget.edge === 'left') {
          isInResizePreview = dateStr >= resizePreview && dateStr <= phase.endDate;
        } else {
          isInResizePreview = dateStr >= phase.startDate && dateStr <= resizePreview;
        }
      }
    }

    // 阶段背景色
    let phaseBg = '';
    if (phase) {
      phaseBg = getPhaseColor(phase.category) + '/20';
    }

    days.push(
      <div
        key={day}
        ref={calendarRef}
        data-date={dateStr}
        onMouseDown={() => handleMouseDown(dateStr)}
        onMouseMove={(e) => handleMouseMove(e, dateStr)}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => isDragging && handleMouseMove(null, dateStr)}
        onTouchStart={(e) => handleTouchStart(e, dateStr)}
        className={`
          h-16 border border-gray-100 relative cursor-pointer select-none
          transition-colors duration-75
          ${isInDragRange ? 'bg-blue-200' : isInResizePreview ? 'bg-blue-100' : phaseBg || 'bg-white'}
          active:bg-gray-50
        `}
      >
        {/* 日期数字 */}
        <span className={`
          absolute top-1 left-2 text-sm font-medium
          ${phase ? 'text-gray-800' : 'text-gray-700'}
        `}>
          {day}
        </span>

        {/* 阶段色块 - 整体背景 */}
        {phase && (
          <div className={`absolute inset-x-0 bottom-0 h-2 ${getPhaseColor(phase.category)}`} />
        )}

        {/* 阶段调整柄 - 左边界 */}
        {phase && dateStr === phase.startDate && (
          <div
            className="absolute left-0 top-0 bottom-2 w-2 cursor-ew-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, phase, 'left')}
          >
            <div className={`w-1 h-full ${getPhaseColor(phase.category)} opacity-50 hover:opacity-100`} />
          </div>
        )}

        {/* 阶段调整柄 - 右边界 */}
        {phase && dateStr === phase.endDate && (
          <div
            className="absolute right-0 top-0 bottom-2 w-2 cursor-ew-resize z-10"
            onMouseDown={(e) => handleResizeStart(e, phase, 'right')}
          >
            <div className={`w-1 h-full ml-auto ${getPhaseColor(phase.category)} opacity-50 hover:opacity-100`} />
          </div>
        )}

        {/* 任务数量标记 */}
        {taskCount > 0 && (
          <div className="absolute bottom-3 right-1 flex gap-0.5">
            {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 星期标题
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* 月份切换 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={prevMonth}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl active:bg-gray-200"
        >
          <span className="text-xl">‹</span>
        </button>
        <span className="text-lg font-bold text-gray-800">
          {year}年{month + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl active:bg-gray-200"
        >
          <span className="text-xl">›</span>
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {weekDays.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 - 添加触摸事件 */}
      <div
        className="grid grid-cols-7"
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {days}
      </div>

      {/* 提示 */}
      <div className="p-3 border-t border-gray-100 text-center text-xs text-gray-400 space-y-1">
        <p>💡 拖动选择日期创建阶段</p>
        <p>🔧 拖动阶段边缘调整工期</p>
        <p>📋 点击日期查看当天任务</p>
      </div>
    </div>
  );
}
