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

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './json-formatter.component.html',
  styleUrls: ['./json-formatter.component.css']
})
export class JsonFormatterComponent implements OnInit, OnDestroy {
  inputJson: string = '';
  outputJson: string = '';
  errorMessage: string = '';
  indentSize: number = 2;
  isCompressed: boolean = false;
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
    this.seoService.setSEO(TOOL_PAGES_SEO['json-formatter']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['json-formatter']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'json-formatter');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  formatJson() {
    this.errorMessage = '';
    
    if (!this.inputJson.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter JSON data' 
        : '请输入JSON数据';
      return;
    }

    try {
      const parsed = JSON.parse(this.inputJson);
      this.isCompressed = false;
      this.outputJson = JSON.stringify(parsed, null, this.indentSize);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid JSON: ${(error as Error).message}`
        : `JSON格式错误: ${(error as Error).message}`;
      this.outputJson = '';
    }
  }

  compressJson() {
    this.errorMessage = '';
    
    if (!this.inputJson.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter JSON data' 
        : '请输入JSON数据';
      return;
    }

    try {
      const parsed = JSON.parse(this.inputJson);
      this.isCompressed = true;
      this.outputJson = JSON.stringify(parsed);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid JSON: ${(error as Error).message}`
        : `JSON格式错误: ${(error as Error).message}`;
      this.outputJson = '';
    }
  }

  validateJson() {
    this.errorMessage = '';
    
    if (!this.inputJson.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter JSON data' 
        : '请输入JSON数据';
      return;
    }

    try {
      JSON.parse(this.inputJson);
      this.errorMessage = this.langService.currentLang === 'en'
        ? '✓ Valid JSON'
        : '✓ JSON格式正确';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `✗ Invalid JSON: ${(error as Error).message}`
        : `✗ JSON格式错误: ${(error as Error).message}`;
    }
  }

  clearAll() {
    this.inputJson = '';
    this.outputJson = '';
    this.errorMessage = '';
  }

  copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  swapContent() {
    const temp = this.inputJson;
    this.inputJson = this.outputJson;
    this.outputJson = temp;
    this.errorMessage = '';
  }
}

