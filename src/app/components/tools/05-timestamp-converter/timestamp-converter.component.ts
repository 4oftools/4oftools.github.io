import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-timestamp-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './timestamp-converter.component.html',
  styleUrls: ['./timestamp-converter.component.css']
})
export class TimestampConverterComponent implements OnInit {
  timestamp: string = '';
  dateTime: string = '';
  errorMessage: string = '';
  mode: 'timestamp-to-date' | 'date-to-timestamp' = 'timestamp-to-date';
  tool: Tool | undefined;

  get inputValue(): string {
    return this.mode === 'timestamp-to-date' ? this.timestamp : this.dateTime;
  }

  set inputValue(value: string) {
    if (this.mode === 'timestamp-to-date') {
      this.timestamp = value;
    } else {
      this.dateTime = value;
    }
  }

  get outputValue(): string {
    return this.mode === 'timestamp-to-date' ? this.dateTime : this.timestamp;
  }

  set outputValue(value: string) {
    if (this.mode === 'timestamp-to-date') {
      this.dateTime = value;
    } else {
      this.timestamp = value;
    }
  }

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'timestamp-converter');
    });
    
    // 初始化当前时间戳
    this.timestamp = Math.floor(Date.now() / 1000).toString();
    this.convertTimestampToDate();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  switchMode() {
    this.mode = this.mode === 'timestamp-to-date' ? 'date-to-timestamp' : 'timestamp-to-date';
    this.timestamp = '';
    this.dateTime = '';
    this.errorMessage = '';
  }

  convertTimestampToDate() {
    this.errorMessage = '';
    
    if (!this.timestamp.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a timestamp' 
        : '请输入时间戳';
      this.dateTime = '';
      return;
    }

    try {
      const ts = parseInt(this.timestamp);
      if (isNaN(ts)) {
        throw new Error('Invalid timestamp');
      }
      
      const date = new Date(ts * 1000);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid timestamp');
      }
      
      this.dateTime = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid timestamp: ${(error as Error).message}`
        : `无效的时间戳: ${(error as Error).message}`;
      this.dateTime = '';
    }
  }

  convertDateToTimestamp() {
    this.errorMessage = '';
    
    if (!this.dateTime.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a date and time' 
        : '请输入日期和时间';
      this.timestamp = '';
      return;
    }

    try {
      const date = new Date(this.dateTime);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      this.timestamp = Math.floor(date.getTime() / 1000).toString();
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid date: ${(error as Error).message}`
        : `无效的日期: ${(error as Error).message}`;
      this.timestamp = '';
    }
  }

  process() {
    if (this.mode === 'timestamp-to-date') {
      this.convertTimestampToDate();
    } else {
      this.convertDateToTimestamp();
    }
  }

  clearAll() {
    this.timestamp = '';
    this.dateTime = '';
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

  useCurrentTime() {
    this.timestamp = Math.floor(Date.now() / 1000).toString();
    this.convertTimestampToDate();
  }
}

