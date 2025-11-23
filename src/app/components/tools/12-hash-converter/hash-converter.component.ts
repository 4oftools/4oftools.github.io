import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';
import * as CryptoJS from 'crypto-js';

type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | 'SHA3' | 'RIPEMD160';

@Component({
  selector: 'app-hash-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './hash-converter.component.html',
  styleUrls: ['./hash-converter.component.css']
})
export class HashConverterComponent implements OnInit {
  inputText: string = '';
  selectedAlgorithm: HashAlgorithm = 'MD5';
  hashResult: string = '';
  tool: Tool | undefined;

  algorithms: HashAlgorithm[] = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'SHA3', 'RIPEMD160'];

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'hash-converter');
    });
    
    // Auto generate hash on input change
    this.generateHash();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  generateHash() {
    if (!this.inputText.trim()) {
      this.hashResult = '';
      return;
    }

    try {
      let hash: CryptoJS.lib.WordArray;
      
      switch (this.selectedAlgorithm) {
        case 'MD5':
          hash = CryptoJS.MD5(this.inputText);
          break;
        case 'SHA1':
          hash = CryptoJS.SHA1(this.inputText);
          break;
        case 'SHA256':
          hash = CryptoJS.SHA256(this.inputText);
          break;
        case 'SHA512':
          hash = CryptoJS.SHA512(this.inputText);
          break;
        case 'SHA3':
          hash = CryptoJS.SHA3(this.inputText);
          break;
        case 'RIPEMD160':
          hash = CryptoJS.RIPEMD160(this.inputText);
          break;
        default:
          hash = CryptoJS.MD5(this.inputText);
      }
      
      this.hashResult = hash.toString();
    } catch (error) {
      this.hashResult = '';
      console.error('Failed to generate hash:', error);
    }
  }

  clearAll() {
    this.inputText = '';
    this.hashResult = '';
  }

  copyToClipboard(text: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个提示消息
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}

