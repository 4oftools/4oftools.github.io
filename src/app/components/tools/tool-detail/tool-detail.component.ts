import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../../services/tool.service';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getToolDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './tool-detail.component.html',
  styleUrls: ['./tool-detail.component.css']
})
export class ToolDetailComponent implements OnInit, OnDestroy {
  /** 由父组件传入时使用；未传入则从路由 id 拉取 */
  @Input() tool: Tool | undefined;
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
    // 若父组件已传入 tool（如各工具页内嵌 layout），直接使用
    if (this.tool) {
      this.seoService.setSEO(getToolDetailSEO(this.tool));
      const langSub = this.langService.getCurrentLanguage().subscribe(() => {
        if (this.tool) this.seoService.setSEO(getToolDetailSEO(this.tool));
      });
      this.subscriptions.add(langSub);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.toolService.getToolById(id).subscribe((tool: Tool | undefined) => {
        if (tool && tool.category === 'tool') {
          if (tool.internalRoute) {
            this.router.navigate(['/tools', tool.internalRoute]);
            return;
          }
          this.tool = tool;
          this.seoService.setSEO(getToolDetailSEO(tool));
        } else {
          this.error = true;
        }
      });
    } else {
      this.error = true;
    }

    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      if (this.tool) this.seoService.setSEO(getToolDetailSEO(this.tool));
    });
    this.subscriptions.add(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
