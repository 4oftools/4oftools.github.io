import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../../services/tool.service';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getAppDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';

@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit, OnDestroy, OnChanges {
  /** 由父组件传入时作为布局使用，仅渲染 header + 投影内容 + 返回按钮 */
  @Input() app: Tool | undefined;
  @Input() useAsLayout = false;
  error = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    public langService: LanguageService,
    private seoService: SEOService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.useAsLayout && changes['app'] && changes['app'].currentValue) {
      this.seoService.setSEO(getAppDetailSEO(changes['app'].currentValue));
    }
  }

  ngOnInit() {
    if (this.useAsLayout) {
      if (this.app) this.seoService.setSEO(getAppDetailSEO(this.app));
      const langSub = this.langService.getCurrentLanguage().subscribe(() => {
        if (this.app) this.seoService.setSEO(getAppDetailSEO(this.app));
      });
      this.subscriptions.add(langSub);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.toolService.getToolById(id).subscribe((tool: Tool | undefined) => {
        if (tool && tool.category === 'app') {
          this.app = tool;
          this.seoService.setSEO(getAppDetailSEO(tool));
        } else {
          this.error = true;
        }
      });
    } else {
      this.error = true;
    }

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
    const isEn = this.langService.currentLang === 'en';
    switch (app.status) {
      case 'planning':
        return isEn ? 'Planning' : '待开发';
      case 'developing':
        return isEn ? 'In development' : '开发中';
      case 'testing':
        return isEn ? 'Testing / Pending release' : '测试中 / 待发布';
      case 'released':
        return isEn ? 'Released / In maintenance' : '已发布 / 运维中';
      case 'ended':
        return isEn ? 'Maintenance ended' : '运维终止';
      default:
        return '';
    }
  }

  getAppStatusClass(app: Tool): string {
    const status = app.status || 'released';
    return 'app-status--' + status;
  }
}

