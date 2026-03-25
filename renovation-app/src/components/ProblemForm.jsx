import { useState, useRef } from 'react';
import { saveProblem } from '../utils/storage';

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
          {isEdit ? '编辑问题' : '新增问题'}
        </h1>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            问题标题
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="请输入问题标题"
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg"
          />
        </div>

        {/* 问题内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            问题内容
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="请详细描述问题"
            rows={4}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg resize-none"
          />
        </div>

        {/* 解决方案 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            解决方案
          </label>
          <textarea
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            placeholder="请输入解决方案（选填）"
            rows={3}
            className="w-full p-4 bg-white rounded-xl border border-gray-200 text-lg resize-none"
          />
        </div>

        {/* 多图上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            上传图片（选填，最多9张）
          </label>

          {/* 图片网格预览 */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`图片${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
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

          {/* 上传按钮 - 少于9张时显示 */}
          {formData.images.length < 9 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 active:bg-gray-50"
            >
              {uploading ? (
                <span className="text-blue-500">上传中...</span>
              ) : (
                <>
                  <span className="text-2xl mb-1">📷</span>
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
        <button
          type="submit"
          className="fixed bottom-20 left-4 right-4 bg-blue-500 text-white py-4 rounded-xl font-medium text-lg shadow-lg active:bg-blue-600"
        >
          保存
        </button>
      </form>
    </div>
  );
}
