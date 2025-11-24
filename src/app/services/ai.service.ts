import { Injectable } from '@angular/core';
import { AIItem, AICategory } from '../models/ai-item.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private aiItems: AIItem[] = [
    // AI编程工具
    {
      id: 'ai-1',
      title: 'GitHub Copilot',
      titleEn: 'GitHub Copilot',
      description: 'AI编程助手，能够根据代码上下文自动生成代码片段和建议。',
      descriptionEn: 'AI coding assistant that automatically generates code snippets and suggestions based on code context.',
      category: 'programming',
      icon: '💻',
      tags: ['编程助手', '代码生成', 'GitHub'],
      featured: true,
      url: 'https://github.com/features/copilot',
      date: '2021-10'
    },
    {
      id: 'ai-2',
      title: 'Cursor',
      titleEn: 'Cursor',
      description: 'AI驱动的代码编辑器，提供智能代码补全、重构和调试建议。',
      descriptionEn: 'AI-powered code editor providing intelligent code completion, refactoring, and debugging suggestions.',
      category: 'programming',
      icon: '⌨️',
      tags: ['代码编辑器', 'AI辅助', '开发工具'],
      featured: true,
      url: 'https://cursor.sh',
      date: '2023-03'
    },
    {
      id: 'ai-3',
      title: 'Codeium',
      titleEn: 'Codeium',
      description: '免费的AI代码补全工具，支持多种编程语言和IDE。',
      descriptionEn: 'Free AI code completion tool supporting multiple programming languages and IDEs.',
      category: 'programming',
      icon: '🔧',
      tags: ['代码补全', '免费', '多语言'],
      featured: false,
      url: 'https://codeium.com',
      date: '2022-12'
    },
    {
      id: 'ai-4',
      title: 'Tabnine',
      titleEn: 'Tabnine',
      description: '企业级AI代码补全工具，支持私有部署和团队协作。',
      descriptionEn: 'Enterprise-grade AI code completion tool with support for private deployment and team collaboration.',
      category: 'programming',
      icon: '⚡',
      tags: ['代码补全', '企业级', '私有部署'],
      featured: false,
      url: 'https://www.tabnine.com',
      date: '2018-01'
    },
    {
      id: 'ai-5',
      title: 'Amazon CodeWhisperer',
      titleEn: 'Amazon CodeWhisperer',
      description: 'Amazon开发的AI编程助手，提供代码建议和安全扫描。',
      descriptionEn: 'AI coding assistant developed by Amazon, providing code suggestions and security scanning.',
      category: 'programming',
      icon: '☁️',
      tags: ['编程助手', 'AWS', '安全扫描'],
      featured: false,
      url: 'https://aws.amazon.com/codewhisperer',
      date: '2022-06'
    },
    {
      id: 'ai-6',
      title: 'Replit Ghostwriter',
      titleEn: 'Replit Ghostwriter',
      description: '在线IDE中的AI编程助手，支持实时代码生成和调试。',
      descriptionEn: 'AI coding assistant in online IDE, supporting real-time code generation and debugging.',
      category: 'programming',
      icon: '👻',
      tags: ['在线IDE', '代码生成', '实时协作'],
      featured: false,
      url: 'https://replit.com',
      date: '2023-01'
    },
    {
      id: 'ai-7',
      title: 'Sourcegraph Cody',
      titleEn: 'Sourcegraph Cody',
      description: '基于代码库的AI编程助手，能够理解整个代码库上下文。',
      descriptionEn: 'Codebase-aware AI coding assistant that understands the entire codebase context.',
      category: 'programming',
      icon: '🔍',
      tags: ['代码库分析', '上下文理解', '企业级'],
      featured: false,
      url: 'https://sourcegraph.com/cody',
      date: '2023-05'
    },
    {
      id: 'ai-8',
      title: 'Windsurf',
      titleEn: 'Windsurf',
      description: 'AI驱动的代码编辑器，专注于提高开发效率和代码质量。',
      descriptionEn: 'AI-powered code editor focused on improving development efficiency and code quality.',
      category: 'programming',
      icon: '🌊',
      tags: ['代码编辑器', 'AI辅助', '效率工具'],
      featured: false,
      url: 'https://www.windsurf.ai',
      date: '2023-08'
    },
    {
      id: 'ai-9',
      title: 'Trae',
      titleEn: 'Trae',
      description: 'AI编程助手工具，提供智能代码生成和开发辅助功能。',
      descriptionEn: 'AI coding assistant tool providing intelligent code generation and development assistance.',
      category: 'programming',
      icon: '🚀',
      tags: ['编程助手', '代码生成', '开发工具'],
      featured: false,
      url: 'https://trae.ai',
      date: '2023-06'
    },
    {
      id: 'ai-10',
      title: 'OpenAI Codex',
      titleEn: 'OpenAI Codex',
      description: 'OpenAI开发的代码生成模型，能够理解自然语言并生成相应的代码。',
      descriptionEn: 'Code generation model developed by OpenAI, capable of understanding natural language and generating corresponding code.',
      category: 'programming',
      icon: '📝',
      tags: ['代码生成', 'OpenAI', 'API'],
      featured: true,
      url: 'https://openai.com/api',
      date: '2021-06'
    },
    {
      id: 'ai-11',
      title: 'Claude Code',
      titleEn: 'Claude Code',
      description: 'Anthropic开发的AI编程助手，专注于代码理解、生成和优化。',
      descriptionEn: 'AI coding assistant developed by Anthropic, focused on code understanding, generation, and optimization.',
      category: 'programming',
      icon: '💡',
      tags: ['编程助手', 'Anthropic', '代码优化'],
      featured: true,
      url: 'https://www.anthropic.com',
      date: '2023-09'
    },
    {
      id: 'ai-12',
      title: 'Antigravity',
      titleEn: 'Antigravity',
      description: 'AI驱动的代码生成和重构工具，帮助开发者提高编程效率。',
      descriptionEn: 'AI-powered code generation and refactoring tool helping developers improve programming efficiency.',
      category: 'programming',
      icon: '🪐',
      tags: ['代码生成', '代码重构', '开发效率'],
      featured: false,
      url: 'https://antigravity.google/',
      date: '2023-10'
    },
    
    // AI底层模型
    {
      id: 'ai-13',
      title: 'GPT-4',
      titleEn: 'GPT-4',
      description: 'OpenAI最新的多模态大语言模型，支持文本和图像输入，性能大幅提升。',
      descriptionEn: 'OpenAI\'s latest multimodal large language model, supporting text and image inputs with significantly improved performance.',
      category: 'model',
      icon: '🧠',
      tags: ['大语言模型', '多模态', 'OpenAI'],
      featured: true,
      url: 'https://openai.com/gpt-4',
      date: '2023-03'
    },
    {
      id: 'ai-14',
      title: 'Claude 3',
      titleEn: 'Claude 3',
      description: 'Anthropic开发的最新大语言模型，在推理、数学和编程任务上表现优异。',
      descriptionEn: 'Latest large language model developed by Anthropic, excelling in reasoning, math, and programming tasks.',
      category: 'model',
      icon: '🤖',
      tags: ['大语言模型', 'Anthropic', '推理能力'],
      featured: true,
      url: 'https://www.anthropic.com/claude',
      date: '2024-03'
    },
    {
      id: 'ai-15',
      title: 'Gemini',
      titleEn: 'Gemini',
      description: 'Google开发的多模态AI模型，支持文本、图像、音频和视频理解。',
      descriptionEn: 'Multimodal AI model developed by Google, supporting text, image, audio, and video understanding.',
      category: 'model',
      icon: '💎',
      tags: ['多模态', 'Google', '大语言模型'],
      featured: true,
      url: 'https://deepmind.google/technologies/gemini',
      date: '2023-12'
    },
    {
      id: 'ai-16',
      title: 'LLaMA 2',
      titleEn: 'LLaMA 2',
      description: 'Meta开源的大语言模型，支持商业使用，性能接近GPT-3.5。',
      descriptionEn: 'Open-source large language model from Meta, supporting commercial use with performance close to GPT-3.5.',
      category: 'model',
      icon: '🦙',
      tags: ['开源', '大语言模型', 'Meta'],
      featured: true,
      url: 'https://ai.meta.com/llama',
      date: '2023-07'
    },
    {
      id: 'ai-17',
      title: 'Mistral AI',
      titleEn: 'Mistral AI',
      description: '欧洲开发的高效大语言模型，在性能和效率之间取得良好平衡。',
      descriptionEn: 'Efficient large language model developed in Europe, achieving a good balance between performance and efficiency.',
      category: 'model',
      icon: '🌪️',
      tags: ['大语言模型', '高效', '欧洲'],
      featured: false,
      url: 'https://mistral.ai',
      date: '2023-09'
    },
    {
      id: 'ai-18',
      title: 'Qwen',
      titleEn: 'Qwen',
      description: '阿里云开发的多语言大语言模型，支持中文和多种语言。',
      descriptionEn: 'Multilingual large language model developed by Alibaba Cloud, supporting Chinese and multiple languages.',
      category: 'model',
      icon: '🐉',
      tags: ['大语言模型', '多语言', '阿里云'],
      featured: false,
      url: 'https://qwenlm.github.io',
      date: '2023-09'
    },
    {
      id: 'ai-19',
      title: 'Yi',
      titleEn: 'Yi',
      description: '零一万物开发的开源大语言模型，在中文理解方面表现突出。',
      descriptionEn: 'Open-source large language model developed by 01.AI, excelling in Chinese understanding.',
      category: 'model',
      icon: '🎯',
      tags: ['开源', '大语言模型', '中文'],
      featured: false,
      url: 'https://01.ai',
      date: '2023-11'
    },
    {
      id: 'ai-20',
      title: 'PaLM 2',
      titleEn: 'PaLM 2',
      description: 'Google开发的下一代大语言模型，在数学、代码和推理任务上表现优异。',
      descriptionEn: 'Next-generation large language model developed by Google, excelling in math, code, and reasoning tasks.',
      category: 'model',
      icon: '🌴',
      tags: ['大语言模型', 'Google', '多任务'],
      featured: false,
      url: 'https://ai.google/discover/palm2',
      date: '2023-05'
    },
    
    // AI图片技术
    {
      id: 'ai-21',
      title: 'Midjourney',
      titleEn: 'Midjourney',
      description: 'AI图像生成工具，通过文本描述生成高质量的艺术作品和图像。',
      descriptionEn: 'AI image generation tool that creates high-quality artwork and images from text descriptions.',
      category: 'image',
      icon: '🎨',
      tags: ['图像生成', 'AI艺术', '创意工具'],
      featured: true,
      url: 'https://www.midjourney.com',
      date: '2022-07'
    },
    {
      id: 'ai-22',
      title: 'Stable Diffusion',
      titleEn: 'Stable Diffusion',
      description: '开源的文本到图像生成模型，可以在本地运行，支持高度定制。',
      descriptionEn: 'Open-source text-to-image generation model that can run locally with high customization support.',
      category: 'image',
      icon: '🖼️',
      tags: ['开源', '图像生成', '本地部署'],
      featured: true,
      url: 'https://stability.ai',
      date: '2022-08'
    },
    {
      id: 'ai-23',
      title: 'DALL-E 3',
      titleEn: 'DALL-E 3',
      description: 'OpenAI开发的最新图像生成模型，能够生成高质量、细节丰富的图像。',
      descriptionEn: 'Latest image generation model developed by OpenAI, capable of generating high-quality, detailed images.',
      category: 'image',
      icon: '🎭',
      tags: ['图像生成', 'OpenAI', '高质量'],
      featured: true,
      url: 'https://openai.com/dall-e-3',
      date: '2023-10'
    },
    {
      id: 'ai-24',
      title: 'Adobe Firefly',
      titleEn: 'Adobe Firefly',
      description: 'Adobe开发的创意生成式AI，集成到Creative Cloud中，支持商业使用。',
      descriptionEn: 'Creative generative AI developed by Adobe, integrated into Creative Cloud with commercial use support.',
      category: 'image',
      icon: '🔥',
      tags: ['图像生成', 'Adobe', '商业授权'],
      featured: true,
      url: 'https://www.adobe.com/products/firefly.html',
      date: '2023-03'
    },
    {
      id: 'ai-25',
      title: 'Leonardo.ai',
      titleEn: 'Leonardo.ai',
      description: '专业的AI图像生成平台，提供多种模型和风格选项。',
      descriptionEn: 'Professional AI image generation platform offering multiple models and style options.',
      category: 'image',
      icon: '🎨',
      tags: ['图像生成', '专业工具', '多风格'],
      featured: false,
      url: 'https://leonardo.ai',
      date: '2022-12'
    },
    {
      id: 'ai-26',
      title: 'Runway ML',
      titleEn: 'Runway ML',
      description: '创意AI工具套件，包括图像生成、编辑和视频生成功能。',
      descriptionEn: 'Creative AI toolkit including image generation, editing, and video generation features.',
      category: 'image',
      icon: '🎬',
      tags: ['图像生成', '视频生成', '创意工具'],
      featured: false,
      url: 'https://runwayml.com',
      date: '2018-01'
    },
    {
      id: 'ai-27',
      title: 'ComfyUI',
      titleEn: 'ComfyUI',
      description: '基于节点的工作流界面，用于运行和自定义Stable Diffusion模型。',
      descriptionEn: 'Node-based workflow interface for running and customizing Stable Diffusion models.',
      category: 'image',
      icon: '🔧',
      tags: ['工作流', 'Stable Diffusion', '自定义'],
      featured: false,
      url: 'https://github.com/comfyanonymous/ComfyUI',
      date: '2023-01'
    },
    {
      id: 'ai-28',
      title: 'Fooocus',
      titleEn: 'Fooocus',
      description: '简化版的Stable Diffusion界面，专注于易用性和高质量输出。',
      descriptionEn: 'Simplified Stable Diffusion interface focused on ease of use and high-quality output.',
      category: 'image',
      icon: '🎯',
      tags: ['Stable Diffusion', '简化界面', '易用'],
      featured: false,
      url: 'https://github.com/lllyasviel/Fooocus',
      date: '2023-08'
    },
    
    // AI视频技术
    {
      id: 'ai-29',
      title: 'Runway Gen-2',
      titleEn: 'Runway Gen-2',
      description: '文本到视频生成工具，能够从文本描述生成高质量视频。',
      descriptionEn: 'Text-to-video generation tool capable of generating high-quality videos from text descriptions.',
      category: 'video',
      icon: '🎥',
      tags: ['视频生成', '文本到视频', '创意工具'],
      featured: true,
      url: 'https://runwayml.com/gen2',
      date: '2023-03'
    },
    {
      id: 'ai-30',
      title: 'Pika',
      titleEn: 'Pika',
      description: 'AI视频生成和编辑工具，支持文本到视频和图像到视频转换。',
      descriptionEn: 'AI video generation and editing tool supporting text-to-video and image-to-video conversion.',
      category: 'video',
      icon: '🎬',
      tags: ['视频生成', '视频编辑', '多模态'],
      featured: true,
      url: 'https://pika.art',
      date: '2023-04'
    },
    {
      id: 'ai-31',
      title: 'Stable Video Diffusion',
      titleEn: 'Stable Video Diffusion',
      description: 'Stability AI开发的视频生成模型，基于Stable Diffusion技术。',
      descriptionEn: 'Video generation model developed by Stability AI, based on Stable Diffusion technology.',
      category: 'video',
      icon: '🎞️',
      tags: ['视频生成', '开源', 'Stability AI'],
      featured: true,
      url: 'https://stability.ai/stable-video',
      date: '2023-11'
    },
    {
      id: 'ai-32',
      title: 'Sora',
      titleEn: 'Sora',
      description: 'OpenAI开发的文本到视频生成模型，能够生成高质量、长时长的视频。',
      descriptionEn: 'Text-to-video generation model developed by OpenAI, capable of generating high-quality, long-duration videos.',
      category: 'video',
      icon: '🌊',
      tags: ['视频生成', 'OpenAI', '高质量'],
      featured: true,
      url: 'https://openai.com/sora',
      date: '2024-02'
    },
    {
      id: 'ai-33',
      title: 'Kling AI',
      titleEn: 'Kling AI',
      description: '快手开发的AI视频生成工具，支持文本到视频和图像到视频。',
      descriptionEn: 'AI video generation tool developed by Kuaishou, supporting text-to-video and image-to-video.',
      category: 'video',
      icon: '⚡',
      tags: ['视频生成', '快手', '中文'],
      featured: false,
      url: 'https://klingai.com',
      date: '2024-01'
    },
    {
      id: 'ai-34',
      title: 'Luma AI Dream Machine',
      titleEn: 'Luma AI Dream Machine',
      description: '高质量的文本到视频生成工具，专注于电影级视觉效果。',
      descriptionEn: 'High-quality text-to-video generation tool focused on cinematic visual effects.',
      category: 'video',
      icon: '✨',
      tags: ['视频生成', '电影级', '高质量'],
      featured: false,
      url: 'https://lumalabs.ai/dream-machine',
      date: '2024-06'
    },
    {
      id: 'ai-35',
      title: 'AnimateDiff',
      titleEn: 'AnimateDiff',
      description: '将静态图像转换为动画视频的开源工具，基于Stable Diffusion。',
      descriptionEn: 'Open-source tool for converting static images to animated videos, based on Stable Diffusion.',
      category: 'video',
      icon: '🎞️',
      tags: ['视频生成', '开源', '图像动画'],
      featured: false,
      url: 'https://github.com/guoyww/AnimateDiff',
      date: '2023-08'
    },
    {
      id: 'ai-36',
      title: 'VEED.io AI',
      titleEn: 'VEED.io AI',
      description: '在线视频编辑平台，集成AI视频生成和编辑功能。',
      descriptionEn: 'Online video editing platform with integrated AI video generation and editing features.',
      category: 'video',
      icon: '✂️',
      tags: ['视频编辑', '在线工具', 'AI辅助'],
      featured: false,
      url: 'https://www.veed.io',
      date: '2018-01'
    },
    
    // 其他AI应用
    {
      id: 'ai-37',
      title: 'ChatGPT',
      titleEn: 'ChatGPT',
      description: 'OpenAI开发的强大对话AI，能够进行自然语言对话、回答问题、协助写作等多种任务。',
      descriptionEn: 'Powerful conversational AI developed by OpenAI, capable of natural language dialogue, answering questions, and assisting with writing tasks.',
      category: 'other',
      icon: '🤖',
      tags: ['对话AI', '自然语言处理', 'OpenAI'],
      featured: true,
      url: 'https://chat.openai.com',
      date: '2022-11'
    },
    {
      id: 'ai-38',
      title: 'Claude',
      titleEn: 'Claude',
      description: 'Anthropic开发的AI助手，专注于安全、有帮助和诚实的对话。',
      descriptionEn: 'AI assistant developed by Anthropic, focused on safe, helpful, and honest conversations.',
      category: 'other',
      icon: '💬',
      tags: ['对话AI', 'Anthropic', 'AI助手'],
      featured: true,
      url: 'https://www.anthropic.com',
      date: '2023-03'
    },
    {
      id: 'ai-39',
      title: 'Perplexity',
      titleEn: 'Perplexity',
      description: 'AI搜索引擎，结合搜索和AI对话，提供实时、准确的答案。',
      descriptionEn: 'AI search engine combining search and AI conversation to provide real-time, accurate answers.',
      category: 'other',
      icon: '🔍',
      tags: ['AI搜索', '实时信息', '对话式'],
      featured: true,
      url: 'https://www.perplexity.ai',
      date: '2022-08'
    },
    {
      id: 'ai-40',
      title: 'Notion AI',
      titleEn: 'Notion AI',
      description: '集成在Notion中的AI助手，帮助写作、总结和头脑风暴。',
      descriptionEn: 'AI assistant integrated into Notion, helping with writing, summarization, and brainstorming.',
      category: 'other',
      icon: '📝',
      tags: ['笔记工具', 'AI写作', '生产力'],
      featured: false,
      url: 'https://www.notion.so/product/ai',
      date: '2023-02'
    },
    {
      id: 'ai-41',
      title: 'Character.AI',
      titleEn: 'Character.AI',
      description: '创建和与AI角色对话的平台，支持自定义角色和多种对话场景。',
      descriptionEn: 'Platform for creating and conversing with AI characters, supporting custom characters and various conversation scenarios.',
      category: 'other',
      icon: '👤',
      tags: ['AI角色', '对话', '娱乐'],
      featured: false,
      url: 'https://character.ai',
      date: '2022-09'
    },
    {
      id: 'ai-42',
      title: 'Jasper',
      titleEn: 'Jasper',
      description: 'AI内容创作工具，帮助生成营销文案、博客文章和社交媒体内容。',
      descriptionEn: 'AI content creation tool helping generate marketing copy, blog posts, and social media content.',
      category: 'other',
      icon: '✍️',
      tags: ['内容创作', '营销', '写作助手'],
      featured: false,
      url: 'https://www.jasper.ai',
      date: '2021-02'
    },
    {
      id: 'ai-43',
      title: 'Copy.ai',
      titleEn: 'Copy.ai',
      description: 'AI文案生成工具，快速生成各种类型的营销和销售文案。',
      descriptionEn: 'AI copywriting tool for quickly generating various types of marketing and sales copy.',
      category: 'other',
      icon: '📄',
      tags: ['文案生成', '营销', '快速创作'],
      featured: false,
      url: 'https://www.copy.ai',
      date: '2020-10'
    },
    {
      id: 'ai-44',
      title: 'Grammarly',
      titleEn: 'Grammarly',
      description: 'AI写作助手，提供语法检查、风格建议和语气调整功能。',
      descriptionEn: 'AI writing assistant providing grammar checking, style suggestions, and tone adjustment features.',
      category: 'other',
      icon: '✏️',
      tags: ['语法检查', '写作助手', '风格建议'],
      featured: false,
      url: 'https://www.grammarly.com',
      date: '2009-01'
    },
    {
      id: 'ai-45',
      title: 'DeepL',
      titleEn: 'DeepL',
      description: 'AI翻译工具，提供高质量的多语言翻译服务。',
      descriptionEn: 'AI translation tool providing high-quality multilingual translation services.',
      category: 'other',
      icon: '🌐',
      tags: ['翻译', '多语言', '高质量'],
      featured: false,
      url: 'https://www.deepl.com',
      date: '2017-08'
    },
    {
      id: 'ai-46',
      title: 'Otter.ai',
      titleEn: 'Otter.ai',
      description: 'AI会议转录和笔记工具，自动记录和总结会议内容。',
      descriptionEn: 'AI meeting transcription and note-taking tool that automatically records and summarizes meeting content.',
      category: 'other',
      icon: '🎙️',
      tags: ['会议转录', '笔记', '语音识别'],
      featured: false,
      url: 'https://otter.ai',
      date: '2016-01'
    },
    {
      id: 'ai-47',
      title: 'Humata',
      titleEn: 'Humata',
      description: 'AI文档分析工具，能够快速理解和回答关于文档的问题。',
      descriptionEn: 'AI document analysis tool capable of quickly understanding and answering questions about documents.',
      category: 'other',
      icon: '📚',
      tags: ['文档分析', '问答', '知识管理'],
      featured: false,
      url: 'https://www.humata.ai',
      date: '2023-01'
    },
    {
      id: 'ai-48',
      title: 'Khan Academy AI Tutor',
      titleEn: 'Khan Academy AI Tutor',
      description: '可汗学院开发的AI导师，提供个性化学习指导和答疑。',
      descriptionEn: 'AI tutor developed by Khan Academy, providing personalized learning guidance and Q&A.',
      category: 'other',
      icon: '🎓',
      tags: ['教育', 'AI导师', '个性化学习'],
      featured: false,
      url: 'https://www.khanacademy.org',
      date: '2023-03'
    }
  ];

  constructor() { }

  getAllItems(): Observable<AIItem[]> {
    return of(this.aiItems);
  }

  getItemById(id: string): Observable<AIItem | undefined> {
    const item = this.aiItems.find(i => i.id === id);
    return of(item);
  }

  getItemsByCategory(category: AICategory | 'all'): Observable<AIItem[]> {
    if (category === 'all') {
      return this.getAllItems();
    }
    const filtered = this.aiItems.filter(i => i.category === category);
    return of(filtered);
  }

  getFeaturedItems(): Observable<AIItem[]> {
    const featured = this.aiItems.filter(i => i.featured);
    return of(featured);
  }
}

