// ExpenseForm - 支出表单组件
// 用于新增和编辑支出记录
import { BaseForm } from './BaseForm';
import { getTodayStr } from '../utils/formatters';

export default function ExpenseForm({ expense, onBack, onSave }) {
  // 表单字段配置
  const fields = [
    {
      name: 'title',
      label: '支出名称',
      type: 'text',
      placeholder: '如：瓷砖、人工费',
    },
    {
      name: 'amount',
      label: '金额（元）',
      type: 'number',
      placeholder: '请输入金额',
    },
    {
      name: 'category',
      label: '分类',
      type: 'radio',
      options: ['材料', '人工', '其他'],
    },
    {
      name: 'date',
      label: '日期',
      type: 'date',
    },
  ];

  // 表单验证
  function validate(formData) {
    if (!formData.title?.trim()) {
      return '请输入支出名称';
    }
    const amount = Number(formData.amount);
    if (!amount || amount <= 0) {
      return '请输入有效金额';
    }
    return null;
  }

  // 准备初始数据
  const initialData = {
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || '材料',
    date: expense?.date || getTodayStr(),
  };

  return (
    <BaseForm
      title="支出"
      initialData={initialData}
      onBack={onBack}
      onSave={onSave}
      validate={validate}
      fields={fields}
      submitText="保存"
    />
  );
}