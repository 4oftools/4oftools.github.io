import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { ToolDetailComponent } from '../tool-detail/tool-detail.component';
import { TOOL_PAGES_SEO } from '../../../config/seo.config';

interface ParsedColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
}

interface ParsedRelation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

interface DiagramNode {
  table: ParsedTable;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DiagramLink {
  path: string;
}

@Component({
  selector: 'app-sql-to-er-diagram',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolDetailComponent],
  templateUrl: './sql-to-er-diagram.component.html',
  styleUrls: ['./sql-to-er-diagram.component.css']
})
export class SqlToErDiagramComponent implements OnInit, OnDestroy {
  sqlText = '';
  mermaidText = '';
  errorMessage = '';
  tool: Tool | undefined;
  diagramNodes: DiagramNode[] = [];
  diagramLinks: DiagramLink[] = [];
  canvasWidth = 0;
  canvasHeight = 0;
  zoom = 1;
  panX = 0;
  panY = 0;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  panStartX = 0;
  panStartY = 0;
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    this.seoService.setSEO(TOOL_PAGES_SEO['sql-to-er-diagram']);

    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['sql-to-er-diagram']);
    });
    this.subscriptions.add(langSub);

    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'sql-to-er-diagram');
    });
    this.subscriptions.add(toolSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  generateDiagram() {
    this.errorMessage = '';
    const result = this.parseSql(this.sqlText);

    if (!result.tables.length) {
      this.mermaidText = '';
      this.diagramNodes = [];
      this.diagramLinks = [];
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.resetView();
      this.errorMessage = this.t('sql.er.parse.error');
      return;
    }

    this.mermaidText = this.generateMermaid(result.tables, result.relations);
    this.buildDiagram(result.tables, result.relations);
    this.resetView();
  }

  clearAll() {
    this.sqlText = '';
    this.mermaidText = '';
    this.errorMessage = '';
    this.diagramNodes = [];
    this.diagramLinks = [];
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.resetView();
  }

  loadSample() {
    this.sqlText = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2),
  created_at TIMESTAMP,
  CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(200),
  quantity INT,
  CONSTRAINT fk_items_orders FOREIGN KEY (order_id) REFERENCES orders(id)
);`;
    this.generateDiagram();
  }

  copyToClipboard(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  get diagramTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  zoomIn() {
    this.setZoom(this.zoom + 0.1);
  }

  zoomOut() {
    this.setZoom(this.zoom - 0.1);
  }

  resetView() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.setZoom(this.zoom + delta);
  }

  onMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.panStartX = this.panX;
    this.panStartY = this.panY;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    this.panX = this.panStartX + dx;
    this.panY = this.panStartY + dy;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  private parseSql(sql: string): { tables: ParsedTable[]; relations: ParsedRelation[] } {
    const cleanedSql = this.stripComments(sql);
    const tableRegex = /create\s+table\s+(?:if\s+not\s+exists\s+)?`?([a-zA-Z0-9_.]+)`?\s*\(/gi;
    const tables: ParsedTable[] = [];
    const relations: ParsedRelation[] = [];
    let match: RegExpExecArray | null;

    while ((match = tableRegex.exec(cleanedSql)) !== null) {
      const tableName = this.normalizeIdentifier(match[1].split('.').pop() || '');
      const openIndex = match.index + match[0].length - 1;
      const closeIndex = this.findClosingParen(cleanedSql, openIndex);
      if (closeIndex === -1) {
        continue;
      }
      const block = cleanedSql.slice(openIndex + 1, closeIndex);
      tableRegex.lastIndex = closeIndex + 1;
      const definitions = this.splitDefinitions(block);
      const columns: ParsedColumn[] = [];
      const primaryKeys = new Set<string>();

      for (const rawDef of definitions) {
        const def = rawDef.trim();
        if (!def) continue;
        const lower = def.toLowerCase();

        const pkMatch = def.match(/primary\s+key\s*\(([^)]+)\)/i);
        if (pkMatch) {
          this.splitIdentifiers(pkMatch[1]).forEach(col => primaryKeys.add(col));
          continue;
        }

        const fkMatch = def.match(/foreign\s+key\s*\(([^)]+)\)\s*references\s+`?([a-zA-Z0-9_.]+)`?\s*\(([^)]+)\)/i);
        if (fkMatch) {
          const fromCols = this.splitIdentifiers(fkMatch[1]);
          const toTable = this.normalizeIdentifier(fkMatch[2].split('.').pop() || '');
          const toCols = this.splitIdentifiers(fkMatch[3]);
          fromCols.forEach((col, index) => {
            relations.push({
              fromTable: tableName,
              fromColumn: col,
              toTable,
              toColumn: toCols[index] || toCols[0] || 'id'
            });
          });
          continue;
        }

        if (lower.startsWith('constraint')) {
          const constraintFk = def.match(/foreign\s+key\s*\(([^)]+)\)\s*references\s+`?([a-zA-Z0-9_.]+)`?\s*\(([^)]+)\)/i);
          if (constraintFk) {
            const fromCols = this.splitIdentifiers(constraintFk[1]);
            const toTable = this.normalizeIdentifier(constraintFk[2].split('.').pop() || '');
            const toCols = this.splitIdentifiers(constraintFk[3]);
            fromCols.forEach((col, index) => {
              relations.push({
                fromTable: tableName,
                fromColumn: col,
                toTable,
                toColumn: toCols[index] || toCols[0] || 'id'
              });
            });
          }
          const constraintPk = def.match(/primary\s+key\s*\(([^)]+)\)/i);
          if (constraintPk) {
            this.splitIdentifiers(constraintPk[1]).forEach(col => primaryKeys.add(col));
          }
          continue;
        }

        const columnMatch = def.match(/^\s*`?([a-zA-Z0-9_]+)`?\s+(.+)$/i);
        if (!columnMatch) continue;

        const columnName = this.normalizeIdentifier(columnMatch[1]);
        const columnType = this.extractColumnType(columnMatch[2].trim());
        const isPrimaryKey = /primary\s+key/i.test(def);
        const inlineRef = def.match(/references\s+`?([a-zA-Z0-9_.]+)`?\s*\(([^)]+)\)/i);

        if (isPrimaryKey) {
          primaryKeys.add(columnName);
        }

        if (inlineRef) {
          const toTable = this.normalizeIdentifier(inlineRef[1].split('.').pop() || '');
          const toCol = this.splitIdentifiers(inlineRef[2])[0] || 'id';
          relations.push({
            fromTable: tableName,
            fromColumn: columnName,
            toTable,
            toColumn: toCol
          });
        }

        columns.push({
          name: columnName,
          type: columnType,
          isPrimaryKey,
          isForeignKey: false
        });
      }

      for (const column of columns) {
        if (primaryKeys.has(column.name)) {
          column.isPrimaryKey = true;
        }
      }

      tables.push({
        name: tableName,
        columns
      });
    }

    for (const relation of relations) {
      const fromTable = tables.find(table => table.name === relation.fromTable);
      const fromColumn = fromTable?.columns.find(column => column.name === relation.fromColumn);
      if (fromColumn) {
        fromColumn.isForeignKey = true;
      }
    }

    return { tables, relations };
  }

  private generateMermaid(tables: ParsedTable[], relations: ParsedRelation[]): string {
    if (!tables.length) return '';
    const lines: string[] = ['erDiagram'];
    const relationSet = new Set<string>();

    for (const table of tables) {
      lines.push(`  ${this.toMermaidName(table.name)} {`);
      for (const column of table.columns) {
        const type = column.type ? column.type.replace(/\s+/g, '_') : 'string';
        lines.push(`    ${type} ${this.toMermaidName(column.name)}`);
      }
      lines.push('  }');
    }

    for (const relation of relations) {
      const key = `${relation.toTable}-${relation.toColumn}-${relation.fromTable}-${relation.fromColumn}`;
      if (relationSet.has(key)) continue;
      relationSet.add(key);
      lines.push(`  ${this.toMermaidName(relation.toTable)} ||--o{ ${this.toMermaidName(relation.fromTable)} : "${relation.fromColumn}"`);
    }

    return lines.join('\n');
  }

  private buildDiagram(tables: ParsedTable[], relations: ParsedRelation[]) {
    const columnCount = Math.min(3, Math.max(1, tables.length));
    const cardWidth = 240;
    const headerHeight = 32;
    const rowHeight = 22;
    const padding = 24;
    const gap = 24;
    const nodes: DiagramNode[] = [];
    const rowHeights: number[] = [];

    tables.forEach((table, index) => {
      const colCount = Math.max(1, table.columns.length);
      const height = headerHeight + colCount * rowHeight + 24;
      const row = Math.floor(index / columnCount);
      rowHeights[row] = Math.max(rowHeights[row] || 0, height);
      nodes.push({
        table,
        x: 0,
        y: 0,
        width: cardWidth,
        height
      });
    });

    let currentY = padding;
    for (let row = 0; row < rowHeights.length; row++) {
      for (let col = 0; col < columnCount; col++) {
        const index = row * columnCount + col;
        if (index >= nodes.length) break;
        nodes[index].x = padding + col * (cardWidth + gap);
        nodes[index].y = currentY;
      }
      currentY += rowHeights[row] + gap;
    }

    this.canvasWidth = padding * 2 + columnCount * cardWidth + (columnCount - 1) * gap;
    this.canvasHeight = padding * 2 + rowHeights.reduce((sum, h) => sum + h, 0) + (rowHeights.length - 1) * gap;
    this.diagramNodes = nodes;
    this.diagramLinks = this.buildLinks(nodes, relations);
  }

  private buildLinks(nodes: DiagramNode[], relations: ParsedRelation[]): DiagramLink[] {
    const links: DiagramLink[] = [];
    for (const relation of relations) {
      const fromNode = nodes.find(node => node.table.name === relation.fromTable);
      const toNode = nodes.find(node => node.table.name === relation.toTable);
      if (!fromNode || !toNode) continue;

      const start = this.getAnchorPoint(fromNode, toNode);
      const end = this.getAnchorPoint(toNode, fromNode);
      links.push({
        path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`
      });
    }
    return links;
  }

  private getAnchorPoint(source: DiagramNode, target: DiagramNode): { x: number; y: number } {
    const sourceCenterX = source.x + source.width / 2;
    const sourceCenterY = source.y + source.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    const horizontal = Math.abs(targetCenterX - sourceCenterX) > Math.abs(targetCenterY - sourceCenterY);
    if (horizontal) {
      return targetCenterX > sourceCenterX
        ? { x: source.x + source.width, y: sourceCenterY }
        : { x: source.x, y: sourceCenterY };
    }

    return targetCenterY > sourceCenterY
      ? { x: sourceCenterX, y: source.y + source.height }
      : { x: sourceCenterX, y: source.y };
  }

  private stripComments(sql: string): string {
    return sql
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/--.*$/gm, '')
      .replace(/#[^\n\r]*$/gm, '');
  }

  private splitDefinitions(block: string): string[] {
    const parts: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < block.length; i++) {
      const char = block[i];
      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth = Math.max(0, depth - 1);
      }

      if (char === ',' && depth === 0) {
        if (current.trim()) {
          parts.push(current.trim());
        }
        current = '';
        continue;
      }
      current += char;
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }

  private splitIdentifiers(list: string): string[] {
    return list
      .split(',')
      .map(item => this.normalizeIdentifier(item))
      .filter(Boolean);
  }

  private normalizeIdentifier(name: string): string {
    return name.replace(/[`"']/g, '').trim();
  }

  private toMermaidName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  private extractColumnType(definition: string): string {
    const lower = definition.toLowerCase();
    const keywords = [
      'primary key',
      'not null',
      'null',
      'default',
      'unique',
      'references',
      'constraint',
      'check',
      'collate',
      'comment',
      'auto_increment',
      'identity',
      'generated'
    ];

    let depth = 0;
    for (let i = 0; i < lower.length; i++) {
      const char = lower[i];
      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth = Math.max(0, depth - 1);
      }

      if (depth !== 0 || char !== ' ') continue;

      for (const keyword of keywords) {
        if (lower.startsWith(` ${keyword}`, i)) {
          return definition.slice(0, i).trim();
        }
      }
    }

    return definition.trim();
  }

  private findClosingParen(text: string, startIndex: number): number {
    let depth = 0;
    for (let i = startIndex; i < text.length; i++) {
      const char = text[i];
      if (char === '(') {
        depth += 1;
      } else if (char === ')') {
        depth -= 1;
        if (depth === 0) {
          return i;
        }
      }
    }
    return -1;
  }

  private setZoom(value: number) {
    this.zoom = Math.max(0.5, Math.min(2.5, Number(value.toFixed(2))));
  }
}
