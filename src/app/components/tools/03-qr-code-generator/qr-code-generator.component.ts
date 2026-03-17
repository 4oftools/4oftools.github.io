import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { AppIconComponent } from '../../shared/app-icon/app-icon.component';
import { TOOL_PAGES_SEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';

@Component({
  selector: 'app-qr-code-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolDetailComponent, AppIconComponent],
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QrCodeGeneratorComponent implements OnInit, OnDestroy {
  inputText: string = '';
  qrDataUrl: string = '';
  errorMessage: string = '';
  size: number = 256;
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

  async generateQR() {
    this.errorMessage = '';

    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? 'Please enter text to generate QR code'
        : '请输入要生成二维码的文本';
      return;
    }

    try {
      // 使用动态导入加载 qrcode 库
      const QRCode = (await import('qrcode')).default;
      this.qrDataUrl = await QRCode.toDataURL(this.inputText, {
        width: this.size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? 'Failed to generate QR code'
        : '生成二维码失败';
      console.error('QR Code generation error:', error);
    }
  }

  downloadQR() {
    if (!this.qrDataUrl) return;

    const link = document.createElement('a');
    link.href = this.qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  clearAll() {
    this.inputText = '';
    this.qrDataUrl = '';
    this.errorMessage = '';
  }

  copyToClipboard(text?: string) {
    const textToCopy = text || this.inputText;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}
