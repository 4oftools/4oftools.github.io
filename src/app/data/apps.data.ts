import { Tool } from '../models/tool.model';

export const APPS_DATA: Tool[] = [
  {
    id: 'bamboo-gtd',
    name: '竹林工作法',
    nameEn: 'Bamboo Grove GTD',
    description: '个人 GTD（Getting Things Done）工作法与工具，用简洁的流程管理任务与专注。',
    descriptionEn: 'A personal GTD methodology and tool for managing tasks and focus with a simple workflow.',
    category: 'app',
    type: 'efficiency',
    icon: 'mdi:leaf',
    iconColor: 'emerald',
    tags: ['GTD', '效率', '个人管理'],
    tagsEn: ['GTD', 'Productivity', 'Personal Management'],
    featured: true,
    openSource: true,
    openSourceUrl: 'https://github.com/4oftools/bamboo-gtd',
    website: undefined,
    downloadUrl: undefined
  }
];

