import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';

interface PaymentDetail {
  month: number;
  principal: number;
  interest: number;
  total: number;
  remaining: number;
}

@Component({
  selector: 'app-mortgage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.css']
})
export class MortgageCalculatorComponent implements OnInit {
  loanType: 'commercial' | 'provident' | 'combined' = 'commercial';
  loanAmount: number = 1000000;
  commercialLoanAmount: number = 0;
  providentLoanAmount: number = 0;
  loanTerm: number = 30;
  commercialRate: number = 4.5;
  providentRate: number = 3.1;
  paymentType: 'equal-payment' | 'equal-principal' = 'equal-payment';
  
  monthlyPayment: number = 0;
  totalInterest: number = 0;
  totalPayment: number = 0;
  paymentDetails: PaymentDetail[] = [];
  
  tool: Tool | undefined;

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // 根据路由获取工具数据
    this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'mortgage-calculator');
    });
    
    // 初始计算
    this.calculate();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  calculate() {
    if (this.loanTerm <= 0) {
      return;
    }

    if (this.loanType === 'combined') {
      if (this.commercialLoanAmount <= 0 && this.providentLoanAmount <= 0) {
        return;
      }
      this.calculateCombined();
    } else {
      if (this.loanAmount <= 0) {
        return;
      }
      const rate = this.loanType === 'commercial' ? this.commercialRate : this.providentRate;
      if (rate <= 0) {
        return;
      }
      
      if (this.paymentType === 'equal-payment') {
        this.calculateEqualPayment(this.loanAmount, rate);
      } else {
        this.calculateEqualPrincipal(this.loanAmount, rate);
      }
    }
  }

  onLoanTypeChange() {
    if (this.loanType === 'combined') {
      // 组合贷款时，将当前贷款总额分配给商业贷款
      this.commercialLoanAmount = this.loanAmount;
      this.providentLoanAmount = 0;
    } else {
      // 单一贷款时，合并商业和公积金贷款总额
      this.loanAmount = this.commercialLoanAmount + this.providentLoanAmount || 1000000;
      this.commercialLoanAmount = 0;
      this.providentLoanAmount = 0;
    }
    this.calculate();
  }

  private calculateEqualPayment(amount: number, rate: number) {
    // 等额本息计算
    const monthlyRate = rate / 100 / 12;
    const months = this.loanTerm * 12;
    
    if (monthlyRate === 0) {
      this.monthlyPayment = amount / months;
    } else {
      this.monthlyPayment = amount * 
        (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    this.totalPayment = this.monthlyPayment * months;
    this.totalInterest = this.totalPayment - amount;
    
    // 生成还款明细
    this.paymentDetails = [];
    let remaining = amount;
    
    for (let i = 1; i <= months; i++) {
      const interest = remaining * monthlyRate;
      const principal = this.monthlyPayment - interest;
      remaining -= principal;
      
      this.paymentDetails.push({
        month: i,
        principal: principal,
        interest: interest,
        total: this.monthlyPayment,
        remaining: Math.max(0, remaining)
      });
    }
  }

  private calculateEqualPrincipal(amount: number, rate: number) {
    // 等额本金计算
    const monthlyRate = rate / 100 / 12;
    const months = this.loanTerm * 12;
    const monthlyPrincipal = amount / months;
    
    this.paymentDetails = [];
    let remaining = amount;
    let totalInterest = 0;
    
    for (let i = 1; i <= months; i++) {
      const interest = remaining * monthlyRate;
      const total = monthlyPrincipal + interest;
      remaining -= monthlyPrincipal;
      totalInterest += interest;
      
      this.paymentDetails.push({
        month: i,
        principal: monthlyPrincipal,
        interest: interest,
        total: total,
        remaining: Math.max(0, remaining)
      });
    }
    
    // 等额本金的首月还款额
    this.monthlyPayment = this.paymentDetails[0].total;
    this.totalInterest = totalInterest;
    this.totalPayment = amount + this.totalInterest;
  }

  private calculateCombined() {
    // 组合贷款计算
    const months = this.loanTerm * 12;
    let commercialMonthly = 0;
    let providentMonthly = 0;
    let commercialTotalInterest = 0;
    let providentTotalInterest = 0;
    let commercialDetails: PaymentDetail[] = [];
    let providentDetails: PaymentDetail[] = [];

    // 计算商业贷款部分
    if (this.commercialLoanAmount > 0 && this.commercialRate > 0) {
      if (this.paymentType === 'equal-payment') {
        const monthlyRate = this.commercialRate / 100 / 12;
        if (monthlyRate === 0) {
          commercialMonthly = this.commercialLoanAmount / months;
        } else {
          commercialMonthly = this.commercialLoanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
        }
        commercialTotalInterest = commercialMonthly * months - this.commercialLoanAmount;
        
        let remaining = this.commercialLoanAmount;
        for (let i = 1; i <= months; i++) {
          const interest = remaining * monthlyRate;
          const principal = commercialMonthly - interest;
          remaining -= principal;
          commercialDetails.push({
            month: i,
            principal: principal,
            interest: interest,
            total: commercialMonthly,
            remaining: Math.max(0, remaining)
          });
        }
      } else {
        const monthlyRate = this.commercialRate / 100 / 12;
        const monthlyPrincipal = this.commercialLoanAmount / months;
        let remaining = this.commercialLoanAmount;
        let firstMonthTotal = 0;
        for (let i = 1; i <= months; i++) {
          const interest = remaining * monthlyRate;
          const total = monthlyPrincipal + interest;
          remaining -= monthlyPrincipal;
          commercialTotalInterest += interest;
          if (i === 1) firstMonthTotal = total;
          commercialDetails.push({
            month: i,
            principal: monthlyPrincipal,
            interest: interest,
            total: total,
            remaining: Math.max(0, remaining)
          });
        }
        commercialMonthly = firstMonthTotal;
      }
    }

    // 计算公积金贷款部分
    if (this.providentLoanAmount > 0 && this.providentRate > 0) {
      if (this.paymentType === 'equal-payment') {
        const monthlyRate = this.providentRate / 100 / 12;
        if (monthlyRate === 0) {
          providentMonthly = this.providentLoanAmount / months;
        } else {
          providentMonthly = this.providentLoanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);
        }
        providentTotalInterest = providentMonthly * months - this.providentLoanAmount;
        
        let remaining = this.providentLoanAmount;
        for (let i = 1; i <= months; i++) {
          const interest = remaining * monthlyRate;
          const principal = providentMonthly - interest;
          remaining -= principal;
          providentDetails.push({
            month: i,
            principal: principal,
            interest: interest,
            total: providentMonthly,
            remaining: Math.max(0, remaining)
          });
        }
      } else {
        const monthlyRate = this.providentRate / 100 / 12;
        const monthlyPrincipal = this.providentLoanAmount / months;
        let remaining = this.providentLoanAmount;
        let firstMonthTotal = 0;
        for (let i = 1; i <= months; i++) {
          const interest = remaining * monthlyRate;
          const total = monthlyPrincipal + interest;
          remaining -= monthlyPrincipal;
          providentTotalInterest += interest;
          if (i === 1) firstMonthTotal = total;
          providentDetails.push({
            month: i,
            principal: monthlyPrincipal,
            interest: interest,
            total: total,
            remaining: Math.max(0, remaining)
          });
        }
        providentMonthly = firstMonthTotal;
      }
    }

    // 合并结果
    this.monthlyPayment = commercialMonthly + providentMonthly;
    this.totalInterest = commercialTotalInterest + providentTotalInterest;
    this.totalPayment = (this.commercialLoanAmount + this.providentLoanAmount) + this.totalInterest;
    
    // 合并还款明细
    this.paymentDetails = [];
    for (let i = 0; i < months; i++) {
      const commercial = commercialDetails[i] || { principal: 0, interest: 0, total: 0, remaining: 0 };
      const provident = providentDetails[i] || { principal: 0, interest: 0, total: 0, remaining: 0 };
      this.paymentDetails.push({
        month: i + 1,
        principal: commercial.principal + provident.principal,
        interest: commercial.interest + provident.interest,
        total: commercial.total + provident.total,
        remaining: commercial.remaining + provident.remaining
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  clearAll() {
    this.loanType = 'commercial';
    this.loanAmount = 1000000;
    this.commercialLoanAmount = 0;
    this.providentLoanAmount = 0;
    this.loanTerm = 30;
    this.commercialRate = 4.5;
    this.providentRate = 3.1;
    this.paymentType = 'equal-payment';
    this.monthlyPayment = 0;
    this.totalInterest = 0;
    this.totalPayment = 0;
    this.paymentDetails = [];
  }
}

