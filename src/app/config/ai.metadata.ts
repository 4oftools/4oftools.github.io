import { AICategory } from '../models/ai-item.model';

export const AI_CATEGORIES: { value: AICategory | 'all', key: string }[] = [
  { value: 'all', key: 'ai.filter.all' },
  { value: 'programming', key: 'ai.filter.programming' },
  { value: 'model', key: 'ai.filter.model' },
  { value: 'image', key: 'ai.filter.image' },
  { value: 'video', key: 'ai.filter.video' },
  { value: 'other', key: 'ai.filter.other' }
];

