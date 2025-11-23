import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';
import * as CryptoJS from 'crypto-js';

type CryptoAlgorithm = 'AES' | 'DES' | 'RC4' | 'Rabbit' | 'TripleDes';
type CryptoMode = 'encrypt' | 'decrypt';

@Component({
  selector: 'app-crypto-encryptor',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './crypto-encryptor.component.html',
  styleUrls: ['./crypto-encryptor.component.css']
})
export class CryptoEncryptorComponent implements OnInit {
  inputText: string = '';
  outputText: string = '';
  password: string = '';
  selectedAlgorithm: CryptoAlgorithm = 'AES';
  mode: CryptoMode = 'encrypt';
  errorMessage: string = '';
  tool: Tool | undefined;

  algorithms: CryptoAlgorithm[] = ['AES', 'DES', 'RC4', 'Rabbit', 'TripleDes'];

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'crypto-encryptor');
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
    this.outputText = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter text to encrypt' 
        : '请输入要加密的文本';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a password' 
        : '请输入密码';
      return;
    }

    try {
      let encrypted: string;
      
      switch (this.selectedAlgorithm) {
        case 'AES':
          encrypted = CryptoJS.AES.encrypt(this.inputText, this.password).toString();
          break;
        case 'DES':
          encrypted = CryptoJS.DES.encrypt(this.inputText, this.password).toString();
          break;
        case 'RC4':
          encrypted = CryptoJS.RC4.encrypt(this.inputText, this.password).toString();
          break;
        case 'Rabbit':
          encrypted = CryptoJS.Rabbit.encrypt(this.inputText, this.password).toString();
          break;
        case 'TripleDes':
          encrypted = CryptoJS.TripleDES.encrypt(this.inputText, this.password).toString();
          break;
        default:
          encrypted = CryptoJS.AES.encrypt(this.inputText, this.password).toString();
      }
      
      this.outputText = encrypted;
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
    this.outputText = '';
    
    if (!this.inputText.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter encrypted text to decrypt' 
        : '请输入要解密的文本';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = this.langService.currentLang === 'en' 
        ? 'Please enter a password' 
        : '请输入密码';
      return;
    }

    try {
      let decrypted: CryptoJS.lib.WordArray;
      
      switch (this.selectedAlgorithm) {
        case 'AES':
          decrypted = CryptoJS.AES.decrypt(this.inputText, this.password);
          break;
        case 'DES':
          decrypted = CryptoJS.DES.decrypt(this.inputText, this.password);
          break;
        case 'RC4':
          decrypted = CryptoJS.RC4.decrypt(this.inputText, this.password);
          break;
        case 'Rabbit':
          decrypted = CryptoJS.Rabbit.decrypt(this.inputText, this.password);
          break;
        case 'TripleDes':
          decrypted = CryptoJS.TripleDES.decrypt(this.inputText, this.password);
          break;
        default:
          decrypted = CryptoJS.AES.decrypt(this.inputText, this.password);
      }
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedText) {
        throw new Error('Invalid password or encrypted data');
      }
      
      this.outputText = decryptedText;
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = this.langService.currentLang === 'en'
        ? `Decryption error: ${(error as Error).message}`
        : `解密错误: ${(error as Error).message}`;
      this.outputText = '';
    }
  }

  clearAll() {
    this.inputText = '';
    this.outputText = '';
    this.password = '';
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
    
    if (this.inputText) {
      this.process();
    }
  }
}

