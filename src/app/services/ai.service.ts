import { Injectable } from '@angular/core';
import { AIItem } from '../models/ai-item.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private aiItems: AIItem[] = [
    {
      id: 'ai-1',
      title: 'ChatGPT',
      titleEn: 'ChatGPT',
      description: 'OpenAI开发的强大对话AI，能够进行自然语言对话、回答问题、协助写作等多种任务。',
      descriptionEn: 'Powerful conversational AI developed by OpenAI, capable of natural language dialogue, answering questions, and assisting with writing tasks.',
      category: 'application',
      icon: '🤖',
      tags: ['对话AI', '自然语言处理', 'OpenAI'],
      featured: true,
      url: 'https://chat.openai.com',
      date: '2022-11'
    },
    {
      id: 'ai-2',
      title: 'Midjourney',
      titleEn: 'Midjourney',
      description: 'AI图像生成工具，通过文本描述生成高质量的艺术作品和图像。',
      descriptionEn: 'AI image generation tool that creates high-quality artwork and images from text descriptions.',
      category: 'application',
      icon: '🎨',
      tags: ['图像生成', 'AI艺术', '创意工具'],
      featured: true,
      url: 'https://www.midjourney.com',
      date: '2022-07'
    },
    {
      id: 'ai-3',
      title: 'Stable Diffusion',
      titleEn: 'Stable Diffusion',
      description: '开源的文本到图像生成模型，可以在本地运行，支持高度定制。',
      descriptionEn: 'Open-source text-to-image generation model that can run locally with high customization support.',
      category: 'technology',
      icon: '🖼️',
      tags: ['开源', '图像生成', '本地部署'],
      featured: true,
      url: 'https://stability.ai',
      date: '2022-08'
    },
    {
      id: 'ai-4',
      title: 'Claude',
      titleEn: 'Claude',
      description: 'Anthropic开发的AI助手，专注于安全、有帮助和诚实的对话。',
      descriptionEn: 'AI assistant developed by Anthropic, focused on safe, helpful, and honest conversations.',
      category: 'application',
      icon: '💬',
      tags: ['对话AI', 'Anthropic', 'AI助手'],
      featured: true,
      url: 'https://www.anthropic.com',
      date: '2023-03'
    },
    {
      id: 'ai-5',
      title: 'GPT-4',
      titleEn: 'GPT-4',
      description: 'OpenAI最新的多模态大语言模型，支持文本和图像输入，性能大幅提升。',
      descriptionEn: 'OpenAI\'s latest multimodal large language model, supporting text and image inputs with significantly improved performance.',
      category: 'technology',
      icon: '🧠',
      tags: ['大语言模型', '多模态', 'OpenAI'],
      featured: true,
      url: 'https://openai.com/gpt-4',
      date: '2023-03'
    },
    {
      id: 'ai-6',
      title: 'GitHub Copilot',
      titleEn: 'GitHub Copilot',
      description: 'AI编程助手，能够根据代码上下文自动生成代码片段和建议。',
      descriptionEn: 'AI coding assistant that automatically generates code snippets and suggestions based on code context.',
      category: 'tool',
      icon: '💻',
      tags: ['编程助手', '代码生成', 'GitHub'],
      featured: true,
      url: 'https://github.com/features/copilot',
      date: '2021-10'
    }
  ];

  constructor() { }

  getAllItems(): Observable<AIItem[]> {
    return of(this.aiItems);
  }

  getItemById(id: string): Observable<AIItem | undefined> {
    const item = this.aiItems.find(i => i.id === id);
    return of(item);
  }

  getItemsByCategory(category: 'application' | 'product' | 'technology' | 'tool'): Observable<AIItem[]> {
    const filtered = this.aiItems.filter(i => i.category === category);
    return of(filtered);
  }

  getFeaturedItems(): Observable<AIItem[]> {
    const featured = this.aiItems.filter(i => i.featured);
    return of(featured);
  }
}

