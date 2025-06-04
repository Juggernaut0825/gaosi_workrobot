# 团队 Backlog 看板

一个现代化的团队任务管理看板应用，基于 React 构建，用于展示团队的待办事项、已完成任务和问题需求。

## 功能特性

- 📋 **三栏看板布局**: 待办事项(TODOs)、已完成(Done)、问题需求(Issues)
- 👥 **按人员分组**: 清晰展示每个团队成员的任务
- 🏷️ **智能标签解析**: 自动解析截止日期、来源、优先级等信息
- 🔄 **实时更新**: 每30秒自动刷新数据
- 📱 **响应式设计**: 支持桌面和移动设备
- 🎨 **现代化UI**: 磨砂玻璃效果和渐变背景

## 技术栈

- React 18
- Axios (HTTP请求)
- Lucide React (图标)
- CSS3 (样式和动画)

## 安装和运行

1. 安装依赖:
```bash
npm install
```

2. 启动开发服务器:
```bash
npm start
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建生产版本

```bash
npm run build
```

## API 接口

应用从以下API获取数据:
```
http://43.139.19.144:8000/db/latest-todolist
```

### API 响应格式

```json
{
  "success": true,
  "message": "获取最新ToDoList成功",
  "data": {
    "todolist": {
      "ToDo": {
        "成员名": ["任务1", "任务2"]
      },
      "Done": {
        "成员名": ["已完成任务1"]
      },
      "Issue": {
        "成员名": ["问题1"]
      }
    }
  }
}
```

## 任务格式解析

应用会自动解析任务文本中的以下信息：
- `(截止: YYYY-MM-DD)` - 截止日期
- `[来源信息]` - 任务来源
- `(紧急程度: high/medium/low)` - 优先级
- `(负责人: 姓名)` - 负责人

## 项目结构

```
webfront_four/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # 主应用组件
│   ├── index.js        # 应用入口
│   └── index.css       # 全局样式
├── package.json
└── README.md
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

- 应用会自动每30秒刷新一次数据
- 支持手动点击重试按钮刷新数据
- 所有网络请求都有错误处理机制
- 响应式设计适配不同屏幕尺寸 