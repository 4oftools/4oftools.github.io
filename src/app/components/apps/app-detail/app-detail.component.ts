import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../../services/tool.service';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getAppDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit, OnDestroy {
  app: Tool | undefined;
  error = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    public langService: LanguageService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.toolService.getToolById(id).subscribe((tool: Tool | undefined) => {
        if (tool && tool.category === 'app') {
          this.app = tool;
          // 设置SEO
          this.seoService.setSEO(getAppDetailSEO(tool));
        } else {
          this.error = true;
        }
      });
    } else {
      this.error = true;
    }

    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      if (this.app) {
        this.seoService.setSEO(getAppDetailSEO(this.app));
      }
    });
    this.subscriptions.add(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  getAppName(app: Tool): string {
    return this.langService.currentLang === 'en' && app.nameEn ? app.nameEn : app.name;
  }

  getAppDescription(app: Tool): string {
    return this.langService.currentLang === 'en' && app.descriptionEn ? app.descriptionEn : app.description;
  }

  getAppTags(app: Tool): string[] {
    return this.langService.currentLang === 'en' && app.tagsEn ? app.tagsEn : (app.tags || []);
  }
}

