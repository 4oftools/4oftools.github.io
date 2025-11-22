import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

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
export class SponsorComponent {
  corporateSponsors: Sponsor[] = [];
  individualSponsors: Sponsor[] = [];

  constructor(public langService: LanguageService) {
    // 示例数据，实际应该从服务获取
    this.corporateSponsors = [];
    this.individualSponsors = [];
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

