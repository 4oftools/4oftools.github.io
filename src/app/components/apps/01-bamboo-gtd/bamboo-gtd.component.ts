import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { getAppDetailSEO } from '../../../config/seo.config';

const APP_ID = 'bamboo-gtd';

interface GalleryItem {
  src: string;
  labelZh: string;
  labelEn: string;
}

interface FeatureItem {
  icon: string;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
}

@Component({
  selector: 'app-bamboo-gtd',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './bamboo-gtd.component.html',
  styleUrls: ['./bamboo-gtd.component.css']
})
export class BambooGtdComponent implements OnInit, OnDestroy {
  app: Tool | undefined;
  error = false;
  /** 灯箱当前图片在 galleryItems 中的下标，null 表示未打开 */
  previewIndex: number | null = null;
  private subscriptions = new Subscription();

  /** 四张截图横向等宽展示 */
  readonly galleryItems: GalleryItem[] = [
    {
      src: '/assets/apps/01-bamboo-gtd/zhulin-01-work-overview.png',
      labelZh: '工作总览',
      labelEn: 'Work overview'
    },
    {
      src: '/assets/apps/01-bamboo-gtd/zhulin-02-strategic-management.png',
      labelZh: '战略管理',
      labelEn: 'Strategic management'
    },
    {
      src: '/assets/apps/01-bamboo-gtd/zhulin-03-tactical-management.png',
      labelZh: '战术管理',
      labelEn: 'Tactical management'
    },
    {
      src: '/assets/apps/01-bamboo-gtd/zhulin-04-detailed-statistics.png',
      labelZh: '详细统计',
      labelEn: 'Detailed statistics'
    }
  ];

  readonly features: FeatureItem[] = [
    {
      icon: 'mdi:clipboard-text-outline',
      titleZh: '任务管理',
      titleEn: 'Task management',
      descZh: '管理待办与执行状态，跟进每一步行动。',
      descEn: 'Manage tasks and execution, track every next action.'
    },
    {
      icon: 'mdi:chart-box-outline',
      titleZh: '战略管理',
      titleEn: 'Strategic management',
      descZh: '对齐长期目标与项目结构，把握整体方向。',
      descEn: 'Align long-term goals and project structure.'
    },
    {
      icon: 'mdi:format-list-checks',
      titleZh: '战术管理',
      titleEn: 'Tactical management',
      descZh: '拆解短期行动与情境，落地日常执行。',
      descEn: 'Break down short-term actions and contexts for daily work.'
    },
    {
      icon: 'mdi:chart-bell-curve',
      titleZh: '数据分析',
      titleEn: 'Data analysis',
      descZh: '用统计与视图呈现负荷、进度与成效。',
      descEn: 'Charts and stats for workload, progress, and outcomes.'
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
    this.unlockBodyScroll();
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  onLightboxKeydown(ev: KeyboardEvent): void {
    if (this.previewIndex === null) return;
    if (ev.key === 'Escape') {
      this.closePreview();
      ev.preventDefault();
    } else if (ev.key === 'ArrowLeft') {
      this.prevPreview();
      ev.preventDefault();
    } else if (ev.key === 'ArrowRight') {
      this.nextPreview();
      ev.preventDefault();
    }
  }

  openPreview(item: GalleryItem, event: Event): void {
    const el = event.currentTarget as HTMLElement;
    if (el.classList.contains('bamboo-gallery-thumb--failed')) return;
    const i = this.galleryItems.indexOf(item);
    if (i < 0) return;
    this.previewIndex = i;
    this.lockBodyScroll();
  }

  closePreview(): void {
    this.previewIndex = null;
    this.unlockBodyScroll();
  }

  prevPreview(): void {
    if (this.previewIndex === null) return;
    const n = this.galleryItems.length;
    if (n <= 1) return;
    this.previewIndex = (this.previewIndex - 1 + n) % n;
  }

  nextPreview(): void {
    if (this.previewIndex === null) return;
    const n = this.galleryItems.length;
    if (n <= 1) return;
    this.previewIndex = (this.previewIndex + 1) % n;
  }

  /** 灯箱内当前展示项（供模板 *ngIf="previewItem as pv"） */
  get previewItem(): GalleryItem | null {
    if (this.previewIndex === null) return null;
    return this.galleryItems[this.previewIndex] ?? null;
  }

  private lockBodyScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  private unlockBodyScroll(): void {
    document.body.style.overflow = '';
  }

  getPreviewHint(item: GalleryItem): string {
    const base = this.getGalleryLabel(item);
    return this.isEn() ? `${base}, open preview` : `${base}，点击预览`;
  }

  getLightboxCloseLabel(): string {
    return this.isEn() ? 'Close preview' : '关闭预览';
  }

  getLightboxPrevLabel(): string {
    return this.isEn() ? 'Previous image' : '上一张';
  }

  getLightboxNextLabel(): string {
    return this.isEn() ? 'Next image' : '下一张';
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  isEn(): boolean {
    return this.langService.currentLang === 'en';
  }

  getAppName(app: Tool): string {
    return this.isEn() && app.nameEn ? app.nameEn : app.name;
  }

  getAppDescription(app: Tool): string {
    return this.isEn() && app.descriptionEn ? app.descriptionEn : app.description;
  }

  getGalleryLabel(item: GalleryItem): string {
    return this.isEn() ? item.labelEn : item.labelZh;
  }

  getFeatureTitle(f: FeatureItem): string {
    return this.isEn() ? f.titleEn : f.titleZh;
  }

  getFeatureDesc(f: FeatureItem): string {
    return this.isEn() ? f.descEn : f.descZh;
  }

  getAppStatusLabel(app: Tool): string {
    const en = this.isEn();
    switch (app.status) {
      case 'planning':
        return en ? 'Planning' : '规划中';
      case 'developing':
        return en ? 'In development' : '开发中';
      case 'testing':
        return en ? 'Testing' : '测试中';
      case 'released':
        return en ? 'Released' : '已发布';
      case 'ended':
        return en ? 'Ended' : '已结束';
      default:
        return en ? 'Released' : '已发布';
    }
  }

  getHeroExtra(): string {
    return this.isEn()
      ? 'Keep your mind as clear and ordered as a bamboo grove.'
      : '让你的思绪如竹林般清朗有序。';
  }

  getOpenSourceLabel(app: Tool): string {
    const en = this.isEn();
    if (app.openSource) {
      return en ? 'Open source' : '开源';
    }
    return en ? 'Not open source' : '非开源';
  }

  getKicker(): string {
    return this.isEn() ? 'App' : '应用';
  }

  getScreenshotsTitle(): string {
    return this.isEn() ? 'Screenshots' : '应用截图';
  }

  getFeaturesTitle(): string {
    return this.isEn() ? 'Core features' : '核心功能';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img) return;
    img.style.display = 'none';
    const wrap = img.closest('.bamboo-gallery-thumb');
    if (wrap) {
      wrap.classList.add('bamboo-gallery-thumb--fallback');
      wrap.classList.add('bamboo-gallery-thumb--failed');
    }
  }
}
