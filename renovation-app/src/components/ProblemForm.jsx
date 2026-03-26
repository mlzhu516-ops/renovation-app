import { useState, useRef } from 'react';
import { saveProblem } from '../utils/storage';
import Input, { TextArea } from './Input';
import Button from './Button';

// ProblemForm - 问题表单组件
// 用于新增和编辑问题，包含图片上传（转Base64，支持多张）
export default function ProblemForm({ category, problem, onBack, onSaved }) {
  const isEdit = !!problem;
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    content: problem?.content || '',
    solution: problem?.solution || '',
    images: problem?.images || [],
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // 处理输入变化
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // 图片转Base64 - 支持多张
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // 限制最多9张图片
    if (formData.images.length + files.length > 9) {
      alert('最多只能上传9张图片');
      return;
    }

    setUploading(true);
    let loadedCount = 0;
    const newImages = [];

    files.forEach((file) => {
      // 限制单张图片大小 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert(`图片 ${file.name} 大小超过2MB，已跳过`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
          setUploading(false);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });

    // 清空input以便重复选择同一张图片
    e.target.value = '';
  }

  // 删除单张图片
  function handleRemoveImage(index) {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }

  // 提交表单
  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('请输入问题标题');
      return;
    }

    if (!formData.content.trim()) {
      alert('请输入问题内容');
      return;
    }

    const problemData = {
      id: problem?.id || null,
      title: formData.title.trim(),
      content: formData.content.trim(),
      solution: formData.solution.trim(),
      images: formData.images,
      updatedAt: Date.now(),
    };

    if (saveProblem(category.id, problemData)) {
      onSaved();
    } else {
      alert('保存失败，请重试');
    }
  }

  return (
    <div className="px-4 pt-2 pb-24">
      {/* 顶部导航 */}
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-1 text-xl font-bold text-gray-900 text-center pr-10">
          {isEdit ? '编辑问题' : '新增问题'}
        </h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 标题 */}
        <Input
          label="问题标题"
          value={formData.title}
          onChange={handleChange}
          name="title"
          placeholder="请输入问题标题"
        />

        {/* 问题内容 */}
        <TextArea
          label="问题内容"
          value={formData.content}
          onChange={handleChange}
          name="content"
          placeholder="请详细描述问题"
          rows={4}
        />

        {/* 解决方案 */}
        <TextArea
          label="解决方案"
          value={formData.solution}
          onChange={handleChange}
          name="solution"
          placeholder="请输入解决方案（选填）"
          rows={3}
        />

        {/* 多图上传 */}
        <div className="animate-fadeIn">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            上传图片（选填，最多9张）
          </label>

          {/* 图片网格预览 */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {formData.images.map((img, index) => (
                <div key={index} className="relative animate-scaleIn">
                  <img
                    src={img}
                    alt={`图片${index + 1}`}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 上传按钮 - 少于9张时显示 */}
          {formData.images.length < 9 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-gray-50 active:border-gray-300 transition-colors cursor-pointer"
            >
              {uploading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">上传中...</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span className="text-sm">点击添加图片</span>
                </>
              )}
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

        {/* 提交按钮 */}
        <div className="fixed bottom-[calc(80px+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40 pt-2">
          <Button type="submit" className="w-full shadow-lg" size="large">
            保存
          </Button>
        </div>
      </form>
    </div>
  );
}
