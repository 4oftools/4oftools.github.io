export type AICategory = 'programming' | 'model' | 'image' | 'video' | 'other';

export interface AIItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: AICategory;
  icon?: string;
  image?: string;
  url?: string;
  tags?: string[];
  featured?: boolean;
  date?: string;
}

