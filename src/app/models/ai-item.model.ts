export interface AIItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: 'application' | 'product' | 'technology' | 'tool';
  icon?: string;
  image?: string;
  url?: string;
  tags?: string[];
  featured?: boolean;
  date?: string;
}

