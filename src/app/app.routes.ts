import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ToolDetailComponent } from './components/tool-detail/tool-detail.component';
import { AppDetailComponent } from './components/app-detail/app-detail.component';
import { AIComponent } from './components/ai/ai.component';
import { ToolsComponent } from './components/tools/tools.component';
import { AppsComponent } from './components/apps/apps.component';
import { SponsorComponent } from './components/sponsor/sponsor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tools', component: ToolsComponent },
  { path: 'tools/:id', component: ToolDetailComponent },
  { path: 'apps', component: AppsComponent },
  { path: 'apps/:id', component: AppDetailComponent },
  { path: 'ai', component: AIComponent },
  { path: 'sponsor', component: SponsorComponent },
  { path: '**', redirectTo: '' }
];

