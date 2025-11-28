import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { SEOService } from '../../services/seo.service';
import { Subscription } from 'rxjs';
import { SPONSOR_PAGE_SEO } from '../../config/seo.config';

interface Sponsor {
  name: string;
  amount: string;
  date: string;
  message?: string;
  type: 'corporate' | 'individual';
}

@Component({
  selector: 'app-sponsor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css']
})
export class SponsorComponent implements OnInit, OnDestroy {
  corporateSponsors: Sponsor[] = [];
  individualSponsors: Sponsor[] = [];
  paypalLink: string = 'https://paypal.me/4oftools'; // 请替换为实际的 PayPal 收款链接
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private seoService: SEOService
  ) {
    // 示例数据，实际应该从服务获取
    this.corporateSponsors = [];
    this.individualSponsors = [];
  }

  ngOnInit() {
    // 设置SEO
    this.seoService.setSEO(SPONSOR_PAGE_SEO);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(SPONSOR_PAGE_SEO);
    });
    this.subscriptions.add(langSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const placeholder = img.nextElementSibling as HTMLElement;
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }
  }
}

