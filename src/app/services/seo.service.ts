import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { LanguageService } from './language.service';

export interface SEOData {
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  keywords?: { zh: string; en: string };
  ogTitle?: { zh: string; en: string };
  ogDescription?: { zh: string; en: string };
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: { zh: string; en: string };
  twitterDescription?: { zh: string; en: string };
  twitterImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private baseUrl = 'https://www.4oftools.com'; // 请替换为实际域名
  private defaultImage = `${this.baseUrl}/assets/logo.png`;

  constructor(
    private title: Title,
    private meta: Meta,
    private languageService: LanguageService
  ) {}

  setSEO(data: SEOData) {
    const lang = this.languageService.currentLang;
    const isZh = lang === 'zh';

    // 设置页面标题
    const title = isZh ? data.title.zh : data.title.en;
    this.title.setTitle(title);

    // 设置描述
    const description = isZh ? data.description.zh : data.description.en;
    this.meta.updateTag({ name: 'description', content: description });

    // 设置关键词
    if (data.keywords) {
      const keywords = isZh ? data.keywords.zh : data.keywords.en;
      this.meta.updateTag({ name: 'keywords', content: keywords });
    }

    // Open Graph 标签
    const ogTitle = data.ogTitle 
      ? (isZh ? data.ogTitle.zh : data.ogTitle.en)
      : title;
    const ogDescription = data.ogDescription
      ? (isZh ? data.ogDescription.zh : data.ogDescription.en)
      : description;
    const ogImage = data.ogImage || this.defaultImage;
    const ogUrl = data.ogUrl || (typeof window !== 'undefined' ? window.location.href : this.baseUrl);

    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:url', content: ogUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: isZh ? '否兔联盟' : '4oftools' });
    this.meta.updateTag({ property: 'og:locale', content: isZh ? 'zh_CN' : 'en_US' });

    // Twitter Card 标签
    const twitterCard = data.twitterCard || 'summary_large_image';
    const twitterTitle = data.twitterTitle
      ? (isZh ? data.twitterTitle.zh : data.twitterTitle.en)
      : ogTitle;
    const twitterDescription = data.twitterDescription
      ? (isZh ? data.twitterDescription.zh : data.twitterDescription.en)
      : ogDescription;
    const twitterImage = data.twitterImage || ogImage;

    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.meta.updateTag({ name: 'twitter:image', content: twitterImage });

    // 设置语言
    this.meta.updateTag({ property: 'og:locale:alternate', content: isZh ? 'en_US' : 'zh_CN' });
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }
}

