import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-crontab-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './crontab-calculator.component.html',
  styleUrls: ['./crontab-calculator.component.css']
})
export class CrontabCalculatorComponent implements OnInit {
  cronExpression: string = '';
  nextRuns: Date[] = [];
  errorMessage: string = '';
  description: string = '';
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'crontab-calculator');
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  calculate() {
    this.nextRuns = [];
    this.errorMessage = '';
    this.description = '';

    if (!this.cronExpression.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a cron expression' 
        : '请输入cron表达式';
      return;
    }

    try {
      const parts = this.cronExpression.trim().split(/\s+/);
      
      if (parts.length < 5) {
        throw new Error('Invalid cron expression format');
      }

      this.description = this.parseCronDescription(parts);
      this.nextRuns = this.calculateNextRuns(parts, 10);
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid cron expression: ${(error as Error).message}`
        : `无效的cron表达式: ${(error as Error).message}`;
      this.nextRuns = [];
    }
  }

  private parseCronDescription(parts: string[]): string {
    const [minute, hour, day, month, weekday] = parts;
    
    let desc = '';
    
    if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
      return this.langService.currentLang === 'en' ? 'Every minute' : '每分钟';
    }
    
    if (minute !== '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
      return this.langService.currentLang === 'en' 
        ? `Every hour at minute ${minute}` 
        : `每小时的第${minute}分钟`;
    }
    
    if (minute !== '*' && hour !== '*' && day === '*' && month === '*' && weekday === '*') {
      return this.langService.currentLang === 'en' 
        ? `Every day at ${hour}:${minute.padStart(2, '0')}` 
        : `每天 ${hour}:${minute.padStart(2, '0')}`;
    }
    
    return this.langService.currentLang === 'en' 
      ? 'Custom schedule' 
      : '自定义计划';
  }

  private calculateNextRuns(parts: string[], count: number): Date[] {
    const [minute, hour, day, month, weekday] = parts;
    const runs: Date[] = [];
    const now = new Date();
    let current = new Date(now);
    current.setSeconds(0, 0);
    current.setMinutes(current.getMinutes() + 1);

    while (runs.length < count) {
      if (this.matchesCron(current, minute, hour, day, month, weekday)) {
        runs.push(new Date(current));
      }
      current.setMinutes(current.getMinutes() + 1);
      
      // Prevent infinite loop
      if (runs.length === 0 && current.getTime() - now.getTime() > 365 * 24 * 60 * 60 * 1000) {
        break;
      }
    }

    return runs;
  }

  private matchesCron(date: Date, minute: string, hour: string, day: string, month: string, weekday: string): boolean {
    if (minute !== '*' && parseInt(minute) !== date.getMinutes()) return false;
    if (hour !== '*' && parseInt(hour) !== date.getHours()) return false;
    if (day !== '*' && parseInt(day) !== date.getDate()) return false;
    if (month !== '*' && parseInt(month) !== date.getMonth() + 1) return false;
    if (weekday !== '*' && parseInt(weekday) !== date.getDay()) return false;
    
    return true;
  }

  formatDate(date: Date): string {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  clearAll() {
    this.cronExpression = '';
    this.nextRuns = [];
    this.errorMessage = '';
    this.description = '';
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

