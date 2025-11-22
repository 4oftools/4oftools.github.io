import { Injectable } from '@angular/core';
import { Tool, ToolCategory } from '../models/tool.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private tools: Tool[] = [
    {
      id: 'tool-1',
      name: 'JSON格式化工具',
      nameEn: 'JSON Formatter',
      description: '快速格式化、验证和美化JSON数据，支持压缩和展开模式，方便开发者调试和查看JSON结构。',
      descriptionEn: 'Quickly format, validate and beautify JSON data with support for compressed and expanded modes.',
      category: 'tool',
      type: 'programmer',
      icon: '📄',
      tags: ['开发工具', 'JSON', '格式化'],
      tagsEn: ['Development Tool', 'JSON', 'Formatter'],
      featured: true,
      url: 'https://example.com/json-formatter'
    },
    {
      id: 'tool-2',
      name: 'Base64编解码器',
      nameEn: 'Base64 Encoder/Decoder',
      description: '在线Base64编码和解码工具，支持文本、图片等多种格式的Base64转换，操作简单快捷。',
      descriptionEn: 'Online Base64 encoding and decoding tool supporting text, images and various formats.',
      category: 'tool',
      type: 'programmer',
      icon: '🔐',
      tags: ['编码工具', 'Base64', '转换'],
      tagsEn: ['Encoding Tool', 'Base64', 'Converter'],
      featured: true,
      url: 'https://example.com/base64'
    },
    {
      id: 'tool-3',
      name: '二维码生成器',
      nameEn: 'QR Code Generator',
      description: '快速生成各种类型的二维码，支持自定义颜色、尺寸和容错级别，可下载为图片格式。',
      descriptionEn: 'Quickly generate various types of QR codes with customizable colors, sizes and error correction levels.',
      category: 'tool',
      type: 'life',
      icon: '📱',
      tags: ['二维码', '生成器', '实用工具'],
      tagsEn: ['QR Code', 'Generator', 'Utility'],
      featured: true,
      url: 'https://example.com/qrcode'
    },
    {
      id: 'tool-4',
      name: '颜色选择器',
      nameEn: 'Color Picker',
      description: '专业的颜色选择工具，支持RGB、HEX、HSL等多种颜色格式转换，提供调色板和颜色历史记录。',
      descriptionEn: 'Professional color picker supporting RGB, HEX, HSL and other color format conversions.',
      category: 'tool',
      type: 'design',
      icon: '🎨',
      tags: ['设计工具', '颜色', '调色板'],
      tagsEn: ['Design Tool', 'Color', 'Palette'],
      featured: true,
      url: 'https://example.com/color-picker'
    },
    {
      id: 'tool-5',
      name: '时间戳转换器',
      nameEn: 'Timestamp Converter',
      description: 'Unix时间戳与日期时间相互转换工具，支持多种时区和日期格式，方便时间计算和转换。',
      descriptionEn: 'Unix timestamp and datetime conversion tool supporting multiple timezones and date formats.',
      category: 'tool',
      type: 'programmer',
      icon: '⏰',
      tags: ['时间工具', '转换器', '开发工具'],
      tagsEn: ['Time Tool', 'Converter', 'Development Tool'],
      featured: true,
      url: 'https://example.com/timestamp'
    },
    {
      id: 'tool-6',
      name: 'MD5哈希生成器',
      nameEn: 'MD5 Hash Generator',
      description: '快速生成文本的MD5哈希值，支持批量处理和多种输入格式，适用于密码加密和数据校验。',
      descriptionEn: 'Quickly generate MD5 hash values for text with batch processing support.',
      category: 'tool',
      type: 'programmer',
      icon: '🔑',
      tags: ['加密工具', 'MD5', '哈希'],
      tagsEn: ['Encryption Tool', 'MD5', 'Hash'],
      featured: false,
      url: 'https://example.com/md5'
    },
    {
      id: 'tool-7',
      name: 'URL编码解码',
      nameEn: 'URL Encoder/Decoder',
      description: '在线URL编码和解码工具，支持百分号编码和查询参数处理，方便处理特殊字符和中文。',
      descriptionEn: 'Online URL encoding and decoding tool supporting percent encoding and query parameter processing.',
      category: 'tool',
      type: 'programmer',
      icon: '🔗',
      tags: ['URL工具', '编码', '网络工具'],
      tagsEn: ['URL Tool', 'Encoding', 'Network Tool'],
      featured: false,
      url: 'https://example.com/url-encoder'
    },
    {
      id: 'tool-8',
      name: '文本差异对比',
      nameEn: 'Text Diff Tool',
      description: '对比两个文本文件的差异，高亮显示增删改的内容，支持多种对比算法和导出功能。',
      descriptionEn: 'Compare differences between two text files with highlighted additions, deletions and changes.',
      category: 'tool',
      type: 'programmer',
      icon: '📊',
      tags: ['对比工具', '文本处理', '开发工具'],
      tagsEn: ['Diff Tool', 'Text Processing', 'Development Tool'],
      featured: false,
      url: 'https://example.com/text-diff'
    },
    {
      id: 'app-1',
      name: '任务管理助手',
      nameEn: 'Task Manager',
      description: '智能任务管理应用，支持待办事项、提醒通知、优先级设置和进度跟踪，提高工作效率。',
      descriptionEn: 'Smart task management app with to-do lists, reminders, priority settings and progress tracking.',
      category: 'app',
      type: 'efficiency',
      icon: '✅',
      tags: ['生产力', '任务管理', '效率工具'],
      tagsEn: ['Productivity', 'Task Management', 'Efficiency Tool'],
      featured: true,
      url: 'https://example.com/task-manager'
    },
    {
      id: 'app-2',
      name: '笔记记录应用',
      nameEn: 'Note Taking App',
      description: '功能强大的笔记应用，支持富文本编辑、标签分类、全文搜索和云端同步，随时随地记录灵感。',
      descriptionEn: 'Powerful note-taking app with rich text editing, tags, full-text search and cloud sync.',
      category: 'app',
      type: 'efficiency',
      icon: '📝',
      tags: ['笔记', '记录', '知识管理'],
      tagsEn: ['Notes', 'Recording', 'Knowledge Management'],
      featured: true,
      url: 'https://example.com/notes'
    },
    {
      id: 'app-3',
      name: '密码管理器',
      nameEn: 'Password Manager',
      description: '安全可靠的密码管理应用，支持密码生成、加密存储、自动填充和跨设备同步，保护您的账户安全。',
      descriptionEn: 'Secure password manager with password generation, encrypted storage, auto-fill and cross-device sync.',
      category: 'app',
      type: 'life',
      icon: '🔒',
      tags: ['安全工具', '密码管理', '隐私保护'],
      tagsEn: ['Security Tool', 'Password Manager', 'Privacy Protection'],
      featured: true,
      url: 'https://example.com/password-manager'
    },
    {
      id: 'app-4',
      name: '习惯追踪器',
      nameEn: 'Habit Tracker',
      description: '帮助您养成良好习惯的应用，支持每日打卡、数据统计、目标设定和成就系统，让坚持变得简单。',
      descriptionEn: 'App to help build good habits with daily check-ins, statistics, goal setting and achievement system.',
      category: 'app',
      type: 'life',
      icon: '📈',
      tags: ['习惯养成', '追踪', '个人成长'],
      tagsEn: ['Habit Building', 'Tracking', 'Personal Growth'],
      featured: true,
      url: 'https://example.com/habit-tracker'
    },
    {
      id: 'app-5',
      name: '番茄工作法计时器',
      nameEn: 'Pomodoro Timer',
      description: '基于番茄工作法的时间管理应用，支持专注计时、休息提醒、任务统计和专注模式，提升工作效率。',
      descriptionEn: 'Time management app based on Pomodoro Technique with focus timer, break reminders and statistics.',
      category: 'app',
      type: 'efficiency',
      icon: '🍅',
      tags: ['时间管理', '专注', '效率工具'],
      tagsEn: ['Time Management', 'Focus', 'Efficiency Tool'],
      featured: true,
      url: 'https://example.com/pomodoro'
    },
    {
      id: 'app-6',
      name: '记账理财助手',
      nameEn: 'Expense Tracker',
      description: '简单易用的记账应用，支持多账户管理、分类统计、预算设置和报表分析，让理财更轻松。',
      descriptionEn: 'Easy-to-use expense tracking app with multi-account management, category statistics and budget analysis.',
      category: 'app',
      type: 'life',
      icon: '💰',
      tags: ['理财', '记账', '财务管理'],
      tagsEn: ['Finance', 'Expense Tracking', 'Financial Management'],
      featured: false,
      url: 'https://example.com/expense-tracker'
    },
    {
      id: 'app-7',
      name: '天气查询应用',
      nameEn: 'Weather App',
      description: '实时天气查询应用，提供精准的天气预报、空气质量、生活指数和天气预警，出行必备。',
      descriptionEn: 'Real-time weather app with accurate forecasts, air quality, life indices and weather alerts.',
      category: 'app',
      type: 'life',
      icon: '🌤️',
      tags: ['天气', '生活服务', '实用工具'],
      tagsEn: ['Weather', 'Life Service', 'Utility'],
      featured: false,
      url: 'https://example.com/weather'
    },
    {
      id: 'app-8',
      name: '健康运动追踪',
      nameEn: 'Fitness Tracker',
      description: '专业的运动健康追踪应用，记录步数、卡路里、运动时长和心率数据，帮助您保持健康生活。',
      descriptionEn: 'Professional fitness tracking app recording steps, calories, exercise duration and heart rate data.',
      category: 'app',
      type: 'life',
      icon: '🏃',
      tags: ['健康', '运动', '生活助手'],
      tagsEn: ['Health', 'Fitness', 'Life Assistant'],
      featured: false,
      url: 'https://example.com/fitness'
    },
    {
      id: 'app-9',
      name: '语言学习助手',
      nameEn: 'Language Learning',
      description: '多语言学习应用，提供词汇记忆、语法练习、发音训练和进度跟踪，让语言学习更有趣。',
      descriptionEn: 'Multi-language learning app with vocabulary, grammar practice, pronunciation training and progress tracking.',
      category: 'app',
      type: 'life',
      icon: '📚',
      tags: ['教育', '语言学习', '学习工具'],
      tagsEn: ['Education', 'Language Learning', 'Learning Tool'],
      featured: false,
      url: 'https://example.com/language-learning'
    }
  ];

  constructor() { }

  getAllTools(): Observable<Tool[]> {
    return of(this.tools);
  }

  getToolById(id: string): Observable<Tool | undefined> {
    const tool = this.tools.find(t => t.id === id);
    return of(tool);
  }

  getToolsByCategory(category: 'tool' | 'app'): Observable<Tool[]> {
    const filtered = this.tools.filter(t => t.category === category);
    return of(filtered);
  }

  getFeaturedTools(): Observable<Tool[]> {
    const featured = this.tools.filter(t => t.featured);
    return of(featured);
  }

  getToolsByType(type: ToolCategory | 'all'): Observable<Tool[]> {
    if (type === 'all') {
      return this.getToolsByCategory('tool');
    }
    const filtered = this.tools.filter(t => t.category === 'tool' && t.type === type);
    return of(filtered);
  }

  getAppsByType(type: ToolCategory | 'all'): Observable<Tool[]> {
    if (type === 'all') {
      return this.getToolsByCategory('app');
    }
    const filtered = this.tools.filter(t => t.category === 'app' && t.type === type);
    return of(filtered);
  }
}

