export type ToolCategory = 'programmer' | 'life' | 'efficiency' | 'design' | 'other';
export type ToolType = 'tool' | 'app';

export interface Tool {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  icon?: string;
  image?: string;
  category: ToolType;
  type?: ToolCategory;
  url?: string;
  tags?: string[];
  tagsEn?: string[];
  featured?: boolean;
  createdAt?: string;
  internalRoute?: string; // 如果有内部实现页面，指定路由路径，如 'json-formatter'
}

