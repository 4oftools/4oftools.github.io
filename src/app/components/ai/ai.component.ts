import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../services/ai.service';
import { LanguageService } from '../../services/language.service';
import { AIItem, AICategory } from '../../models/ai-item.model';
import { Subscription } from 'rxjs';
import { AI_CATEGORIES } from '../../config/ai.metadata';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.css']
})
export class AIComponent implements OnInit, OnDestroy {
  allItems: AIItem[] = [];
  filteredItems: AIItem[] = [];
  selectedCategory: AICategory | 'all' = 'all';
  searchQuery: string = '';
  private subscriptions = new Subscription();
  
  categories = AI_CATEGORIES;

  constructor(
    private aiService: AIService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    const sub = this.aiService.getAllItems().subscribe(items => {
      this.allItems = items;
      this.filteredItems = items;
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  filterByCategory(category: AICategory | 'all') {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    // 先按分类过滤
    if (this.selectedCategory === 'all') {
      this.filteredItems = this.searchItems(this.allItems);
    } else {
      const sub = this.aiService.getItemsByCategory(this.selectedCategory).subscribe(categoryItems => {
        // 再按搜索关键词过滤
        this.filteredItems = this.searchItems(categoryItems);
      });
      this.subscriptions.add(sub);
    }
  }

  private searchItems(items: AIItem[]): AIItem[] {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return items;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    return items.filter(item => {
      const title = this.getItemTitle(item).toLowerCase();
      const description = this.getItemDescription(item).toLowerCase();
      const tags = (item.tags || []).join(' ').toLowerCase();
      
      return title.includes(query) || 
             description.includes(query) || 
             tags.includes(query);
    });
  }

  getCategoryCount(category: AICategory | 'all'): number {
    if (category === 'all') {
      return this.allItems.length;
    }
    return this.allItems.filter(item => item.category === category).length;
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

