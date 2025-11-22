import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { Tool } from '../../models/tool.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tools: Tool[] = [];
  apps: Tool[] = [];
  DISPLAY_LIMIT = 4;

  constructor(
    private toolService: ToolService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    this.toolService.getToolsByCategory('tool').subscribe(tools => {
      this.tools = tools;
    });
    this.toolService.getToolsByCategory('app').subscribe(apps => {
      this.apps = apps;
    });
    // 订阅语言变化
    this.langService.getCurrentLanguage().subscribe();
  }

  get displayedTools(): Tool[] {
    return this.tools.slice(0, this.DISPLAY_LIMIT);
  }

  get displayedApps(): Tool[] {
    return this.apps.slice(0, this.DISPLAY_LIMIT);
  }

  get hasMoreTools(): boolean {
    return this.tools.length > this.DISPLAY_LIMIT;
  }

  get hasMoreApps(): boolean {
    return this.apps.length > this.DISPLAY_LIMIT;
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
