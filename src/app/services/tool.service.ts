import { Injectable } from '@angular/core';
import { Tool, ToolCategory } from '../models/tool.model';
import { Observable, of } from 'rxjs';
import { TOOLS_DATA } from '../data/tools.data';
import { APPS_DATA } from '../data/apps.data';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private tools: Tool[] = [...TOOLS_DATA, ...APPS_DATA];

  constructor() { }

  getAllTools(): Observable<Tool[]> {
    return of(this.tools);
  }

  getToolById(id: string): Observable<Tool | undefined> {
    const tool = this.tools.find(t => t.id === id);
    return of(tool);
  }

  getToolsByCategory(category: 'tool' | 'app'): Observable<Tool[]> {
    const filtered = this.tools.filter(t => t.category === category);
    return of(filtered);
  }

  getFeaturedTools(): Observable<Tool[]> {
    const featured = this.tools.filter(t => t.featured);
    return of(featured);
  }

  getToolsByType(type: ToolCategory | 'all'): Observable<Tool[]> {
    if (type === 'all') {
      return this.getToolsByCategory('tool');
    }
    const filtered = this.tools.filter(t => t.category === 'tool' && t.type === type);
    return of(filtered);
  }

  getAppsByType(type: ToolCategory | 'all'): Observable<Tool[]> {
    if (type === 'all') {
      return this.getToolsByCategory('app');
    }
    const filtered = this.tools.filter(t => t.category === 'app' && t.type === type);
    return of(filtered);
  }
}

