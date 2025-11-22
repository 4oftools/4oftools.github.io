import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AIService } from '../../services/ai.service';
import { LanguageService } from '../../services/language.service';
import { AIItem } from '../../models/ai-item.model';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AIComponent implements OnInit {
  allItems: AIItem[] = [];
  applications: AIItem[] = [];
  products: AIItem[] = [];
  technologies: AIItem[] = [];
  tools: AIItem[] = [];

  constructor(
    private aiService: AIService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    this.aiService.getAllItems().subscribe(items => {
      this.allItems = items;
      this.applications = items.filter(i => i.category === 'application');
      this.products = items.filter(i => i.category === 'product');
      this.technologies = items.filter(i => i.category === 'technology');
      this.tools = items.filter(i => i.category === 'tool');
    });
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: { zh: string; en: string } } = {
      'application': { zh: '应用', en: 'Application' },
      'product': { zh: '产品', en: 'Product' },
      'technology': { zh: '技术', en: 'Technology' },
      'tool': { zh: '工具', en: 'Tool' }
    };
    const lang = this.langService.currentLang;
    return labels[category]?.[lang] || category;
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  getItemTitle(item: AIItem): string {
    return this.langService.currentLang === 'en' && item.titleEn ? item.titleEn : item.title;
  }

  getItemDescription(item: AIItem): string {
    return this.langService.currentLang === 'en' && item.descriptionEn ? item.descriptionEn : item.description;
  }
}

