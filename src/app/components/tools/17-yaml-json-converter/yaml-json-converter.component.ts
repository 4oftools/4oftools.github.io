import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-yaml-json-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './yaml-json-converter.component.html',
  styleUrls: ['./yaml-json-converter.component.css']
})
export class YamlJsonConverterComponent implements OnInit {
  yamlText: string = '';
  jsonText: string = '';
  errorMessage: string = '';
  mode: 'yaml-to-json' | 'json-to-yaml' = 'yaml-to-json';
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'yaml-json-converter');
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  switchMode() {
    this.mode = this.mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json';
    this.yamlText = '';
    this.jsonText = '';
    this.errorMessage = '';
  }

  convert() {
    if (this.mode === 'yaml-to-json') {
      this.yamlToJson();
    } else {
      this.jsonToYaml();
    }
  }

  yamlToJson() {
    this.errorMessage = '';
    this.jsonText = '';
    
    if (!this.yamlText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter YAML data' 
        : '请输入YAML数据';
      return;
    }

    try {
      // Simple YAML to JSON conversion
      // Note: This is a basic implementation. For production, use a proper YAML parser library
      const obj = this.parseYaml(this.yamlText);
      this.jsonText = JSON.stringify(obj, null, 2);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Conversion error: ${(error as Error).message}`
        : `转换错误: ${(error as Error).message}`;
      this.jsonText = '';
    }
  }

  jsonToYaml() {
    this.errorMessage = '';
    this.yamlText = '';
    
    if (!this.jsonText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter JSON data' 
        : '请输入JSON数据';
      return;
    }

    try {
      const obj = JSON.parse(this.jsonText);
      this.yamlText = this.jsonToYamlString(obj);
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Conversion error: ${(error as Error).message}`
        : `转换错误: ${(error as Error).message}`;
      this.yamlText = '';
    }
  }

  private parseYaml(yaml: string): any {
    // Basic YAML parser - for production use a proper library like js-yaml
    const lines = yaml.split('\n');
    const result: any = {};
    let currentPath: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const indent = line.length - line.trimStart().length;
      const match = trimmed.match(/^([^:]+):\s*(.*)$/);
      
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        
        // Adjust current path based on indent
        currentPath = currentPath.slice(0, indent / 2);
        currentPath.push(key);
        
        // Set value
        let obj = result;
        for (let i = 0; i < currentPath.length - 1; i++) {
          if (!obj[currentPath[i]]) {
            obj[currentPath[i]] = {};
          }
          obj = obj[currentPath[i]];
        }
        
        if (value === '') {
          obj[key] = null;
        } else if (value.startsWith('[') && value.endsWith(']')) {
          obj[key] = JSON.parse(value);
        } else if (value === 'true' || value === 'false') {
          obj[key] = value === 'true';
        } else if (!isNaN(Number(value)) && value !== '') {
          obj[key] = Number(value);
        } else {
          obj[key] = value.replace(/^["']|["']$/g, '');
        }
      }
    }
    
    return result;
  }

  private jsonToYamlString(obj: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          yaml += indentStr + '-\n' + this.jsonToYamlString(item, indent + 1);
        } else {
          yaml += indentStr + '- ' + this.formatValue(item) + '\n';
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          yaml += indentStr + key + ':\n' + this.jsonToYamlString(value, indent + 1);
        } else if (Array.isArray(value)) {
          yaml += indentStr + key + ':\n' + this.jsonToYamlString(value, indent + 1);
        } else {
          yaml += indentStr + key + ': ' + this.formatValue(value) + '\n';
        }
      }
    }
    
    return yaml;
  }

  private formatValue(value: any): string {
    if (value === null) return 'null';
    if (typeof value === 'string') {
      if (value.includes(':') || value.includes('\n') || value.startsWith(' ')) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  }

  clearAll() {
    this.yamlText = '';
    this.jsonText = '';
    this.errorMessage = '';
  }

  copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  swapContent() {
    const temp = this.yamlText;
    this.yamlText = this.jsonText;
    this.jsonText = temp;
    this.errorMessage = '';
    
    if (this.mode === 'yaml-to-json' && this.yamlText) {
      this.convert();
    } else if (this.mode === 'json-to-yaml' && this.jsonText) {
      this.convert();
    }
  }
}

