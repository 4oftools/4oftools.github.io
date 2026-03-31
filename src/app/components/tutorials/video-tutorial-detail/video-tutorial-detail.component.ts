import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  VideoEpisode,
  VideoTutorial,
  getVideoTutorialById
} from '../../../data/video-tutorials.data';
import { getVideoTutorialDetailSEO } from '../../../config/seo.config';

@Component({
  selector: 'app-video-tutorial-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-tutorial-detail.component.html',
  styleUrls: ['./video-tutorial-detail.component.css', '../paper-tutorial.css']
})
export class VideoTutorialDetailComponent implements OnInit, OnDestroy {
  tutorial: VideoTutorial | undefined;
  private sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public langService: LanguageService,
    private seo: SEOService
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.paramMap
      .pipe(
        map(p => p.get('id')),
        filter((id): id is string => !!id)
      )
      .subscribe(id => {
        const t = getVideoTutorialById(id);
        if (!t) {
          this.tutorial = undefined;
          void this.router.navigate(['/tutorials']);
          return;
        }
        this.tutorial = t;
        this.seo.setSEO(getVideoTutorialDetailSEO(t));
      });
    this.sub.add(routeSub);
    this.sub.add(
      this.langService.getCurrentLanguage().subscribe(() => {
        if (this.tutorial) this.seo.setSEO(getVideoTutorialDetailSEO(this.tutorial));
      })
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

  titleOf(t: VideoTutorial): string {
    return this.isEn() ? t.titleEn : t.titleZh;
  }

  summaryOf(t: VideoTutorial): string {
    return this.isEn() ? t.summaryEn : t.summaryZh;
  }

  epTitle(ep: VideoEpisode): string {
    return this.isEn() ? ep.titleEn : ep.titleZh;
  }

  epDesc(ep: VideoEpisode): string {
    return this.isEn() ? ep.descEn : ep.descZh;
  }

  epViews(ep: VideoEpisode): string | undefined {
    return this.isEn() ? ep.viewsEn : ep.viewsZh;
  }

  platformLabel(platform: VideoEpisode['platform']): string {
    switch (platform) {
      case 'bilibili':
        return this.t('tutorials.platform.bilibili');
      case 'youtube':
        return this.t('tutorials.platform.youtube');
      default:
        return this.t('tutorials.platform.other');
    }
  }

  platformClass(platform: VideoEpisode['platform']): string {
    return platform === 'youtube' ? 'paper-platform youtube' : 'paper-platform';
  }
}
