import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-md5-hash',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './md5-hash.component.html',
  styleUrls: ['./md5-hash.component.css']
})
export class Md5HashComponent implements OnInit {
  inputText: string = '';
  hashResult: string = '';
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'md5-hash');
    });
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

