import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import { VideoTutorial, VIDEO_TUTORIALS } from '../../../data/video-tutorials.data';
import { VIDEO_TUTORIALS_LIST_SEO } from '../../../config/seo.config';

@Component({
  selector: 'app-video-tutorials-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-tutorials-list.component.html',
  styleUrls: ['./video-tutorials-list.component.css', '../paper-tutorial.css']
})
export class VideoTutorialsListComponent implements OnInit, OnDestroy {
  readonly tutorials = VIDEO_TUTORIALS;
  private sub = new Subscription();

  constructor(
    public langService: LanguageService,
    private seo: SEOService
  ) {}

  ngOnInit(): void {
    this.seo.setSEO(VIDEO_TUTORIALS_LIST_SEO);
    this.sub.add(
      this.langService.getCurrentLanguage().subscribe(() => this.seo.setSEO(VIDEO_TUTORIALS_LIST_SEO))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  isEn(): boolean {
    return this.langService.currentLang === 'en';
  }

  titleOf(t: (typeof VIDEO_TUTORIALS)[0]): string {
    return this.isEn() ? t.titleEn : t.titleZh;
  }

  summaryOf(t: (typeof VIDEO_TUTORIALS)[0]): string {
    return this.isEn() ? t.summaryEn : t.summaryZh;
  }

  cardAriaLabel(t: VideoTutorial): string {
    const title = this.titleOf(t);
    if (t.externalUrl) {
      return this.isEn() ? `${title} (opens in new tab)` : `${title}（新窗口打开）`;
    }
    return title;
  }
}
