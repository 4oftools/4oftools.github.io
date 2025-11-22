import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { Tool, ToolCategory } from '../../models/tool.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit, OnDestroy {
  allTools: Tool[] = [];
  filteredTools: Tool[] = [];
  selectedCategory: ToolCategory | 'all' = 'all';
  searchQuery: string = '';
  private subscriptions = new Subscription();
  
  categories: { value: ToolCategory | 'all', key: string }[] = [
    { value: 'all', key: 'filter.all' },
    { value: 'programmer', key: 'filter.programmer' },
    { value: 'efficiency', key: 'filter.efficiency' },
    { value: 'life', key: 'filter.life' },
    { value: 'design', key: 'filter.design' },
    { value: 'other', key: 'filter.other' }
  ];

  constructor(
    private toolService: ToolService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    const sub = this.toolService.getToolsByCategory('tool').subscribe(tools => {
      this.allTools = tools;
      this.filteredTools = tools;
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
      this.filteredTools = this.searchTools(this.allTools);
    } else {
      const sub = this.toolService.getToolsByType(this.selectedCategory).subscribe(categoryTools => {
        // 再按搜索关键词过滤
        this.filteredTools = this.searchTools(categoryTools);
      });
      this.subscriptions.add(sub);
    }
  }

  private searchTools(tools: Tool[]): Tool[] {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return tools;
    }
    
    const query = this.searchQuery.toLowerCase().trim();
    return tools.filter(tool => {
      const name = this.getToolName(tool).toLowerCase();
      const description = this.getToolDescription(tool).toLowerCase();
      const tags = this.getToolTags(tool).join(' ').toLowerCase();
      
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

