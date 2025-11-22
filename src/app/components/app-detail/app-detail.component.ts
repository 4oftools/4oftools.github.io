import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToolService } from '../../services/tool.service';
import { LanguageService } from '../../services/language.service';
import { Tool } from '../../models/tool.model';

@Component({
  selector: 'app-app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-detail.component.html',
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit {
  app: Tool | undefined;
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
        if (tool && tool.category === 'app') {
          this.app = tool;
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

  getAppName(app: Tool): string {
    return this.langService.currentLang === 'en' && app.nameEn ? app.nameEn : app.name;
  }

  getAppDescription(app: Tool): string {
    return this.langService.currentLang === 'en' && app.descriptionEn ? app.descriptionEn : app.description;
  }

  getAppTags(app: Tool): string[] {
    return this.langService.currentLang === 'en' && app.tagsEn ? app.tagsEn : (app.tags || []);
  }
}

