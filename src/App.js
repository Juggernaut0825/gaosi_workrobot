import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertTriangle, Calendar, User } from 'lucide-react';
import './index.css';

const API_URL = '/db/latest-todolist';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    // 设置定时刷新，每30秒更新一次
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data && response.data.success) {
        setData(response.data.data);
        setLastUpdated(new Date().toLocaleString('zh-CN'));
        setError(null);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      setError('网络请求失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseTaskText = (text) => {
    const deadlineMatch = text.match(/\(截止:\s*([^)]+)\)/);
    const sourceMatch = text.match(/\[([^\]]+)\]/);
    const priorityMatch = text.match(/\(紧急程度:\s*(\w+)\)/);
    const assigneeMatch = text.match(/\(负责人:\s*([^,)]+)/);
    
    let cleanText = text
      .replace(/\(截止:\s*[^)]+\)/, '')
      .replace(/\[([^\]]+)\]/, '')
      .replace(/\(紧急程度:\s*\w+\)/, '')
      .replace(/\(负责人:\s*[^,)]+[^)]*\)/, '')
      .trim();

    return {
      text: cleanText,
      deadline: deadlineMatch ? deadlineMatch[1] : null,
      source: sourceMatch ? sourceMatch[1] : null,
      priority: priorityMatch ? priorityMatch[1] : null,
      assignee: assigneeMatch ? assigneeMatch[1] : null
    };
  };

  const renderTaskItem = (task, type) => {
    const parsed = parseTaskText(task);
    
    return (
      <li key={task} className={`task-item ${type}`}>
        <div className="task-text">{parsed.text}</div>
        <div className="task-meta">
          {parsed.deadline && (
            <span className="task-tag deadline">
              <Calendar size={12} style={{ marginRight: '4px' }} />
              截止: {parsed.deadline}
            </span>
          )}
          {parsed.assignee && (
            <span className="task-tag source">
              <User size={12} style={{ marginRight: '4px' }} />
              负责人: {parsed.assignee}
            </span>
          )}
          {parsed.source && (
            <span className="task-tag source">
              来源: {parsed.source}
            </span>
          )}
          {parsed.priority && (
            <span className={`task-tag priority-${parsed.priority}`}>
              紧急程度: {parsed.priority}
            </span>
          )}
        </div>
      </li>
    );
  };

  const renderPersonSection = (personName, tasks, type) => {
    if (!tasks || tasks.length === 0) return null;
    
    return (
      <div className="person-section" key={personName}>
        <div className="person-header">
          <div className="person-name">{personName}</div>
          <div className="person-count">{tasks.length}</div>
        </div>
        <ul className="task-list">
          {tasks.map(task => renderTaskItem(task, type))}
        </ul>
      </div>
    );
  };

  const renderColumn = (title, icon, data, type, color) => {
    if (!data) return null;
    
    const totalTasks = Object.values(data).reduce((sum, tasks) => sum + (tasks?.length || 0), 0);
    
    return (
      <div className="column">
        <div className="column-header">
          <div className="column-icon" style={{ color }}>
            {icon}
          </div>
          <div className="column-title">{title}</div>
          <div className="column-count">{totalTasks}</div>
        </div>
        <div className="column-content">
          {Object.entries(data).map(([person, tasks]) => 
            renderPersonSection(person, tasks, type)
          )}
        </div>
      </div>
    );
  };

  if (loading && !data) {
    return (
      <div className="container">
        <div className="loading">正在加载数据...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>加载失败</h3>
          <p>{error}</p>
          <button 
            onClick={fetchData} 
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              background: '#6366f1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>团队 Backlog 看板</h1>
        <div className="subtitle">实时团队任务管理与跟踪</div>
      </div>

      {data && data.todolist && (
        <div className="board">
          {renderColumn(
            '近期计划 (TODOs)', 
            <Clock size={20} />, 
            data.todolist.ToDo, 
            'todo',
            '#3b82f6'
          )}
          
          {renderColumn(
            '已完成 (Done)', 
            <CheckCircle size={20} />, 
            data.todolist.Done, 
            'done',
            '#10b981'
          )}
          
          {renderColumn(
            '问题需求 (Issues/Needs)', 
            <AlertTriangle size={20} />, 
            data.todolist.Issue, 
            'issue',
            '#f59e0b'
          )}
        </div>
      )}

      {lastUpdated && (
        <div className="last-updated">
          最后更新: {lastUpdated}
        </div>
      )}
    </div>
  );
}

export default App; 