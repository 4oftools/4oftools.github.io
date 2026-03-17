import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';
import { TOOL_PAGES_SEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';

export interface KeyEventRecord {
  key: string;
  code: string;
  keyCode: number;
  modifiers: string;
  type: 'keydown' | 'keyup';
  time: number;
}

@Component({
  selector: 'app-keyboard-tester',
  standalone: true,
  imports: [CommonModule, ToolDetailComponent],
  templateUrl: './keyboard-tester.component.html',
  styleUrls: ['./keyboard-tester.component.css']
})
export class KeyboardTesterComponent implements OnInit, OnDestroy {
  tool: Tool | undefined;
  lastKey: string = '';
  lastCode: string = '';
  lastKeyCode: number = 0;
  lastModifiers: string = '';
  records: KeyEventRecord[] = [];
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.seoService.setSEO(TOOL_PAGES_SEO['keyboard-tester']);
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['keyboard-tester']);
    });
    this.subscriptions.add(langSub);

    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'keyboard-tester');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  private getModifiers(e: KeyboardEvent): string {
    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push(e.metaKey ? 'Meta' : 'Win');
    return parts.join(' + ') || '—';
  }

  onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    this.lastKey = e.key || '—';
    this.lastCode = e.code || '—';
    this.lastKeyCode = e.keyCode;
    this.lastModifiers = this.getModifiers(e);
    this.records.unshift({
      key: this.lastKey,
      code: this.lastCode,
      keyCode: this.lastKeyCode,
      modifiers: this.lastModifiers,
      type: 'keydown',
      time: Date.now()
    });
    if (this.records.length > 50) this.records.pop();
  }

  onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    this.records.unshift({
      key: e.key || '—',
      code: e.code || '—',
      keyCode: e.keyCode,
      modifiers: this.getModifiers(e),
      type: 'keyup',
      time: Date.now()
    });
    if (this.records.length > 50) this.records.pop();
  }

  clear() {
    this.lastKey = '';
    this.lastCode = '';
    this.lastKeyCode = 0;
    this.lastModifiers = '';
    this.records = [];
  }

  trackByTime(_index: number, r: KeyEventRecord): number {
    return r.time;
  }
}
