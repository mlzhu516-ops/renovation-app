# 装修助手

装修助手是一款面向个人装修管理的移动端 Web 应用，用于集中记录施工工艺、预算支出和施工进度。应用不需要注册或后端服务，数据默认保存在当前设备的浏览器中。

**在线地址：** [https://decorationass.netlify.app](https://decorationass.netlify.app)

## 主要功能

- **施工工艺**：按砌墙、水电、防水、泥工等分类管理问题和工艺要点。
- **预算支出**：设置总预算，分类记录多笔支出并查看余额。
- **施工进度**：维护施工阶段、日期和每日任务。
- **离线 PWA**：可添加到 iPhone 主屏幕，首次加载后可离线使用。
- **备份与恢复**：支持导出 JSON 备份，也可从文件或粘贴内容中恢复。

## iPhone 安装

1. 使用 Safari 打开在线地址。
2. 点击“分享”，选择“添加到主屏幕”。
3. 开启“作为 Web App 打开”并点击“添加”。
4. 首次从主屏幕打开时保持联网，完成缓存后即可离线使用。

## 本地开发

需要 Node.js 和 npm。从仓库根目录运行：

```bash
cd renovation-app
npm install
npm run dev
```

常用命令：

```bash
npm run build    # 构建生产文件到 dist/
npm run preview  # 本地预览生产构建
npm run lint     # 执行 ESLint 检查
```

## 项目结构

```text
renovation-app/
├── src/components/   React 功能与 UI 组件
├── src/data/         静态分类数据
├── src/utils/        本地存储和格式化工具
├── public/           PWA 图标、备份页和静态文件
└── vite.config.js    Vite 与离线缓存配置
```

## 数据与隐私

装修记录存储在 `localStorage` 中，应用不会将记录上传到服务器。可通过底部“数据”入口或 [`/rescue.html`](https://decorationass.netlify.app/rescue.html) 导出备份。卸载 PWA 或清除 Safari 网站数据可能删除本地记录，请定期将备份保存到“文件” App 或其他安全位置。

## 部署

`main` 分支推送到 GitHub 后由 Netlify 自动构建和发布。生产构建命令为 `npm run build`，输出目录为 `renovation-app/dist/`。
