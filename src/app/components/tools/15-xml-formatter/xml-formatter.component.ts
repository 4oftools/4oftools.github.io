import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-xml-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './xml-formatter.component.html',
  styleUrls: ['./xml-formatter.component.css']
})
export class XmlFormatterComponent implements OnInit {
  inputXml: string = '';
  outputXml: string = '';
  errorMessage: string = '';
  indentSize: number = 2;
  isCompressed: boolean = false;
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'xml-formatter');
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  formatXml() {
    this.errorMessage = '';
    
    if (!this.inputXml.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter XML data' 
        : '请输入XML数据';
      return;
    }

    try {
      const formatted = this.prettyPrintXml(this.inputXml, this.indentSize);
      this.outputXml = formatted;
      this.isCompressed = false;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Formatting error: ${(error as Error).message}`
        : `格式化错误: ${(error as Error).message}`;
      this.outputXml = '';
    }
  }

  compressXml() {
    this.errorMessage = '';
    
    if (!this.inputXml.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter XML data' 
        : '请输入XML数据';
      return;
    }

    try {
      const compressed = this.minifyXml(this.inputXml);
      this.outputXml = compressed;
      this.isCompressed = true;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Compression error: ${(error as Error).message}`
        : `压缩错误: ${(error as Error).message}`;
      this.outputXml = '';
    }
  }

  validateXml() {
    this.errorMessage = '';
    
    if (!this.inputXml.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter XML data' 
        : '请输入XML数据';
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.inputXml, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      
      if (parseError.length > 0) {
        const errorText = parseError[0].textContent || 'Unknown error';
        this.errorMessage = this.langService.currentLang === 'en'
          ? `Invalid XML: ${errorText}`
          : `无效的XML: ${errorText}`;
        this.outputXml = '';
      } else {
        this.errorMessage = this.langService.currentLang === 'en'
          ? '✓ Valid XML'
          : '✓ 有效的XML';
        this.outputXml = this.prettyPrintXml(this.inputXml, this.indentSize);
      }
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Validation error: ${(error as Error).message}`
        : `验证错误: ${(error as Error).message}`;
      this.outputXml = '';
    }
  }

  private prettyPrintXml(xml: string, indent: number): string {
    let formatted = '';
    let indentLevel = 0;
    const indentString = ' '.repeat(indent);
    
    // Remove existing whitespace and newlines
    xml = xml.replace(/>\s*</g, '><');
    
    // Split by tags
    const regex = /(<[^>]+>)/g;
    const parts = xml.split(regex);
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;
      
      if (part.startsWith('<?')) {
        // XML declaration
        formatted += part + '\n';
      } else if (part.startsWith('</')) {
        // Closing tag
        indentLevel--;
        formatted += indentString.repeat(indentLevel) + part + '\n';
      } else if (part.startsWith('<') && !part.endsWith('/>')) {
        // Opening tag
        formatted += indentString.repeat(indentLevel) + part + '\n';
        indentLevel++;
      } else if (part.endsWith('/>')) {
        // Self-closing tag
        formatted += indentString.repeat(indentLevel) + part + '\n';
      } else {
        // Text content
        if (part) {
          formatted += indentString.repeat(indentLevel) + part + '\n';
        }
      }
    }
    
    return formatted.trim();
  }

  private minifyXml(xml: string): string {
    // Remove comments
    xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove whitespace between tags
    xml = xml.replace(/>\s+</g, '><');
    
    // Remove leading and trailing whitespace
    xml = xml.replace(/^\s+|\s+$/g, '');
    
    // Remove newlines and extra spaces
    xml = xml.replace(/\n\s*/g, '');
    
    return xml;
  }

  clearAll() {
    this.inputXml = '';
    this.outputXml = '';
    this.errorMessage = '';
    this.isCompressed = false;
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
    const temp = this.inputXml;
    this.inputXml = this.outputXml;
    this.outputXml = temp;
    this.errorMessage = '';
  }
}

