import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'zh' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage$ = new BehaviorSubject<Language>('zh');
  
  translations: { [key: string]: { zh: string; en: string } } = {
    'site.name': { zh: '否兔联盟', en: '4oftools' },
    'nav.home': { zh: '首页', en: 'Home' },
    'nav.tools': { zh: '工具集', en: 'Tools' },
    'nav.apps': { zh: '应用', en: 'Apps' },
    'nav.ai': { zh: 'AI', en: 'AI' },
    'home.banner.title': { zh: '否兔联盟', en: '4oftools' },
    'home.banner.subtitle': { zh: '4oftools - 您的工具和应用集合平台', en: '4oftools - Your Tools and Apps Collection Platform' },
    'home.banner.description': { zh: '汇集了各种实用的在线工具和应用程序，让您的工作和生活更加便捷高效。', en: 'A collection of practical online tools and applications to make your work and life more convenient and efficient.' },
    'home.banner.explore': { zh: '探索工具', en: 'Explore Tools' },
    'home.banner.view': { zh: '查看应用', en: 'View Apps' },
    'home.tools.title': { zh: '工具集', en: 'Tools' },
    'home.tools.description': { zh: '精选的实用工具，帮助您提高工作效率', en: 'Curated practical tools to help improve your work efficiency' },
    'home.apps.title': { zh: '应用', en: 'Apps' },
    'home.apps.description': { zh: '功能丰富的应用程序，满足您的各种需求', en: 'Feature-rich applications to meet your various needs' },
    'home.view.more': { zh: '查看更多', en: 'View More' },
    'home.collapse': { zh: '收起', en: 'Collapse' },
    'tools.title': { zh: '工具集', en: 'Tools' },
    'tools.description': { zh: '精选的实用工具，帮助您提高工作效率', en: 'Curated practical tools to help improve your work efficiency' },
    'apps.title': { zh: '应用', en: 'Apps' },
    'apps.description': { zh: '功能丰富的应用程序，满足您的各种需求', en: 'Feature-rich applications to meet your various needs' },
    'filter.all': { zh: '全部', en: 'All' },
    'filter.programmer': { zh: '程序员', en: 'Programmer' },
    'filter.efficiency': { zh: '效率', en: 'Efficiency' },
    'filter.life': { zh: '生活', en: 'Life' },
    'filter.design': { zh: '设计', en: 'Design' },
    'filter.other': { zh: '其他', en: 'Other' },
    'tool.detail': { zh: '查看详情', en: 'View Details' },
    'tool.back': { zh: '返回首页', en: 'Back to Home' },
    'tool.use': { zh: '立即使用', en: 'Use Now' },
    'tool.link': { zh: '访问链接', en: 'Access Link' },
    'tool.intro': { zh: '详细介绍', en: 'Detailed Introduction' },
    'loading': { zh: '加载中...', en: 'Loading...' },
    'tool.notfound': { zh: '未找到该工具', en: 'Tool not found' },
    'footer.about': { zh: '关于我们', en: 'About Us' },
    'footer.about.text': { zh: '否兔联盟（4oftools）是一个集合了各种实用工具和应用的综合平台。我们致力于为用户提供便捷、高效的在线工具和应用程序。', en: '4oftools is a comprehensive platform that collects various practical tools and applications. We are committed to providing users with convenient and efficient online tools and applications.' },
    'footer.links': { zh: '快速链接', en: 'Quick Links' },
    'footer.contact': { zh: '联系方式', en: 'Contact' },
    'footer.email': { zh: '邮箱联系', en: 'Email' },
    'ai.title': { zh: 'AI 前沿探索', en: 'AI Exploration' },
    'ai.subtitle': { zh: '探索最新的人工智能应用、产品和技术', en: 'Explore the latest AI applications, products and technologies' },
    'ai.description': { zh: '汇集了当前最热门和最有影响力的AI应用、产品和技术，帮助您了解人工智能领域的最新发展。', en: 'A collection of the hottest and most influential AI applications, products and technologies to help you understand the latest developments in artificial intelligence.' },
    'ai.applications': { zh: 'AI 应用', en: 'AI Applications' },
    'ai.applications.desc': { zh: '实用的AI应用程序，改变我们的工作和生活方式', en: 'Practical AI applications that transform our work and lifestyle' },
    'ai.technologies': { zh: 'AI 技术', en: 'AI Technologies' },
    'ai.technologies.desc': { zh: '前沿的AI技术和模型，推动行业发展', en: 'Cutting-edge AI technologies and models driving industry development' },
    'ai.tools': { zh: 'AI 工具', en: 'AI Tools' },
    'ai.tools.desc': { zh: '提高效率的AI工具和助手', en: 'AI tools and assistants to improve efficiency' },
    'ai.products': { zh: 'AI 产品', en: 'AI Products' },
    'ai.products.desc': { zh: '创新的AI产品和解决方案', en: 'Innovative AI products and solutions' },
    'ai.visit': { zh: '访问网站', en: 'Visit Website' },
    'ai.learn': { zh: '了解更多', en: 'Learn More' },
    'empty.state': { zh: '暂无该分类的工具', en: 'No tools in this category' },
    'empty.apps': { zh: '暂无该分类的应用', en: 'No apps in this category' },
    'search.placeholder': { zh: '搜索工具...', en: 'Search tools...' },
    'search.placeholder.apps': { zh: '搜索应用...', en: 'Search apps...' },
    'nav.sponsor': { zh: '赞助', en: 'Sponsor' },
    'sponsor.title': { zh: '赞助我们', en: 'Sponsor Us' },
    'sponsor.subtitle': { zh: '您的支持是我们持续发展的动力', en: 'Your support is the driving force for our continuous development' },
    'sponsor.wechat': { zh: '微信支付', en: 'WeChat Pay' },
    'sponsor.wechat.desc': { zh: '使用微信扫描二维码进行赞助', en: 'Scan the QR code with WeChat to sponsor' },
    'sponsor.alipay': { zh: '支付宝', en: 'Alipay' },
    'sponsor.alipay.desc': { zh: '使用支付宝扫描二维码进行赞助', en: 'Scan the QR code with Alipay to sponsor' },
    'sponsor.qr.placeholder': { zh: '二维码图片', en: 'QR Code Image' },
    'sponsor.description.title': { zh: '关于赞助', en: 'About Sponsorship' },
    'sponsor.description.text1': { zh: '否兔联盟是一个免费的工具和应用集合平台，我们致力于为用户提供高质量的服务。', en: '4oftools is a free platform for tools and applications, and we are committed to providing users with high-quality services.' },
    'sponsor.description.text2': { zh: '您的赞助将帮助我们持续维护和开发新功能，改善用户体验，并支持服务器的运营成本。', en: 'Your sponsorship will help us continue to maintain and develop new features, improve user experience, and support server operating costs.' },
    'sponsor.description.text3': { zh: '我们非常感谢每一位支持者的慷慨捐助，您的名字将被记录在赞助商列表中。', en: 'We are very grateful for the generous donations from every supporter, and your name will be recorded in the sponsor list.' },
    'sponsor.sponsors.title': { zh: '赞助商列表', en: 'Sponsor List' },
    'sponsor.sponsors.corporate': { zh: '企业赞助商', en: 'Corporate Sponsors' },
    'sponsor.sponsors.individual': { zh: '个人赞助商', en: 'Individual Sponsors' },
    'sponsor.sponsors.empty': { zh: '暂无赞助商，成为第一个支持者吧！', en: 'No sponsors yet, be the first supporter!' },
    'sponsor.amount': { zh: '赞助金额', en: 'Amount' },
    'sponsor.date': { zh: '赞助日期', en: 'Date' },
    'footer.github': { zh: 'GitHub', en: 'GitHub' },
    'footer.copyright': { zh: '版权所有', en: 'All rights reserved' },
    'lang.zh': { zh: '中文', en: '中文' },
    'lang.en': { zh: 'EN', en: 'EN' },
    'logo.alt': { zh: '否兔联盟', en: '4oftools' },
    'qr.wechat.alt': { zh: '微信支付二维码', en: 'WeChat Pay QR Code' },
    'qr.alipay.alt': { zh: '支付宝二维码', en: 'Alipay QR Code' },
    'app.notfound': { zh: '未找到该应用', en: 'App not found' },
    'tool.back.to.list': { zh: '返回列表', en: 'Back to List' }
  };

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      this.currentLanguage$.next(savedLang);
    }
  }

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage$.asObservable();
  }

  setLanguage(lang: Language) {
    this.currentLanguage$.next(lang);
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const lang = this.currentLanguage$.value;
    return this.translations[key]?.[lang] || key;
  }

  get currentLang(): Language {
    return this.currentLanguage$.value;
  }
}

