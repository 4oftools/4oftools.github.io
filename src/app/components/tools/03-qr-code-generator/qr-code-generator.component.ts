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
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent implements OnInit, OnDestroy {
  inputText: string = '';
  qrCodeDataUrl: string = '';
  errorMessage: string = '';
  size: number = 300;
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
    this.seoService.setSEO(TOOL_PAGES_SEO['qr-code-generator']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['qr-code-generator']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'qr-code-generator');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  async generateQRCode() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter text or URL to generate QR code' 
        : '请输入文本或URL以生成二维码';
      this.qrCodeDataUrl = '';
      return;
    }

    try {
      // 使用 qrcode 库生成真正的二维码
      this.qrCodeDataUrl = await QRCode.toDataURL(this.inputText, {
        width: this.size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Error generating QR code: ${(error as Error).message}`
        : `生成二维码错误: ${(error as Error).message}`;
      this.qrCodeDataUrl = '';
    }
  }

  downloadQRCode() {
    if (!this.qrCodeDataUrl) {
      return;
    }

    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = this.qrCodeDataUrl;
    link.click();
  }

  clearAll() {
    this.inputText = '';
    this.qrCodeDataUrl = '';
    this.errorMessage = '';
  }

  copyToClipboard() {
    if (!this.inputText) return;
    
    navigator.clipboard.writeText(this.inputText).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

