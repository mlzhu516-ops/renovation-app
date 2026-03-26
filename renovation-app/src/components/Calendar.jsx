// Calendar - iOS风格日历组件
import { useState } from 'react';
import { formatDateISO } from '../utils/formatters';
import { getPhaseColor } from '../utils/storage';
import Card from './Card';

export default function Calendar({ phases, tasks, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

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

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 bg-gray-50/50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateISO(new Date(year, month, day));
    const phase = getPhaseForDate(dateStr);
    const taskCount = getTaskCountForDate(dateStr);

    let phaseBg = '';
    if (phase) {
      phaseBg = getPhaseColor(phase.category) + '/20';
    }

    days.push(
      <button
        key={day}
        onClick={() => onSelectDate && onSelectDate(dateStr)}
        className={`
          h-16 border border-gray-100/50 relative cursor-pointer select-none
          ${phaseBg || 'bg-white'} active:bg-gray-50
          transition-colors duration-100
        `}
      >
        <span className={`absolute top-1.5 left-2 text-sm font-medium ${phase ? 'text-gray-800' : 'text-gray-700'}`}>
          {day}
        </span>

        {/* 阶段色块 */}
        {phase && (
          <div className={`absolute bottom-0 left-0 right-0 h-2 ${getPhaseColor(phase.category)}`} />
        )}

        {/* 任务标记 */}
        {taskCount > 0 && (
          <div className="absolute bottom-3 right-1 flex gap-0.5">
            {Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            ))}
          </div>
        )}
      </button>
    );
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <Card padding={false} className="overflow-hidden animate-fadeIn">
      {/* 月份切换 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={prevMonth}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="text-lg font-bold text-gray-900">
          {year}年{month + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
        {weekDays.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      <div className="grid grid-cols-7">
        {days}
      </div>
    </Card>
  );
}
