import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { Tool } from '../../models/tool.model';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tool-detail.component.html',
  styleUrls: ['./tool-detail.component.css']
})
export class ToolDetailComponent implements OnInit {
  tool: Tool | undefined;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService,
    public langService: LanguageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.toolService.getToolById(id).subscribe(tool => {
        if (tool && tool.category === 'tool') {
          this.tool = tool;
        } else {
          this.error = true;
        }
      });
    } else {
      this.error = true;
    }
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  getToolName(tool: Tool): string {
    return this.langService.currentLang === 'en' && tool.nameEn ? tool.nameEn : tool.name;
  }

  getToolDescription(tool: Tool): string {
    return this.langService.currentLang === 'en' && tool.descriptionEn ? tool.descriptionEn : tool.description;
  }

  getToolTags(tool: Tool): string[] {
    return this.langService.currentLang === 'en' && tool.tagsEn ? tool.tagsEn : (tool.tags || []);
  }
}
