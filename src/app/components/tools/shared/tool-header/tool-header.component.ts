import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../../services/language.service';
import { Tool } from '../../../../models/tool.model';

@Component({
  selector: 'app-tool-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tool-header.component.html',
  styleUrls: ['./tool-header.component.css']
})
export class ToolHeaderComponent {
  @Input() tool!: Tool;

  constructor(public langService: LanguageService) {}

  t(key: string): string {
    return this.langService.translate(key);
  }

  getToolName(): string {
    return this.langService.currentLang === 'en' && this.tool.nameEn ? this.tool.nameEn : this.tool.name;
  }

  getToolDescription(): string {
    return this.langService.currentLang === 'en' && this.tool.descriptionEn ? this.tool.descriptionEn : this.tool.description;
  }
}

