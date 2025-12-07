import { SEOData } from '../services/seo.service';
import { Tool } from '../models/tool.model';

// 基础SEO配置
export const BASE_SEO: SEOData = {
  title: {
    zh: '否兔联盟 - 4oftools | 在线工具和应用集合平台',
    en: '4oftools - Online Tools and Apps Collection Platform'
  },
  description: {
    zh: '否兔联盟（4oftools）是一个集合了各种实用工具和应用的综合平台。提供JSON格式化、Base64编码、二维码生成、颜色选择器、时间戳转换、MD5哈希、URL编码、房贷计算器、JWT解析等在线工具。',
    en: '4oftools is a comprehensive platform that collects various practical tools and applications. Provides online tools including JSON formatter, Base64 encoder, QR code generator, color picker, timestamp converter, MD5 hash, URL encoder, mortgage calculator, JWT parser and more.'
  },
  keywords: {
    zh: '在线工具,工具集合,JSON格式化,Base64编码,二维码生成,时间戳转换,MD5哈希,URL编码,房贷计算器,JWT解析,开发工具,实用工具',
    en: 'online tools,tools collection,JSON formatter,Base64 encoder,QR code generator,timestamp converter,MD5 hash,URL encoder,mortgage calculator,JWT parser,development tools,utility tools'
  }
};

// 首页SEO
export const HOME_SEO: SEOData = {
  ...BASE_SEO,
  title: {
    zh: '否兔联盟 - 4oftools | 在线工具和应用集合平台',
    en: '4oftools - Online Tools and Apps Collection Platform'
  },
  description: {
    zh: '否兔联盟（4oftools）汇集了各种实用的在线工具和应用程序，包括开发工具、效率工具、生活工具和设计工具，让您的工作和生活更加便捷高效。',
    en: '4oftools collects various practical online tools and applications, including development tools, efficiency tools, life tools and design tools, making your work and life more convenient and efficient.'
  },
  keywords: {
    zh: '在线工具,工具集合,开发工具,效率工具,生活工具,设计工具,实用工具,免费工具',
    en: 'online tools,tools collection,development tools,efficiency tools,life tools,design tools,utility tools,free tools'
  }
};

// 工具列表页SEO
export const TOOLS_LIST_SEO: SEOData = {
  ...BASE_SEO,
  title: {
    zh: '工具集 - 否兔联盟 | 精选实用工具',
    en: 'Tools Collection - 4oftools | Curated Practical Tools'
  },
  description: {
    zh: '浏览否兔联盟精选的实用工具集合，包括JSON格式化、Base64编码、二维码生成、颜色选择器、时间戳转换、MD5哈希、URL编码、房贷计算器、JWT解析等多种在线工具。',
    en: 'Browse 4oftools curated collection of practical tools, including JSON formatter, Base64 encoder, QR code generator, color picker, timestamp converter, MD5 hash, URL encoder, mortgage calculator, JWT parser and more online tools.'
  },
  keywords: {
    zh: '工具集,在线工具,开发工具,JSON格式化,Base64编码,二维码生成,时间戳转换,MD5哈希,URL编码,房贷计算器,JWT解析',
    en: 'tools collection,online tools,development tools,JSON formatter,Base64 encoder,QR code generator,timestamp converter,MD5 hash,URL encoder,mortgage calculator,JWT parser'
  }
};

// 应用列表页SEO
export const APPS_LIST_SEO: SEOData = {
  ...BASE_SEO,
  title: {
    zh: '应用集合 - 否兔联盟 | 功能丰富的应用程序',
    en: 'Apps Collection - 4oftools | Feature-rich Applications'
  },
  description: {
    zh: '浏览否兔联盟收集的功能丰富的应用程序，满足您的各种需求，提高工作效率和生活品质。',
    en: 'Browse 4oftools collection of feature-rich applications to meet your various needs and improve work efficiency and quality of life.'
  },
  keywords: {
    zh: '应用集合,应用程序,在线应用,实用应用,效率应用,生活应用',
    en: 'apps collection,applications,online apps,practical apps,efficiency apps,life apps'
  }
};

// AI页面SEO
export const AI_PAGE_SEO: SEOData = {
  ...BASE_SEO,
  title: {
    zh: 'AI 前沿探索 - 否兔联盟 | 最新人工智能应用和技术',
    en: 'AI Exploration - 4oftools | Latest AI Applications and Technologies'
  },
  description: {
    zh: '探索否兔联盟汇集的最新人工智能应用、产品和技术，包括AI编程工具、AI底层模型、AI图片技术、AI视频技术等，了解人工智能领域的最新发展。',
    en: 'Explore the latest AI applications, products and technologies collected by 4oftools, including AI programming tools, AI foundation models, AI image technology, AI video technology and more, to understand the latest developments in artificial intelligence.'
  },
  keywords: {
    zh: 'AI,人工智能,AI工具,AI编程工具,AI模型,AI图片技术,AI视频技术,机器学习,深度学习',
    en: 'AI,artificial intelligence,AI tools,AI programming tools,AI models,AI image technology,AI video technology,machine learning,deep learning'
  }
};

// 赞助页面SEO
export const SPONSOR_PAGE_SEO: SEOData = {
  ...BASE_SEO,
  title: {
    zh: '赞助我们 - 否兔联盟 | 支持平台持续发展',
    en: 'Sponsor Us - 4oftools | Support Platform Development'
  },
  description: {
    zh: '支持否兔联盟的持续发展，您的赞助将帮助我们维护和开发新功能，改善用户体验，并支持服务器的运营成本。',
    en: 'Support the continuous development of 4oftools. Your sponsorship will help us maintain and develop new features, improve user experience, and support server operating costs.'
  },
  keywords: {
    zh: '赞助,支持,捐赠,否兔联盟,4oftools',
    en: 'sponsor,support,donate,4oftools'
  }
};

// 工具详情页SEO生成函数
export function getToolDetailSEO(tool: Tool): SEOData {
  const name = tool.nameEn ? `${tool.name} | ${tool.nameEn}` : tool.name;
  const nameEn = tool.nameEn || tool.name;
  const description = tool.descriptionEn ? `${tool.description} | ${tool.descriptionEn}` : tool.description;
  const descriptionEn = tool.descriptionEn || tool.description;
  const tags = tool.tags?.join(',') || '';
  const tagsEn = tool.tagsEn?.join(',') || '';

  return {
    title: {
      zh: `${tool.name} - 否兔联盟 | 在线工具`,
      en: `${nameEn} - 4oftools | Online Tool`
    },
    description: {
      zh: `${tool.description} 否兔联盟提供免费的在线${tool.name}工具，操作简单快捷。`,
      en: `${descriptionEn} 4oftools provides free online ${nameEn} tool, simple and fast operation.`
    },
    keywords: {
      zh: `${tool.name},在线工具,${tags},否兔联盟,4oftools`,
      en: `${nameEn},online tool,${tagsEn},4oftools`
    }
  };
}

// 应用详情页SEO生成函数
export function getAppDetailSEO(app: Tool): SEOData {
  const name = app.nameEn ? `${app.name} | ${app.nameEn}` : app.name;
  const nameEn = app.nameEn || app.name;
  const description = app.descriptionEn ? `${app.description} | ${app.descriptionEn}` : app.description;
  const descriptionEn = app.descriptionEn || app.description;
  const tags = app.tags?.join(',') || '';
  const tagsEn = app.tagsEn?.join(',') || '';

  return {
    title: {
      zh: `${app.name} - 否兔联盟 | 在线应用`,
      en: `${nameEn} - 4oftools | Online Application`
    },
    description: {
      zh: `${app.description} 否兔联盟提供免费的在线${app.name}应用，功能丰富实用。`,
      en: `${descriptionEn} 4oftools provides free online ${nameEn} application with rich and practical features.`
    },
    keywords: {
      zh: `${app.name},在线应用,${tags},否兔联盟,4oftools`,
      en: `${nameEn},online application,${tagsEn},4oftools`
    }
  };
}

// 各个工具页面的SEO配置
export const TOOL_PAGES_SEO: { [key: string]: SEOData } = {
  'json-formatter': {
    title: {
      zh: 'JSON格式化工具 - 否兔联盟 | 在线JSON格式化、验证和美化',
      en: 'JSON Formatter - 4oftools | Online JSON Format, Validate and Beautify'
    },
    description: {
      zh: '快速格式化、验证和美化JSON数据，支持压缩和展开模式，方便开发者调试和查看JSON结构。免费在线JSON格式化工具，无需安装，即用即走。',
      en: 'Quickly format, validate and beautify JSON data with support for compressed and expanded modes, convenient for developers to debug and view JSON structure. Free online JSON formatter tool, no installation required, ready to use.'
    },
    keywords: {
      zh: 'JSON格式化,JSON验证,JSON美化,JSON压缩,JSON展开,JSON工具,在线JSON工具,JSON解析器',
      en: 'JSON formatter,JSON validator,JSON beautifier,JSON compressor,JSON expander,JSON tool,online JSON tool,JSON parser'
    }
  },
  'base64-encoder': {
    title: {
      zh: 'Base64编解码器 - 否兔联盟 | 在线Base64编码和解码工具',
      en: 'Base64 Encoder/Decoder - 4oftools | Online Base64 Encoding and Decoding Tool'
    },
    description: {
      zh: '在线Base64编码和解码工具，支持文本、图片等多种格式的Base64转换，操作简单快捷。免费Base64编解码工具，支持批量处理。',
      en: 'Online Base64 encoding and decoding tool supporting text, images and various formats. Free Base64 encoder/decoder tool with batch processing support.'
    },
    keywords: {
      zh: 'Base64编码,Base64解码,Base64转换,Base64工具,在线Base64,Base64编解码器',
      en: 'Base64 encode,Base64 decode,Base64 converter,Base64 tool,online Base64,Base64 encoder decoder'
    }
  },
  'qr-code-generator': {
    title: {
      zh: '二维码生成器 - 否兔联盟 | 在线二维码生成工具',
      en: 'QR Code Generator - 4oftools | Online QR Code Generator Tool'
    },
    description: {
      zh: '快速生成各种类型的二维码，支持自定义颜色、尺寸和容错级别，可下载为图片格式。免费在线二维码生成器，支持文本、URL、联系方式等多种内容。',
      en: 'Quickly generate various types of QR codes with customizable colors, sizes and error correction levels, downloadable as image format. Free online QR code generator supporting text, URL, contact information and more.'
    },
    keywords: {
      zh: '二维码生成,QR码生成,二维码生成器,在线二维码,二维码工具,QR Code生成',
      en: 'QR code generator,QR code maker,QR code creator,online QR code,QR code tool,QR Code generator'
    }
  },
  'color-picker': {
    title: {
      zh: '颜色选择器 - 否兔联盟 | 在线颜色选择工具和调色板',
      en: 'Color Picker - 4oftools | Online Color Picker Tool and Palette'
    },
    description: {
      zh: '专业的颜色选择工具，支持RGB、HEX、HSL等多种颜色格式转换，提供调色板和颜色历史记录。免费在线颜色选择器，适合设计师和开发者使用。',
      en: 'Professional color picker supporting RGB, HEX, HSL and other color format conversions with palette and color history. Free online color picker suitable for designers and developers.'
    },
    keywords: {
      zh: '颜色选择器,调色板,颜色转换,RGB转换,HEX转换,HSL转换,在线颜色工具,颜色拾取器',
      en: 'color picker,color palette,color converter,RGB converter,HEX converter,HSL converter,online color tool,color picker tool'
    }
  },
  'timestamp-converter': {
    title: {
      zh: '时间戳转换器 - 否兔联盟 | Unix时间戳与日期时间转换工具',
      en: 'Timestamp Converter - 4oftools | Unix Timestamp and DateTime Conversion Tool'
    },
    description: {
      zh: 'Unix时间戳与日期时间相互转换工具，支持多种时区和日期格式，方便时间计算和转换。免费在线时间戳转换器，支持秒级和毫秒级时间戳。',
      en: 'Unix timestamp and datetime conversion tool supporting multiple timezones and date formats, convenient for time calculation and conversion. Free online timestamp converter supporting second and millisecond timestamps.'
    },
    keywords: {
      zh: '时间戳转换,Unix时间戳,时间戳转日期,日期转时间戳,时间戳工具,在线时间戳转换器',
      en: 'timestamp converter,Unix timestamp,timestamp to date,date to timestamp,timestamp tool,online timestamp converter'
    }
  },
  'md5-hash': {
    title: {
      zh: 'MD5哈希生成器 - 否兔联盟 | 在线MD5哈希值生成工具',
      en: 'MD5 Hash Generator - 4oftools | Online MD5 Hash Value Generator Tool'
    },
    description: {
      zh: '快速生成文本的MD5哈希值，支持批量处理和多种输入格式，适用于密码加密和数据校验。免费在线MD5哈希生成器，安全可靠。',
      en: 'Quickly generate MD5 hash values for text with batch processing support and multiple input formats, suitable for password encryption and data verification. Free online MD5 hash generator, secure and reliable.'
    },
    keywords: {
      zh: 'MD5哈希,MD5生成,MD5加密,MD5校验,MD5工具,在线MD5,MD5哈希值',
      en: 'MD5 hash,MD5 generator,MD5 encryption,MD5 checksum,MD5 tool,online MD5,MD5 hash value'
    }
  },
  'url-encoder': {
    title: {
      zh: 'URL编码解码 - 否兔联盟 | 在线URL编码和解码工具',
      en: 'URL Encoder/Decoder - 4oftools | Online URL Encoding and Decoding Tool'
    },
    description: {
      zh: '在线URL编码和解码工具，支持百分号编码和查询参数处理，方便处理特殊字符和中文。免费URL编码工具，支持批量编码解码。',
      en: 'Online URL encoding and decoding tool supporting percent encoding and query parameter processing, convenient for handling special characters and Chinese. Free URL encoder tool with batch encoding/decoding support.'
    },
    keywords: {
      zh: 'URL编码,URL解码,URL转义,百分号编码,URL工具,在线URL编码,URL编码器',
      en: 'URL encode,URL decode,URL escape,percent encoding,URL tool,online URL encoder,URL encoder decoder'
    }
  },
  'mortgage-calculator': {
    title: {
      zh: '房贷计算器 - 否兔联盟 | 在线房贷计算工具',
      en: 'Mortgage Calculator - 4oftools | Online Mortgage Calculation Tool'
    },
    description: {
      zh: '专业的房贷计算工具，支持等额本息和等额本金两种还款方式，提供详细的还款计划和利息计算。免费在线房贷计算器，帮助您规划购房贷款。',
      en: 'Professional mortgage calculator supporting equal payment and equal principal repayment methods with detailed payment plans and interest calculations. Free online mortgage calculator to help you plan home purchase loans.'
    },
    keywords: {
      zh: '房贷计算器,房贷计算,等额本息,等额本金,还款计算,房贷工具,在线房贷计算器',
      en: 'mortgage calculator,mortgage calculation,equal payment,equal principal,payment calculation,mortgage tool,online mortgage calculator'
    }
  },
  'jwt-parser': {
    title: {
      zh: 'JWT解析器 - 否兔联盟 | 在线JWT Token解析工具',
      en: 'JWT Parser - 4oftools | Online JWT Token Parser Tool'
    },
    description: {
      zh: '解析和查看JWT (JSON Web Token) 的结构，包括Header、Payload和Signature，显示token的过期时间和签发信息。免费在线JWT解析器，方便开发者调试JWT。',
      en: 'Parse and view JWT (JSON Web Token) structure including Header, Payload and Signature, showing expiration time and issuer information. Free online JWT parser, convenient for developers to debug JWT.'
    },
    keywords: {
      zh: 'JWT解析,JWT解析器,JWT Token,JSON Web Token,JWT工具,在线JWT解析,Token解析',
      en: 'JWT parser,JWT decoder,JWT Token,JSON Web Token,JWT tool,online JWT parser,Token parser'
    }
  },
  'websphere-password': {
    title: {
      zh: 'WebSphere密码加解密 - 否兔联盟 | WebSphere密码加密解密工具',
      en: 'WebSphere Password Encrypt/Decrypt - 4oftools | WebSphere Password Encryption Tool'
    },
    description: {
      zh: 'WebSphere Application Server密码加解密工具，支持XOR加密算法，用于加密和解密WebSphere配置文件中的密码。免费在线WebSphere密码工具。',
      en: 'WebSphere Application Server password encryption/decryption tool supporting XOR encryption algorithm for encrypting and decrypting passwords in WebSphere configuration files. Free online WebSphere password tool.'
    },
    keywords: {
      zh: 'WebSphere密码,WebSphere加密,WebSphere解密,XOR加密,WebSphere工具,密码加解密',
      en: 'WebSphere password,WebSphere encrypt,WebSphere decrypt,XOR encryption,WebSphere tool,password encrypt decrypt'
    }
  },
  'number-converter': {
    title: {
      zh: '进制转换器 - 否兔联盟 | 二进制、八进制、十进制、十六进制转换工具',
      en: 'Number Base Converter - 4oftools | Binary, Octal, Decimal, Hexadecimal Converter'
    },
    description: {
      zh: '支持二进制、八进制、十进制、十六进制之间的相互转换，方便进行不同进制数值的转换计算。免费在线进制转换器，支持多种进制转换。',
      en: 'Convert between binary, octal, decimal and hexadecimal number systems for easy number base conversion. Free online number base converter supporting multiple base conversions.'
    },
    keywords: {
      zh: '进制转换,二进制转换,八进制转换,十进制转换,十六进制转换,进制转换器,在线进制转换',
      en: 'number base converter,binary converter,octal converter,decimal converter,hexadecimal converter,base converter,online base converter'
    }
  },
  'hash-converter': {
    title: {
      zh: '散列和哈希转换器 - 否兔联盟 | 多种哈希算法在线工具',
      en: 'Hash Converter - 4oftools | Multiple Hash Algorithms Online Tool'
    },
    description: {
      zh: '支持多种哈希算法（MD5、SHA1、SHA256、SHA512、SHA3、RIPEMD160），快速生成文本的哈希值。免费在线哈希转换器，支持多种哈希算法。',
      en: 'Support multiple hash algorithms (MD5, SHA1, SHA256, SHA512, SHA3, RIPEMD160) for quick hash generation. Free online hash converter supporting multiple hash algorithms.'
    },
    keywords: {
      zh: '哈希转换,MD5,SHA1,SHA256,SHA512,SHA3,RIPEMD160,哈希算法,哈希工具,在线哈希',
      en: 'hash converter,MD5,SHA1,SHA256,SHA512,SHA3,RIPEMD160,hash algorithm,hash tool,online hash'
    }
  },
  'crypto-encryptor': {
    title: {
      zh: '加密解密器 - 否兔联盟 | 多种加密算法在线工具',
      en: 'Crypto Encryptor/Decryptor - 4oftools | Multiple Encryption Algorithms Online Tool'
    },
    description: {
      zh: '支持多种加密算法（AES、DES、RC4、Rabbit、TripleDes）的加密和解密操作，使用密码保护数据安全。免费在线加密解密工具，支持多种加密算法。',
      en: 'Encrypt and decrypt data using multiple algorithms (AES, DES, RC4, Rabbit, TripleDes) with password protection. Free online encryption/decryption tool supporting multiple encryption algorithms.'
    },
    keywords: {
      zh: '加密解密,AES加密,DES加密,RC4加密,Rabbit加密,TripleDes加密,加密工具,在线加密',
      en: 'encrypt decrypt,AES encryption,DES encryption,RC4 encryption,Rabbit encryption,TripleDes encryption,encryption tool,online encryption'
    }
  },
  'regex-tester': {
    title: {
      zh: '正则表达式校验器 - 否兔联盟 | 在线正则表达式测试工具',
      en: 'Regex Tester - 4oftools | Online Regular Expression Testing Tool'
    },
    description: {
      zh: '测试和验证正则表达式，支持多种标志（g、i、m、s、u、y），实时显示匹配结果和捕获组。免费在线正则表达式测试工具，方便开发者调试正则。',
      en: 'Test and validate regular expressions with multiple flags (g, i, m, s, u, y), showing match results and capture groups in real-time. Free online regex tester, convenient for developers to debug regular expressions.'
    },
    keywords: {
      zh: '正则表达式,正则测试,Regex测试,正则表达式工具,在线正则,正则校验,正则匹配',
      en: 'regular expression,regex test,regex tester,regex tool,online regex,regex validator,regex match'
    }
  },
  'xml-formatter': {
    title: {
      zh: 'XML格式化工具 - 否兔联盟 | 在线XML格式化、验证和压缩',
      en: 'XML Formatter - 4oftools | Online XML Format, Validate and Compress'
    },
    description: {
      zh: '快速格式化、验证和压缩XML数据，支持自定义缩进大小，方便开发者查看和调试XML结构。免费在线XML格式化工具，无需安装。',
      en: 'Quickly format, validate and compress XML data with customizable indent size for viewing and debugging XML structure. Free online XML formatter tool, no installation required.'
    },
    keywords: {
      zh: 'XML格式化,XML验证,XML压缩,XML美化,XML工具,在线XML工具,XML解析器',
      en: 'XML formatter,XML validator,XML compressor,XML beautifier,XML tool,online XML tool,XML parser'
    }
  },
  'crontab-calculator': {
    title: {
      zh: 'Crontab计算器 - 否兔联盟 | Cron表达式解析和计算工具',
      en: 'Crontab Calculator - 4oftools | Cron Expression Parser and Calculator'
    },
    description: {
      zh: '解析Cron表达式并计算下次执行时间，显示未来10次执行计划，帮助理解和验证定时任务配置。免费在线Crontab计算器，方便开发者配置定时任务。',
      en: 'Parse cron expressions and calculate next execution times, showing the next 10 scheduled runs to help understand and verify cron job configurations. Free online crontab calculator, convenient for developers to configure scheduled tasks.'
    },
    keywords: {
      zh: 'Crontab计算器,Cron表达式,Cron计算,定时任务,任务调度,在线Crontab工具',
      en: 'crontab calculator,cron expression,cron calculator,scheduled task,task scheduler,online crontab tool'
    }
  },
  'yaml-json-converter': {
    title: {
      zh: 'YAML/JSON转换器 - 否兔联盟 | 在线YAML和JSON格式转换工具',
      en: 'YAML/JSON Converter - 4oftools | Online YAML and JSON Format Converter'
    },
    description: {
      zh: 'YAML和JSON格式之间的相互转换工具，支持格式化输出，方便配置文件格式转换。免费在线YAML/JSON转换器，支持双向转换。',
      en: 'Convert between YAML and JSON formats with formatted output for easy configuration file format conversion. Free online YAML/JSON converter supporting bidirectional conversion.'
    },
    keywords: {
      zh: 'YAML转JSON,JSON转YAML,YAML转换,JSON转换,配置文件转换,在线YAML JSON转换器',
      en: 'YAML to JSON,JSON to YAML,YAML converter,JSON converter,config file converter,online YAML JSON converter'
    }
  }
};


