import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentLang: Language = 'zh';

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    this.langService.getCurrentLanguage().subscribe((lang: Language) => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: Language) {
    this.langService.setLanguage(lang);
  }

  t(key: string): string {
    return this.langService.translate(key);
  }
}
