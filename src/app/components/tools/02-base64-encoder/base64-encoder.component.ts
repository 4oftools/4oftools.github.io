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
  selector: 'app-base64-encoder',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './base64-encoder.component.html',
  styleUrls: ['./base64-encoder.component.css']
})
export class Base64EncoderComponent implements OnInit, OnDestroy {
  inputText: string = '';
  outputText: string = '';
  errorMessage: string = '';
  mode: 'encode' | 'decode' = 'encode';
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
    this.seoService.setSEO(TOOL_PAGES_SEO['base64-encoder']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['base64-encoder']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'base64-encoder');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  encodeBase64() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter text to encode' 
        : '请输入要编码的文本';
      return;
    }

    try {
      this.outputText = btoa(unescape(encodeURIComponent(this.inputText)));
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Encoding error: ${(error as Error).message}`
        : `编码错误: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  decodeBase64() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter Base64 string to decode' 
        : '请输入要解码的 Base64 字符串';
      return;
    }

    try {
      this.outputText = decodeURIComponent(escape(atob(this.inputText)));
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Decoding error: Invalid Base64 string`
        : `解码错误: 无效的 Base64 字符串`;
      this.outputText = '';
    }
  }

  switchMode() {
    this.mode = this.mode === 'encode' ? 'decode' : 'encode';
    this.inputText = '';
    this.outputText = '';
    this.errorMessage = '';
  }

  process() {
    if (this.mode === 'encode') {
      this.encodeBase64();
    } else {
      this.decodeBase64();
    }
  }

  clearAll() {
    this.inputText = '';
    this.outputText = '';
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
    const temp = this.inputText;
    this.inputText = this.outputText;
    this.outputText = temp;
    this.errorMessage = '';
  }
}

