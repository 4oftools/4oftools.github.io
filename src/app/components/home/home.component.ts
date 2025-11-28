import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';
import { Tool } from '../../models/tool.model';
import { HOME_SEO } from '../../config/seo.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  tools: Tool[] = [];
  apps: Tool[] = [];
  DISPLAY_LIMIT = 4;
  private subscriptions = new Subscription();

  constructor(
    private toolService: ToolService,
    public langService: LanguageService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    // 设置SEO
    this.seoService.setSEO(HOME_SEO);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(HOME_SEO);
    });
    this.subscriptions.add(langSub);

    this.toolService.getToolsByCategory('tool').subscribe(tools => {
      this.tools = tools;
    });
    this.toolService.getToolsByCategory('app').subscribe(apps => {
      this.apps = apps;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  getToolRoute(tool: Tool): string[] {
    // 如果有内部实现页面，跳转到工具页面
    if (tool.internalRoute) {
      return ['/tools', tool.internalRoute];
    }
    // 否则跳转到详情页
    return ['/tools', tool.id];
  }
}
