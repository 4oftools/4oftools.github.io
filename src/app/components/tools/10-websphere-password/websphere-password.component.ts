import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

@Component({
  selector: 'app-websphere-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './websphere-password.component.html',
  styleUrls: ['./websphere-password.component.css']
})
export class WebspherePasswordComponent implements OnInit {
  inputText: string = '';
  outputText: string = '';
  errorMessage: string = '';
  mode: 'encrypt' | 'decrypt' = 'encrypt';
  tool: Tool | undefined;

  // WebSphere XOR key (default key used by WebSphere)
  private readonly XOR_KEY = '{xor}';

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'websphere-password');
    });
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  switchMode() {
    this.mode = this.mode === 'encrypt' ? 'decrypt' : 'encrypt';
    this.inputText = '';
    this.outputText = '';
    this.errorMessage = '';
  }

  process() {
    if (this.mode === 'encrypt') {
      this.encrypt();
    } else {
      this.decrypt();
    }
  }

  encrypt() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter text to encrypt' 
        : '请输入要加密的文本';
      this.outputText = '';
      return;
    }

    try {
      // WebSphere XOR encryption
      const encrypted = this.xorEncrypt(this.inputText);
      this.outputText = this.XOR_KEY + encrypted;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Encryption error: ${(error as Error).message}`
        : `加密错误: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  decrypt() {
    this.errorMessage = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter encrypted text to decrypt' 
        : '请输入要解密的内容';
      this.outputText = '';
      return;
    }

    try {
      let encryptedText = this.inputText.trim();
      
      // Remove {xor} prefix if present
      if (encryptedText.startsWith(this.XOR_KEY)) {
        encryptedText = encryptedText.substring(this.XOR_KEY.length);
      }
      
      // WebSphere XOR decryption
      const decrypted = this.xorDecrypt(encryptedText);
      this.outputText = decrypted;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Decryption error: ${(error as Error).message}`
        : `解密错误: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  /**
   * WebSphere XOR encryption
   * WebSphere uses a simple XOR cipher with a repeating key
   */
  private xorEncrypt(text: string): string {
    const key = 'WebSphere';
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const encrypted = charCode ^ keyChar;
      
      // Convert to base64
      result += String.fromCharCode(encrypted);
    }
    
    // Encode to base64
    return btoa(result);
  }

  /**
   * WebSphere XOR decryption
   */
  private xorDecrypt(encryptedBase64: string): string {
    try {
      // Decode from base64
      const encrypted = atob(encryptedBase64);
      const key = 'WebSphere';
      let result = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        const encryptedChar = encrypted.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const decrypted = encryptedChar ^ keyChar;
        
        result += String.fromCharCode(decrypted);
      }
      
      return result;
    } catch (error) {
      throw new Error('Invalid encrypted format');
    }
  }

  clearAll() {
    this.inputText = '';
    this.outputText = '';
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
    const temp = this.inputText;
    this.inputText = this.outputText;
    this.outputText = temp;
    this.errorMessage = '';
    
    // Auto process after swap
    if (this.inputText) {
      this.process();
    }
  }
}

