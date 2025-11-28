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

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './regex-tester.component.html',
  styleUrls: ['./regex-tester.component.css']
})
export class RegexTesterComponent implements OnInit, OnDestroy {
  regexPattern: string = '';
  testText: string = '';
  flags: string = 'g';
  matches: MatchResult[] = [];
  isValid: boolean = true;
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
    this.seoService.setSEO(TOOL_PAGES_SEO['regex-tester']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['regex-tester']);
    });
    this.subscriptions.add(langSub);

    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'regex-tester');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  testRegex() {
    this.matches = [];
    this.isValid = true;
    this.errorMessage = '';

    if (!this.regexPattern.trim()) {
      this.isValid = false;
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a regex pattern' 
        : '请输入正则表达式';
      return;
    }

    if (!this.testText.trim()) {
      return;
    }

    try {
      const regex = new RegExp(this.regexPattern, this.flags);
      const globalMatch = regex.global;
      
      if (globalMatch) {
        let match;
        while ((match = regex.exec(this.testText)) !== null) {
          this.matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          // Prevent infinite loop
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(this.testText);
        if (match) {
          this.matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      this.isValid = true;
    } catch (error) {
      this.isValid = false;
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Invalid regex: ${(error as Error).message}`
        : `无效的正则表达式: ${(error as Error).message}`;
    }
  }

  toggleFlag(flag: string) {
    if (this.flags.includes(flag)) {
      this.flags = this.flags.replace(flag, '');
    } else {
      this.flags += flag;
    }
    this.testRegex();
  }

  clearAll() {
    this.regexPattern = '';
    this.testText = '';
    this.flags = 'g';
    this.matches = [];
    this.isValid = true;
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

