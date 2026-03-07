import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';

const BAMBOO_GTD_SEO = {
  title: {
    zh: '竹林工作法 - 否兔联盟 | 个人 GTD 工作法与工具',
    en: 'Bamboo Grove GTD - 4oftools | Personal GTD Methodology and Tool'
  },
  description: {
    zh: '个人 GTD（Getting Things Done）工作法与工具，用简洁的流程管理任务与专注。',
    en: 'A personal GTD methodology and tool for managing tasks and focus with a simple workflow.'
  },
  keywords: {
    zh: '竹林工作法,GTD,个人管理,效率,任务管理,专注',
    en: 'Bamboo Grove GTD,GTD,personal productivity,task management,focus'
  }
};

@Component({
  selector: 'app-bamboo-gtd',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './bamboo-gtd.component.html',
  styleUrls: ['./bamboo-gtd.component.css']
})
export class BambooGtdComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.seoService.setSEO(BAMBOO_GTD_SEO);
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(BAMBOO_GTD_SEO);
    });
    this.subscriptions.add(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
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
