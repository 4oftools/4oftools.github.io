import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-url-encoder',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './url-encoder.component.html',
  styleUrls: ['./url-encoder.component.css']
})
export class UrlEncoderComponent implements OnInit {
  inputText: string = '';
  outputText: string = '';
  errorMessage: string = '';
  mode: 'encode' | 'decode' = 'encode';
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'url-encoder');
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  switchMode() {
    this.mode = this.mode === 'encode' ? 'decode' : 'encode';
    this.inputText = '';
    this.outputText = '';
    this.errorMessage = '';
  }

  encodeUrl() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter text to encode' 
        : '请输入要编码的文本';
      this.outputText = '';
      return;
    }

    try {
      this.outputText = encodeURIComponent(this.inputText);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Encoding error: ${(error as Error).message}`
        : `编码错误: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  decodeUrl() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter URL-encoded string to decode' 
        : '请输入要解码的URL编码字符串';
      this.outputText = '';
      return;
    }

    try {
      this.outputText = decodeURIComponent(this.inputText);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Decoding error: Invalid URL-encoded string`
        : `解码错误: 无效的URL编码字符串`;
      this.outputText = '';
    }
  }

  process() {
    if (this.mode === 'encode') {
      this.encodeUrl();
    } else {
      this.decodeUrl();
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

