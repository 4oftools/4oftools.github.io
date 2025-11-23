import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

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
export class RegexTesterComponent implements OnInit {
  regexPattern: string = '';
  testText: string = '';
  flags: string = 'g';
  matches: MatchResult[] = [];
  isValid: boolean = true;
  errorMessage: string = '';
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'regex-tester');
    });
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

