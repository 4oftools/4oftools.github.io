import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../../services/tool.service';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { getToolDetailSEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tool-detail.component.html',
  styleUrls: ['./tool-detail.component.css']
})
export class ToolDetailComponent implements OnInit, OnDestroy {
  tool: Tool | undefined;
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
        if (tool && tool.category === 'tool') {
          // 如果有内部实现页面，跳转到工具页面
          if (tool.internalRoute) {
            this.router.navigate(['/tools', tool.internalRoute]);
            return;
          }
          this.tool = tool;
          // 设置SEO
          this.seoService.setSEO(getToolDetailSEO(tool));
        } else {
          this.error = true;
        }
      });
    } else {
      this.error = true;
    }

    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      if (this.tool) {
        this.seoService.setSEO(getToolDetailSEO(this.tool));
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
