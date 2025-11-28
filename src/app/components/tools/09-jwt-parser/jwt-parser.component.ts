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

interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: any;
}

interface JwtPayload {
  sub?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  jti?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-jwt-parser',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './jwt-parser.component.html',
  styleUrls: ['./jwt-parser.component.css']
})
export class JwtParserComponent implements OnInit, OnDestroy {
  jwtToken: string = '';
  header: JwtHeader | null = null;
  payload: JwtPayload | null = null;
  headerJson: string = '';
  payloadJson: string = '';
  errorMessage: string = '';
  signature: string = '';
  
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
    this.seoService.setSEO(TOOL_PAGES_SEO['jwt-parser']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['jwt-parser']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'jwt-parser');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  parseJWT() {
    this.errorMessage = '';
    this.header = null;
    this.payload = null;
    this.headerJson = '';
    this.payloadJson = '';
    this.signature = '';

    if (!this.jwtToken.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a JWT token' 
        : '请输入JWT token';
      return;
    }

    try {
      // JWT格式：header.payload.signature
      const parts = this.jwtToken.trim().split('.');
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      // 解析Header
      const headerBase64 = parts[0];
      const headerJson = this.base64UrlDecode(headerBase64);
      this.header = JSON.parse(headerJson);
      this.headerJson = JSON.stringify(this.header, null, 2);

      // 解析Payload
      const payloadBase64 = parts[1];
      const payloadJson = this.base64UrlDecode(payloadBase64);
      this.payload = JSON.parse(payloadJson);
      this.payloadJson = JSON.stringify(this.payload, null, 2);

      // 提取Signature
      this.signature = parts[2];

    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Error parsing JWT: ${(error as Error).message}`
        : `解析JWT错误: ${(error as Error).message}`;
      this.header = null;
      this.payload = null;
      this.headerJson = '';
      this.payloadJson = '';
      this.signature = '';
    }
  }

  private base64UrlDecode(str: string): string {
    // Base64URL解码
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 添加padding
    while (base64.length % 4) {
      base64 += '=';
    }

    try {
      // 使用atob解码
      const decoded = atob(base64);
      // 转换为UTF-8字符串
      return decodeURIComponent(
        decoded.split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    } catch (error) {
      throw new Error('Invalid base64 encoding');
    }
  }

  getExpirationDate(): string {
    if (!this.payload || !this.payload.exp) {
      return '-';
    }
    const date = new Date(this.payload.exp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getIssuedAtDate(): string {
    if (!this.payload || !this.payload.iat) {
      return '-';
    }
    const date = new Date(this.payload.iat * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  isExpired(): boolean {
    if (!this.payload || !this.payload.exp) {
      return false;
    }
    return Date.now() >= this.payload.exp * 1000;
  }

  getTimeUntilExpiration(): string {
    if (!this.payload || !this.payload.exp) {
      return '-';
    }
    const now = Date.now();
    const exp = this.payload.exp * 1000;
    const diff = exp - now;
    
    if (diff < 0) {
      return this.langService.currentLang === 'en' ? 'Expired' : '已过期';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}${this.langService.currentLang === 'en' ? ' days' : '天'} ${hours}${this.langService.currentLang === 'en' ? ' hours' : '小时'}`;
    } else if (hours > 0) {
      return `${hours}${this.langService.currentLang === 'en' ? ' hours' : '小时'} ${minutes}${this.langService.currentLang === 'en' ? ' minutes' : '分钟'}`;
    } else {
      return `${minutes}${this.langService.currentLang === 'en' ? ' minutes' : '分钟'}`;
    }
  }

  clearAll() {
    this.jwtToken = '';
    this.header = null;
    this.payload = null;
    this.headerJson = '';
    this.payloadJson = '';
    this.signature = '';
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
}

