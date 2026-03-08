import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getAppDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';

const APP_ID = 'yijun';

@Component({
  selector: 'app-yijun',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './yijun.component.html',
  styleUrls: ['./yijun.component.css', '../app-header-icons.css']
})
export class YijunComponent implements OnInit, OnDestroy {
  app: Tool | undefined;
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.toolService.getToolById(APP_ID).subscribe(t => {
      if (t && t.category === 'app') {
        this.app = t;
        this.seoService.setSEO(getAppDetailSEO(t));
      }
    });
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      if (this.app) this.seoService.setSEO(getAppDetailSEO(this.app));
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const placeholder = img.nextElementSibling as HTMLElement;
      if (placeholder) placeholder.classList.add('visible');
    }
  }
}
