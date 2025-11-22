import { ToolCategory } from '../models/tool.model';

export const TOOLS_CATEGORIES: { value: ToolCategory | 'all', key: string }[] = [
  { value: 'all', key: 'filter.all' },
  { value: 'programmer', key: 'filter.programmer' },
  { value: 'efficiency', key: 'filter.efficiency' },
  { value: 'life', key: 'filter.life' },
  { value: 'design', key: 'filter.design' },
  { value: 'other', key: 'filter.other' }
];

