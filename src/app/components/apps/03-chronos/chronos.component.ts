import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getAppDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { AppDetailComponent } from '../app-detail/app-detail.component';

const APP_ID = 'chronos';

interface Screenshot {
  thumbnail: string;
  full: string;
}

@Component({
  selector: 'app-chronos',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './chronos.component.html',
  styleUrls: ['./chronos.component.css', '../app-header-icons.css']
})
export class ChronosComponent implements OnInit, OnDestroy {
  app: Tool | undefined;
  error = false;
  isModalOpen = false;
  currentIndex = 0;
  private subscriptions = new Subscription();

  screenshots: Screenshot[] = [
    {
      thumbnail: 'https://picsum.photos/seed/chronos1/400/250',
      full: 'https://picsum.photos/seed/chronos1/1200/750'
    },
    {
      thumbnail: 'https://picsum.photos/seed/chronos2/400/250',
      full: 'https://picsum.photos/seed/chronos2/1200/750'
    },
    {
      thumbnail: 'https://picsum.photos/seed/chronos3/400/250',
      full: 'https://picsum.photos/seed/chronos3/1200/750'
    },
    {
      thumbnail: 'https://picsum.photos/seed/chronos4/400/250',
      full: 'https://picsum.photos/seed/chronos4/1200/750'
    }
  ];

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.toolService.getToolById(APP_ID).subscribe(t => {
      if (t && t.category === 'app') {
        this.app = t;
        this.error = false;
        this.seoService.setSEO(getAppDetailSEO(t));
      } else {
        this.error = true;
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

  getAppStatusLabel(app: Tool): string {
    const statusMap: Record<string, string> = {
      'released': this.langService.currentLang === 'en' ? 'Released' : '已发布',
      'planning': this.langService.currentLang === 'en' ? 'Planning' : '规划中',
      'development': this.langService.currentLang === 'en' ? 'Development' : '开发中'
    };
    return statusMap[app.status || 'planning'];
  }

  get currentImage(): string {
    return this.isModalOpen && this.screenshots[this.currentIndex] 
      ? this.screenshots[this.currentIndex].full 
      : '';
  }

  openModal(index: number): void {
    this.currentIndex = index;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.screenshots.length) % this.screenshots.length;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.screenshots.length;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.isModalOpen) return;
    
    if (event.key === 'Escape') {
      this.closeModal();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }
}
