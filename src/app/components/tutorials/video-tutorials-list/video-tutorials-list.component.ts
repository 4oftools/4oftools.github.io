import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { SEOService } from '../../../services/seo.service';
import { Subscription } from 'rxjs';
import {
  PlatformLinkMediaKind,
  TutorialPlatformLink,
  VideoPlatform,
  VideoTutorial,
  VIDEO_TUTORIALS
} from '../../../data/video-tutorials.data';
import { VIDEO_TUTORIALS_LIST_SEO } from '../../../config/seo.config';

@Component({
  selector: 'app-video-tutorials-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './video-tutorials-list.component.html',
  styleUrls: ['./video-tutorials-list.component.css', '../paper-tutorial.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  statusLabel(t: VideoTutorial): string {
    return t.status === 'live'
      ? this.t('tutorials.status.live')
      : this.t('tutorials.status.planning');
  }

  contentKindLabel(t: VideoTutorial): string {
    switch (t.contentKind) {
      case 'text':
        return this.t('tutorials.kind.text');
      case 'mixed':
        return this.t('tutorials.kind.mixed');
      default:
        return this.t('tutorials.kind.video');
    }
  }

  cardAriaLabel(t: VideoTutorial): string {
    const title = this.titleOf(t);
    const kind = this.contentKindLabel(t);
    const st = this.statusLabel(t);
    if (t.externalUrl) {
      return this.isEn()
        ? `${title}. ${kind}. ${st}. Opens in new tab.`
        : `${title}，${kind}，${st}，新窗口打开`;
    }
    return this.isEn() ? `${title}. ${kind}. ${st}.` : `${title}，${kind}，${st}`;
  }

  platformLinkLabel(link: TutorialPlatformLink): string {
    if (link.platform === 'other') {
      const zh = link.labelZh?.trim();
      const en = link.labelEn?.trim();
      if (this.isEn()) {
        return en || zh || this.t('tutorials.platform.other');
      }
      return zh || en || this.t('tutorials.platform.other');
    }
    return this.platformLabel(link.platform);
  }

  platformLinkMediaKind(link: TutorialPlatformLink): PlatformLinkMediaKind {
    return link.mediaKind === 'audio' ? 'audio' : 'video';
  }

  platformLinkAria(link: TutorialPlatformLink): string {
    const name = this.platformLinkLabel(link);
    const media = this.platformLinkMediaKind(link);
    const prefix =
      media === 'audio'
        ? this.isEn()
          ? 'Audio: '
          : '音频：'
        : this.isEn()
          ? 'Video: '
          : '视频：';
    const suffix = this.isEn() ? ' (opens in new tab)' : '（新窗口打开）';
    return `${prefix}${name}${suffix}`;
  }

  private platformLabel(platform: VideoPlatform): string {
    switch (platform) {
      case 'bilibili':
        return this.t('tutorials.platform.bilibili');
      case 'youtube':
        return this.t('tutorials.platform.youtube');
      default:
        return this.t('tutorials.platform.other');
    }
  }
}
