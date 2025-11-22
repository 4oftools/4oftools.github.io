import { ToolCategory } from '../models/tool.model';

export const APPS_CATEGORIES: { value: ToolCategory | 'all', key: string }[] = [
  { value: 'all', key: 'filter.all' },
  { value: 'efficiency', key: 'filter.efficiency' },
  { value: 'life', key: 'filter.life' },
  { value: 'programmer', key: 'filter.programmer' },
  { value: 'design', key: 'filter.design' },
  { value: 'other', key: 'filter.other' }
];

