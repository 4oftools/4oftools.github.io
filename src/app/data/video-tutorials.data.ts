/** 视频教程元数据；可在 episodes 中补充真实播放链接与时长 */
export type VideoPlatform = 'bilibili' | 'youtube' | 'other';

/** 教程生命周期：策划中 / 已上线 */
export type TutorialStatus = 'planning' | 'live';

/** 交付形态：仅视频 / 仅文本 / 视频与文本兼有 */
export type TutorialContentKind = 'video' | 'text' | 'mixed';

export interface VideoEpisode {
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  /** 完整播放页 URL，空字符串表示占位、站外稍后补充 */
  url: string;
  platform: VideoPlatform;
  duration?: string;
  viewsZh?: string;
  viewsEn?: string;
}

/** 该平台入口以视频还是音频为主（影响列表图标；默认 video） */
export type PlatformLinkMediaKind = 'video' | 'audio';

/** 列表卡片底部展示的平台入口；可配置 1 个或多个 */
export interface TutorialPlatformLink {
  url: string;
  platform: VideoPlatform;
  /** platform 为 other 时的展示名（至少提供当前语言一侧） */
  labelZh?: string;
  labelEn?: string;
  /** 链接前图标：视频或音频；省略则视为 video */
  mediaKind?: PlatformLinkMediaKind;
}

export interface VideoTutorial {
  id: string;
  status: TutorialStatus;
  /** 视频、文本或二者兼有 */
  contentKind: TutorialContentKind;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  episodes: VideoEpisode[];
  /** 站外课程页；列表点击直接打开新窗口 */
  externalUrl?: string;
  /** 列表/详情封面，如 /assets/tutorials/.../overview.png */
  coverImage?: string;
  /** 卡片底部平台链接（单平台或多平台） */
  platformLinks?: TutorialPlatformLink[];
}

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 'websphere-application-server',
    status: 'live',
    contentKind: 'video',
    titleZh: 'WebSphere Application Server教程',
    titleEn: 'WebSphere Application Server',
    summaryZh: 'WAS 安装、配置、部署与运维要点。',
    summaryEn: 'Installation, configuration, deployment, and operations for WAS.',
    episodes: [],
    externalUrl: 'https://edu.51cto.com/course/38177.html',
    coverImage: '/assets/tutorials/01-websphere-application-server/overview.png',
    platformLinks: [
      {
        url: 'https://edu.51cto.com/course/38177.html',
        platform: 'other',
        labelZh: '51CTO 学堂',
        labelEn: '51CTO',
        mediaKind: 'video'
      }
    ]
  },
  {
    id: 'vault',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Vault教程',
    titleEn: 'HashiCorp Vault',
    summaryZh: '密钥与敏感数据管理、策略与认证。',
    summaryEn: 'Secrets management, policies, and authentication with Vault.',
    episodes: []
  },
  {
    id: 'streamlit',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Streamlit教程',
    titleEn: 'Streamlit',
    summaryZh: '用 Python 快速搭建数据应用与仪表盘。',
    summaryEn: 'Build data apps and dashboards quickly with Python.',
    episodes: []
  },
  {
    id: 'fastapi',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'FastAPI教程',
    titleEn: 'FastAPI',
    summaryZh: '现代 Python Web API 开发与异步实践。',
    summaryEn: 'Modern Python API development and async patterns.',
    episodes: []
  },
  {
    id: 'nginx',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Nginx教程',
    titleEn: 'Nginx',
    summaryZh: '反向代理、负载均衡与静态资源部署。',
    summaryEn: 'Reverse proxy, load balancing, and static hosting.',
    episodes: []
  },
  {
    id: 'ldap',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'LDAP教程',
    titleEn: 'LDAP',
    summaryZh: '目录服务、认证与常见集成场景。',
    summaryEn: 'Directory services, authentication, and integrations.',
    episodes: []
  },
  {
    id: 'websphere-liberty',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'WebSphere Application Server Liberty教程',
    titleEn: 'WebSphere Liberty',
    summaryZh: '轻量 Liberty 运行时与云原生部署。',
    summaryEn: 'Lightweight Liberty runtime and cloud-native deployment.',
    episodes: []
  },
  {
    id: 'opc-ua',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'OPC UA教程',
    titleEn: 'OPC UA',
    summaryZh: '工业通信与安全模型入门。',
    summaryEn: 'Industrial connectivity and security model basics.',
    episodes: []
  },
  {
    id: 'ai-machine-learning',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'AI机器学习教程',
    titleEn: 'AI & Machine Learning',
    summaryZh: '机器学习基础流程与常见算法概览。',
    summaryEn: 'ML workflow overview and common algorithms.',
    episodes: []
  },
  {
    id: 'mcp',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'MCP教程',
    titleEn: 'Model Context Protocol (MCP)',
    summaryZh: 'MCP 协议与智能体工具链扩展。',
    summaryEn: 'MCP protocol and agent tooling extensions.',
    episodes: []
  },
  {
    id: 'python-multithread',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Python MultiThread教程',
    titleEn: 'Python Multithreading',
    summaryZh: '线程、GIL 与并发编程注意点。',
    summaryEn: 'Threads, the GIL, and concurrency in Python.',
    episodes: []
  },
  {
    id: 'modbus',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Modbus教程',
    titleEn: 'Modbus',
    summaryZh: '工业现场总线与寄存器读写。',
    summaryEn: 'Industrial fieldbus and register read/write.',
    episodes: []
  },
  {
    id: 'opc-da',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'OPC DA教程',
    titleEn: 'OPC DA',
    summaryZh: '经典 OPC 数据访问与迁移思路。',
    summaryEn: 'Classic OPC Data Access and migration notes.',
    episodes: []
  },
  {
    id: 'sklearn',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'Sklearn教程',
    titleEn: 'scikit-learn',
    summaryZh: 'Scikit-learn 流水线、评估与调参。',
    summaryEn: 'Pipelines, evaluation, and tuning with scikit-learn.',
    episodes: []
  },
  {
    id: 'web-rtc',
    status: 'planning',
    contentKind: 'video',
    titleZh: 'WebRTC教程',
    titleEn: 'WebRTC',
    summaryZh: '实时音视频与信令基础。',
    summaryEn: 'Real-time media and signaling fundamentals.',
    episodes: []
  }
];

export function getVideoTutorialById(id: string): VideoTutorial | undefined {
  return VIDEO_TUTORIALS.find(t => t.id === id);
}
