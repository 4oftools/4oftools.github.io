import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ToolService } from '../../../services/tool.service';
import { SEOService } from '../../../services/seo.service';
import { Tool } from '../../../models/tool.model';
import { ToolHeaderComponent } from '../shared/tool-header/tool-header.component';
import { TOOL_PAGES_SEO } from '../../../config/seo.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-severance-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolHeaderComponent],
  templateUrl: './severance-calculator.component.html',
  styleUrls: ['./severance-calculator.component.css']
})
export class SeveranceCalculatorComponent implements OnInit, OnDestroy {
  // 输入字段
  startDate: string = ''; // 入职日期
  endDate: string = ''; // 裁员日期（当前日期）
  terminationType: 'economic' | 'illegal' = 'economic'; // 裁员类型：经济性裁员或违法裁员
  yMonths: number = 1; // Y的月数（N+几个月工资中的几个月）
  lastYearTotalSalary: number = 120000; // 去年全年薪资
  tripleSocialAverage: number = 30000; // 三倍社平工资
  contractMonthlySalary: number = 10000; // 合同中的月度基本薪资
  
  // 格式化显示值（用于输入框显示）
  lastYearTotalSalaryDisplay: string = '120,000';
  tripleSocialAverageDisplay: string = '30,000';
  contractMonthlySalaryDisplay: string = '10,000';
  
  // 计算结果
  severancePay: number = 0; // 总补偿 = N + Y
  nMonths: number = 0; // N的月数
  nSalary: number = 0; // N的薪资基数
  nAmount: number = 0; // N的金额
  yAmount: number = 0; // Y的金额
  calculationDetails: string = '';
  tool: Tool | undefined;
  private subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private toolService: ToolService,
    private route: ActivatedRoute,
    private seoService: SEOService
  ) {}

  ngOnInit() {
    // 设置默认日期
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    
    // 设置默认入职日期为5年前
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    this.startDate = fiveYearsAgo.toISOString().split('T')[0];
    
    // 初始化格式化显示值
    this.lastYearTotalSalaryDisplay = this.formatNumber(this.lastYearTotalSalary);
    this.tripleSocialAverageDisplay = this.formatNumber(this.tripleSocialAverage);
    this.contractMonthlySalaryDisplay = this.formatNumber(this.contractMonthlySalary);
    
    // 设置SEO
    this.seoService.setSEO(TOOL_PAGES_SEO['severance-calculator']);
    
    // 订阅语言变化，更新SEO
    const langSub = this.langService.getCurrentLanguage().subscribe(() => {
      this.seoService.setSEO(TOOL_PAGES_SEO['severance-calculator']);
    });
    this.subscriptions.add(langSub);

    // 根据路由获取工具数据
    const toolSub = this.toolService.getAllTools().subscribe(tools => {
      this.tool = tools.find(t => t.internalRoute === 'severance-calculator');
    });
    this.subscriptions.add(toolSub);
    
    // 初始计算
    this.calculate();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  t(key: string): string {
    return this.langService.translate(key);
  }

  calculate() {
    // 验证输入
    if (!this.startDate || !this.endDate || this.lastYearTotalSalary <= 0 || 
        this.tripleSocialAverage <= 0 || this.contractMonthlySalary <= 0) {
      this.severancePay = 0;
      this.nMonths = 0;
      this.nSalary = 0;
      this.nAmount = 0;
      this.yAmount = 0;
      this.calculationDetails = '';
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    if (start >= end) {
      this.severancePay = 0;
      this.calculationDetails = this.langService.currentLang === 'en'
        ? 'Start date must be before end date'
        : '入职日期必须早于裁员日期';
      return;
    }

    // 计算实际工作年限（月数）
    let totalMonths = this.calculateMonthsBetween(start, end);

    // 判断是否在2008年之前入职
    const startYear = start.getFullYear();
    const isBefore2008 = startYear <= 2008;
    
    // 2008年1月1日作为分界点
    const cutoffDate = new Date(2008, 0, 1); // 2008年1月1日

    // 计算N的月数
    let nMonths = 0;
    
    if (totalMonths < 6) {
      // 不满半年，按半年算
      nMonths = 0.5;
    } else if (totalMonths < 12) {
      // 不满一年，按一年算
      nMonths = 1;
    } else {
      // 1年以上，需要分2008年前后计算
      if (isBefore2008 && end > cutoffDate) {
        // 跨2008年的情况：需要分两部分计算
        // 2008年之前的部分
        const before2008Months = this.calculateMonthsBetween(start, cutoffDate);
        const before2008N = this.calculateWorkYears(before2008Months);
        
        // 2008年之后的部分
        const after2008Months = this.calculateMonthsBetween(cutoffDate, end);
        let after2008N = this.calculateWorkYears(after2008Months);
        
        // 2008年之前的部分：按实际工作年限，不受限制
        // before2008N 已经是实际工作年限
        
        // 2008年之后的部分：需要检查薪资限制
        const avgMonthlySalary = this.lastYearTotalSalary / 12;
        
        if (avgMonthlySalary > this.tripleSocialAverage) {
          // 去年平均月薪超过三倍社平，2008年之后的部分最高按12个月计算
          if (after2008N > 12) {
            after2008N = 12;
          }
        }
        // 如果不超过三倍社平，2008年之后的部分就是实际工作年限，不需要调整
        
        // N = 2008年之前的部分 + 2008年之后的部分
        nMonths = before2008N + after2008N;
      } else if (isBefore2008 && end <= cutoffDate) {
        // 全部在2008年之前，按实际工作年限，不受限制
        nMonths = this.calculateWorkYears(totalMonths);
      } else {
        // 全部在2008年之后，需要检查薪资限制
        let calculatedN = this.calculateWorkYears(totalMonths);
        
        const avgMonthlySalary = this.lastYearTotalSalary / 12;
        
        if (avgMonthlySalary > this.tripleSocialAverage) {
          // 去年平均月薪超过三倍社平
          if (calculatedN > 12) {
            calculatedN = 12;
          }
        }
        // 如果不超过三倍社平，N就是实际工作年限，不需要调整
        nMonths = calculatedN;
      }
    }

    // 计算N的薪资基数：min(去年全年薪资/12, 三倍社平)
    const avgMonthlySalary = this.lastYearTotalSalary / 12;
    this.nSalary = Math.min(avgMonthlySalary, this.tripleSocialAverage);

    // 计算N的金额
    this.nAmount = this.nSalary * nMonths;
    this.nMonths = nMonths;

    // 计算Y的金额（Y个月的合同基本薪资）
    this.yAmount = this.contractMonthlySalary * this.yMonths;

    // 总补偿 = N + Y
    // 根据裁员类型计算总补偿
    if (this.terminationType === 'illegal') {
      // 违法裁员：2N + Y
      this.severancePay = this.nAmount * 2 + this.yAmount;
    } else {
      // 经济性裁员：N + Y
      this.severancePay = this.nAmount + this.yAmount;
    }

    // 生成计算说明
    this.generateCalculationDetails(startYear, totalMonths, isBefore2008, avgMonthlySalary);
  }

  generateCalculationDetails(startYear: number, totalMonths: number, isBefore2008: boolean, avgMonthlySalary: number) {
    const isZh = this.langService.currentLang === 'zh';
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    let details: string[] = [];
    
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const cutoffDate = new Date(2008, 0, 1); // 2008年1月1日
    
    // 工作年限说明
    if (isZh) {
      details.push(`工作年限：${years}年${months}个月（总计${totalMonths}个月）`);
      
      if (totalMonths < 6) {
        details.push(`不满半年，按半年计算：N = 0.5`);
      } else if (totalMonths < 12) {
        details.push(`不满一年，按一年计算：N = 1`);
      } else {
        // 判断是否跨2008年
        if (isBefore2008 && end > cutoffDate) {
          // 跨2008年的情况
          const before2008Months = this.calculateMonthsBetween(start, cutoffDate);
          const before2008Years = Math.floor(before2008Months / 12);
          const before2008RemainingMonths = before2008Months % 12;
          const before2008N = this.calculateWorkYears(before2008Months);
          
          const after2008Months = this.calculateMonthsBetween(cutoffDate, end);
          const after2008Years = Math.floor(after2008Months / 12);
          const after2008RemainingMonths = after2008Months % 12;
          let after2008N = this.calculateWorkYears(after2008Months);
          
          // 检查2008年之后部分的薪资限制
          if (avgMonthlySalary > this.tripleSocialAverage && after2008N > 12) {
            after2008N = 12;
          }
          
          details.push(`2008年之前部分：${before2008Years}年${before2008RemainingMonths}个月，按实际工作年限计算：N = ${before2008N}`);
          details.push(`2008年之后部分：${after2008Years}年${after2008RemainingMonths}个月`);
          
          details.push(`去年平均月薪：${this.formatNumber(avgMonthlySalary)}元`);
          details.push(`三倍社平工资：${this.formatNumber(this.tripleSocialAverage)}元`);
          
          if (avgMonthlySalary > this.tripleSocialAverage) {
            if (this.calculateWorkYears(after2008Months) > 12) {
              details.push(`平均月薪超过三倍社平，2008年之后部分最高按12个月计算：N = 12`);
            } else {
              details.push(`平均月薪超过三倍社平，但2008年之后部分未超过12个月：N = ${after2008N}`);
            }
          } else {
            details.push(`平均月薪未超过三倍社平，2008年之后部分按实际工作年限计算：N = ${after2008N}`);
          }
          
          details.push(`合计：N = ${before2008N} + ${after2008N} = ${this.nMonths}`);
        } else if (isBefore2008 && end <= cutoffDate) {
          // 全部在2008年之前
          const calculatedN = this.calculateWorkYears(totalMonths);
          if (months > 6) {
            details.push(`剩余${months}个月大于6个月，按1年计算：N = ${years + 1}`);
          } else if (months > 0) {
            details.push(`剩余${months}个月小于等于6个月，按0.5年计算：N = ${years + 0.5}`);
          } else {
            details.push(`正好${years}年：N = ${years}`);
          }
          details.push(`全部在2008年（含）之前，不适用薪资限制，按实际工作年限计算：N = ${calculatedN}`);
        } else {
          // 全部在2008年之后
          const calculatedN = this.calculateWorkYears(totalMonths);
          if (months > 6) {
            details.push(`剩余${months}个月大于6个月，按1年计算：N = ${years + 1}`);
          } else if (months > 0) {
            details.push(`剩余${months}个月小于等于6个月，按0.5年计算：N = ${years + 0.5}`);
          } else {
            details.push(`正好${years}年：N = ${years}`);
          }
          
          details.push(`去年平均月薪：${this.formatNumber(avgMonthlySalary)}元`);
          details.push(`三倍社平工资：${this.formatNumber(this.tripleSocialAverage)}元`);
          if (avgMonthlySalary > this.tripleSocialAverage) {
            details.push(`平均月薪超过三倍社平，N最高按12个月计算`);
            if (this.nMonths > 12) {
              details.push(`N从${this.calculateWorkYears(totalMonths)}调整为12`);
            }
          } else {
            details.push(`平均月薪未超过三倍社平，N按实际工作年限计算`);
          }
        }
      }
    } else {
      // 英文版本
      details.push(`Work period: ${years} years ${months} months (total ${totalMonths} months)`);
      
      if (totalMonths < 6) {
        details.push(`Less than 6 months, counted as 0.5: N = 0.5`);
      } else if (totalMonths < 12) {
        details.push(`Less than 1 year, counted as 1: N = 1`);
      } else {
        if (isBefore2008 && end > cutoffDate) {
          // 跨2008年的情况
          const before2008Months = this.calculateMonthsBetween(start, cutoffDate);
          const before2008Years = Math.floor(before2008Months / 12);
          const before2008RemainingMonths = before2008Months % 12;
          const before2008N = this.calculateWorkYears(before2008Months);
          
          const after2008Months = this.calculateMonthsBetween(cutoffDate, end);
          const after2008Years = Math.floor(after2008Months / 12);
          const after2008RemainingMonths = after2008Months % 12;
          let after2008N = this.calculateWorkYears(after2008Months);
          
          if (avgMonthlySalary > this.tripleSocialAverage && after2008N > 12) {
            after2008N = 12;
          }
          
          details.push(`Before 2008: ${before2008Years} years ${before2008RemainingMonths} months, counted as actual work years: N = ${before2008N}`);
          details.push(`After 2008: ${after2008Years} years ${after2008RemainingMonths} months`);
          
          details.push(`Last year average monthly salary: ${this.formatNumber(avgMonthlySalary)} yuan`);
          details.push(`Triple social average: ${this.formatNumber(this.tripleSocialAverage)} yuan`);
          
          if (avgMonthlySalary > this.tripleSocialAverage) {
            if (this.calculateWorkYears(after2008Months) > 12) {
              details.push(`Average salary exceeds triple social average, after 2008 part capped at 12: N = 12`);
            } else {
              details.push(`Average salary exceeds triple social average, but after 2008 part ≤ 12: N = ${after2008N}`);
            }
          } else {
            details.push(`Average salary does not exceed triple social average, after 2008 part = actual work years: N = ${after2008N}`);
          }
          
          details.push(`Total: N = ${before2008N} + ${after2008N} = ${this.nMonths}`);
        } else if (isBefore2008 && end <= cutoffDate) {
          const calculatedN = this.calculateWorkYears(totalMonths);
          if (months > 6) {
            details.push(`Remaining ${months} months > 6, counted as 1 year: N = ${years + 1}`);
          } else if (months > 0) {
            details.push(`Remaining ${months} months ≤ 6, counted as 0.5 year: N = ${years + 0.5}`);
          } else {
            details.push(`Exactly ${years} years: N = ${years}`);
          }
          details.push(`All before 2008 (inclusive), salary cap does not apply, N = actual work years: N = ${calculatedN}`);
        } else {
          const calculatedN = this.calculateWorkYears(totalMonths);
          if (months > 6) {
            details.push(`Remaining ${months} months > 6, counted as 1 year: N = ${years + 1}`);
          } else if (months > 0) {
            details.push(`Remaining ${months} months ≤ 6, counted as 0.5 year: N = ${years + 0.5}`);
          } else {
            details.push(`Exactly ${years} years: N = ${years}`);
          }
          
          details.push(`Last year average monthly salary: ${this.formatNumber(avgMonthlySalary)} yuan`);
          details.push(`Triple social average: ${this.formatNumber(this.tripleSocialAverage)} yuan`);
          if (avgMonthlySalary > this.tripleSocialAverage) {
            details.push(`Average salary exceeds triple social average, N capped at 12 months`);
            if (this.nMonths > 12) {
              details.push(`N adjusted from ${this.calculateWorkYears(totalMonths)} to 12`);
            }
          } else {
            details.push(`Average salary does not exceed triple social average, N = actual work years`);
          }
        }
      }
    }

    // N的薪资基数
    if (isZh) {
      details.push(`N的薪资基数 = min(去年平均月薪, 三倍社平) = min(${this.formatNumber(avgMonthlySalary)}, ${this.formatNumber(this.tripleSocialAverage)}) = ${this.formatNumber(this.nSalary)}`);
      details.push(`N的金额 = ${this.formatNumber(this.nSalary)} × ${this.nMonths} = ${this.formatNumber(this.nAmount)}`);
      details.push(`Y的金额 = 合同基本月薪 × Y月数 = ${this.formatNumber(this.contractMonthlySalary)} × ${this.yMonths} = ${this.formatNumber(this.yAmount)}`);
      if (this.terminationType === 'illegal') {
        details.push(`总补偿 = 2N + Y = 2 × ${this.formatNumber(this.nAmount)} + ${this.formatNumber(this.yAmount)} = ${this.formatNumber(this.severancePay)}`);
      } else {
        details.push(`总补偿 = N + Y = ${this.formatNumber(this.nAmount)} + ${this.formatNumber(this.yAmount)} = ${this.formatNumber(this.severancePay)}`);
      }
    } else {
      details.push(`N salary base = min(last year avg, triple social avg) = min(${this.formatNumber(avgMonthlySalary)}, ${this.formatNumber(this.tripleSocialAverage)}) = ${this.formatNumber(this.nSalary)}`);
      details.push(`N amount = ${this.formatNumber(this.nSalary)} × ${this.nMonths} = ${this.formatNumber(this.nAmount)}`);
      details.push(`Y amount = contract monthly salary × Y months = ${this.formatNumber(this.contractMonthlySalary)} × ${this.yMonths} = ${this.formatNumber(this.yAmount)}`);
      if (this.terminationType === 'illegal') {
        details.push(`Total compensation = 2N + Y = 2 × ${this.formatNumber(this.nAmount)} + ${this.formatNumber(this.yAmount)} = ${this.formatNumber(this.severancePay)}`);
      } else {
        details.push(`Total compensation = N + Y = ${this.formatNumber(this.nAmount)} + ${this.formatNumber(this.yAmount)} = ${this.formatNumber(this.severancePay)}`);
      }
    }

    this.calculationDetails = details.join('\n');
  }

  // 计算两个日期之间的月数
  calculateMonthsBetween(startDate: Date, endDate: Date): number {
    // 确保日期对象是新的实例，避免修改原始日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 同一天入职和离职，额外增加1个月
    if (start.getTime() === end.getTime()) {
      return 1;
    }
    
    // 计算年份和月份的差异
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    
    // 基础月数（不包含日期部分）
    let totalMonths = yearsDiff * 12 + monthsDiff;
    
    // 获取开始日期和结束日期的日期部分
    const startDay = start.getDate();
    const endDay = end.getDate();
    
    // 根据日期部分判断是否满一个月
    // 规则：
    // 1. 如果结束日期的日期部分 >= 开始日期的日期部分，说明已经满一个月，需要加1
    //    例如：2020-12-07 到 2025-12-07，基础月数是60，需要加1变成61
    // 2. 如果结束日期的日期部分 < 开始日期的日期部分，说明还没满一个月，基础月数保持不变
    //    例如：2020-12-07 到 2025-12-06，基础月数是60，保持不变（正好5年）
    //    特殊情况：如果开始日期是月末（如31日），且结束日期也是月末（如28日或29日），算作满一个月，需要加1
    
    if (endDay >= startDay) {
      // 结束日期的日期部分 >= 开始日期的日期部分，算作满一个月，需要加1
      totalMonths += 1;
    } else {
      // 结束日期的日期部分 < 开始日期的日期部分
      // 检查是否是月末的特殊情况
      // 获取开始日期所在月份的最后一天
      const startLastDay = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      // 获取结束日期所在月份的最后一天
      const endLastDay = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
      
      // 如果开始日期是月末（最后一天），且结束日期也是月末（最后一天）
      // 这种情况应该算作满一个月，需要加1
      // 例如：1月31日到2月28日，应该算1个月
      const isStartMonthEnd = startDay === startLastDay;
      const isEndMonthEnd = endDay === endLastDay;
      
      if (isStartMonthEnd && isEndMonthEnd) {
        // 都是月末，算作满一个月，需要加1
        totalMonths += 1;
      }
      // 否则，基础月数保持不变（还没满一个月）
    }
    
    // 确保结果不为负数
    return Math.max(0, totalMonths);
  }

  // 根据月数计算工作年限（年数）
  calculateWorkYears(totalMonths: number): number {
    if (totalMonths < 6) {
      return 0.5;
    } else if (totalMonths < 12) {
      return 1;
    } else {
      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;
      
      if (remainingMonths > 6) {
        // 剩余月数 > 6个月，按1年计算
        return years + 1;
      } else if (remainingMonths > 0) {
        // 剩余月数 <= 6个月，按0.5年计算
        return years + 0.5;
      } else {
        // 正好整年
        return years;
      }
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // 格式化数字（添加千位分隔符）
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // 解析数字（去除逗号和其他非数字字符）
  parseNumber(value: string): number {
    // 去除所有非数字字符（除了小数点）
    const cleaned = value.replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  // 处理去年全年薪资输入
  onLastYearTotalSalaryInput(event: any) {
    const value = event.target.value;
    const num = this.parseNumber(value);
    this.lastYearTotalSalary = num;
    this.lastYearTotalSalaryDisplay = this.formatNumber(num);
  }

  // 处理三倍社平工资输入
  onTripleSocialAverageInput(event: any) {
    const value = event.target.value;
    const num = this.parseNumber(value);
    this.tripleSocialAverage = num;
    this.tripleSocialAverageDisplay = this.formatNumber(num);
  }

  // 处理合同基本月薪输入
  onContractMonthlySalaryInput(event: any) {
    const value = event.target.value;
    const num = this.parseNumber(value);
    this.contractMonthlySalary = num;
    this.contractMonthlySalaryDisplay = this.formatNumber(num);
  }

  clearAll() {
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    this.startDate = fiveYearsAgo.toISOString().split('T')[0];
    
    this.terminationType = 'economic';
    this.yMonths = 1;
    this.lastYearTotalSalary = 120000;
    this.tripleSocialAverage = 30000;
    this.contractMonthlySalary = 10000;
    
    // 更新格式化显示值
    this.lastYearTotalSalaryDisplay = this.formatNumber(this.lastYearTotalSalary);
    this.tripleSocialAverageDisplay = this.formatNumber(this.tripleSocialAverage);
    this.contractMonthlySalaryDisplay = this.formatNumber(this.contractMonthlySalary);
    
    this.severancePay = 0;
    this.nMonths = 0;
    this.nSalary = 0;
    this.nAmount = 0;
    this.yAmount = 0;
    this.calculationDetails = '';
    this.calculate();
  }
}

