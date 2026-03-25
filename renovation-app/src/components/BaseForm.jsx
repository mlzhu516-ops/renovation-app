// ========== 可复用表单组件 ==========
// 用于支出、任务等表单场景

import { useState, useRef } from 'react';
import { getTodayStr } from '../utils/formatters';
import { FixedBottomButton } from './PageHeader';

/**
 * 通用表单组件
 * 提供标准的表单头部、输入处理和提交逻辑
 *
 * @param {string} title - 页面标题
 * @param {object} initialData - 初始数据（编辑时使用）
 * @param {function} onBack - 返回回调
 * @param {function} onSave - 保存回调
 * @param {function} validate - 自定义验证函数
 * @param {Array} fields - 表单字段配置
 * @param {string} submitText - 提交按钮文字
 */
export function BaseForm({ title, initialData, onBack, onSave, validate, fields, submitText = '保存' }) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {});

  // 处理输入变化
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // 提交表单
  function handleSubmit(e) {
    e.preventDefault();

    // 自定义验证
    if (validate) {
      const error = validate(formData);
      if (error) {
        alert(error);
        return;
      }
    }

    onSave({ ...formData, updatedAt: Date.now() });
  }

  return (
    <div className="p-4 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
        >
          <span className="text-xl">‹</span>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-800 text-center pr-10">
          {isEdit ? `编辑${title}` : `新增${title}`}
        </h1>
      </div>

      {/* 表单字段 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {field.label}
            </label>

            {/* 输入框 */}
            {field.type === 'text' && (
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
              />
            )}

            {/* 数字输入框 */}
            {field.type === 'number' && (
              <input
                type="number"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
              />
            )}

            {/* 文本域 */}
            {field.type === 'textarea' && (
              <textarea
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg resize-none"
              />
            )}

            {/* 日期选择 */}
            {field.type === 'date' && (
              <input
                type="date"
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
              />
            )}

            {/* 单选按钮组 */}
            {field.type === 'radio' && (
              <div className="flex gap-2">
                {field.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, [field.name]: opt }))}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      formData[field.name] === opt
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 提交按钮 */}
        <FixedBottomButton color="green">{submitText}</FixedBottomButton>
      </form>
    </div>
  );
}

/**
 * 图片上传组件
 * 支持多图上传、预览、删除
 */
export function ImageUploader({ images, onChange, maxCount = 9 }) {
  const fileInputRef = useRef(null);

  // 处理图片选择
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxCount) {
      alert(`最多只能上传${maxCount}张图片`);
      return;
    }

    let loadedCount = 0;
    const newImages = [];

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`图片 ${file.name} 大小超过2MB，已跳过`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }

  // 删除图片
  function handleRemoveImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      {/* 图片预览 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`图片${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 上传按钮 */}
      {images.length < maxCount && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-gray-50"
        >
          <span className="text-2xl mb-1">📷</span>
          <span className="text-sm">点击添加图片</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}
