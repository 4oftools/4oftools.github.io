import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';
import { TOOL_PAGES_SEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-md5-hash',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './md5-hash.component.html',
  styleUrls: ['./md5-hash.component.css']
})
export class Md5HashComponent implements OnInit, OnDestroy {
  inputText: string = '';
  hashResult: string = '';
  tool: Tool | undefined;
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    // 设置SEO
    this.seoService.setSEO(TOOL_PAGES_SEO['md5-hash']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['md5-hash']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'md5-hash');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  generateHash() {
    if (!this.inputText.trim()) {
      this.hashResult = '';
      return;
    }

    try {
      // 使用 crypto-js 生成 MD5 哈希
      this.hashResult = CryptoJS.MD5(this.inputText).toString();
    } catch (error) {
      this.hashResult = '';
      console.error('Failed to generate hash:', error);
    }
  }

  clearAll() {
    this.inputText = '';
    this.hashResult = '';
  }

  copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

