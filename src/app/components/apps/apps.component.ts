import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { Tool, ToolCategory } from '../../models/tool.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit, OnDestroy {
  allApps: Tool[] = [];
  filteredApps: Tool[] = [];
  selectedCategory: ToolCategory | 'all' = 'all';
  searchQuery: string = '';
  private subscriptions = new Subscription();
  
  categories: { value: ToolCategory | 'all', key: string }[] = [
    { value: 'all', key: 'filter.all' },
    { value: 'efficiency', key: 'filter.efficiency' },
    { value: 'life', key: 'filter.life' },
    { value: 'programmer', key: 'filter.programmer' },
    { value: 'design', key: 'filter.design' },
    { value: 'other', key: 'filter.other' }
  ];

  constructor(
    private toolService: ToolService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    const sub = this.toolService.getToolsByCategory('app').subscribe(apps => {
      this.allApps = apps;
      this.filteredApps = apps;
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  filterByCategory(category: ToolCategory | 'all') {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    // 先按分类过滤
    if (this.selectedCategory === 'all') {
      // 再按搜索关键词过滤
      this.filteredApps = this.searchApps(this.allApps);
    } else {
      const sub = this.toolService.getAppsByType(this.selectedCategory).subscribe(categoryApps => {
        // 再按搜索关键词过滤
        this.filteredApps = this.searchApps(categoryApps);
      });
      this.subscriptions.add(sub);
    }
  }

  private searchApps(apps: Tool[]): Tool[] {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return apps;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    return apps.filter(app => {
      const name = this.getToolName(app).toLowerCase();
      const description = this.getToolDescription(app).toLowerCase();
      const tags = this.getToolTags(app).join(' ').toLowerCase();
      
      return name.includes(query) || 
             description.includes(query) || 
             tags.includes(query);
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  getToolName(tool: Tool): string {
    return this.langService.currentLang === 'en' && tool.nameEn ? tool.nameEn : tool.name;
  }

  getToolDescription(tool: Tool): string {
    return this.langService.currentLang === 'en' && tool.descriptionEn ? tool.descriptionEn : tool.description;
  }

  getToolTags(tool: Tool): string[] {
    return this.langService.currentLang === 'en' && tool.tagsEn ? tool.tagsEn : (tool.tags || []);
  }
}

