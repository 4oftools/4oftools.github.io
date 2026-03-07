import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Unified icon component: Iconify (mdi:, tabler:, etc.) + image URL + optional emoji fallback.
 * Prefer Iconify: use "prefix:icon-name" e.g. "mdi:home", "tabler:search".
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.css']
})
export class AppIconComponent {
  @Input() icon?: string;
  @Input() size: string = '1em';
  @Input() iconClass?: string;
  @Input() alt: string = '';

  isIconifyId(icon?: string): boolean {
    if (!icon) return false;
    return icon.includes(':') && !icon.startsWith('http') && !/\.(svg|png|jpg|jpeg|webp)(\?|$)/i.test(icon);
  }

  isImageUrl(icon?: string): boolean {
    if (!icon) return false;
    return icon.includes('/') || /\.(svg|png|jpg|jpeg|webp)(\?|$)/i.test(icon);
  }
}
