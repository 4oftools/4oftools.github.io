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

type BaseType = 'binary' | 'octal' | 'decimal' | 'hexadecimal';

@Component({
  selector: 'app-number-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './number-converter.component.html',
  styleUrls: ['./number-converter.component.css']
})
export class NumberConverterComponent implements OnInit, OnDestroy {
  inputValue: string = '';
  fromBase: BaseType = 'decimal';
  toBase: BaseType = 'hexadecimal';
  outputValue: string = '';
  errorMessage: string = '';
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
    this.seoService.setSEO(TOOL_PAGES_SEO['number-converter']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['number-converter']);
    });
    this.subscriptions.add(langSub);

    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'number-converter');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  convert() {
    this.errorMessage = '';
    this.outputValue = '';

    if (!this.inputValue.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a number' 
        : '请输入数字';
      return;
    }

    try {
      // Convert to decimal first
      let decimalValue: number;
      
      switch (this.fromBase) {
        case 'binary':
          decimalValue = parseInt(this.inputValue.trim(), 2);
          if (isNaN(decimalValue)) {
            throw new Error('Invalid binary number');
          }
          break;
        case 'octal':
          decimalValue = parseInt(this.inputValue.trim(), 8);
          if (isNaN(decimalValue)) {
            throw new Error('Invalid octal number');
          }
          break;
        case 'decimal':
          decimalValue = parseInt(this.inputValue.trim(), 10);
          if (isNaN(decimalValue)) {
            throw new Error('Invalid decimal number');
          }
          break;
        case 'hexadecimal':
          decimalValue = parseInt(this.inputValue.trim(), 16);
          if (isNaN(decimalValue)) {
            throw new Error('Invalid hexadecimal number');
          }
          break;
        default:
          throw new Error('Invalid base');
      }

      // Convert from decimal to target base
      switch (this.toBase) {
        case 'binary':
          this.outputValue = decimalValue.toString(2);
          break;
        case 'octal':
          this.outputValue = decimalValue.toString(8);
          break;
        case 'decimal':
          this.outputValue = decimalValue.toString(10);
          break;
        case 'hexadecimal':
          this.outputValue = decimalValue.toString(16).toUpperCase();
          break;
        default:
          throw new Error('Invalid target base');
      }
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Conversion error: ${(error as Error).message}`
        : `转换错误: ${(error as Error).message}`;
      this.outputValue = '';
    }
  }

  clearAll() {
    this.inputValue = '';
    this.outputValue = '';
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

  swapBases() {
    const temp = this.fromBase;
    this.fromBase = this.toBase;
    this.toBase = temp;
    
    // Swap values
    const tempValue = this.inputValue;
    this.inputValue = this.outputValue;
    this.outputValue = tempValue;
    
    // Convert if there's input
    if (this.inputValue) {
      this.convert();
    }
  }
}

