/** 视频教程元数据；可在 episodes 中补充真实播放链接与时长 */
export type VideoPlatform = 'bilibili' | 'youtube' | 'other';

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

export interface VideoTutorial {
  id: string;
  titleZh: string;
  titleEn: string;
  summaryZh: string;
  summaryEn: string;
  episodes: VideoEpisode[];
  /** 站外课程页；列表点击直接打开新窗口 */
  externalUrl?: string;
  /** 列表/详情封面，如 /assets/tutorials/.../overview.png */
  coverImage?: string;
}

export const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: 'websphere-application-server',
    titleZh: 'WebSphere Application Server教程',
    titleEn: 'WebSphere Application Server',
    summaryZh: 'WAS 安装、配置、部署与运维要点。',
    summaryEn: 'Installation, configuration, deployment, and operations for WAS.',
    episodes: [],
    externalUrl: 'https://edu.51cto.com/course/38177.html',
    coverImage: '/assets/tutorials/01-websphere-application-server/overview.png'
  },
  {
    id: 'vault',
    titleZh: 'Vault教程',
    titleEn: 'HashiCorp Vault',
    summaryZh: '密钥与敏感数据管理、策略与认证。',
    summaryEn: 'Secrets management, policies, and authentication with Vault.',
    episodes: []
  },
  {
    id: 'streamlit',
    titleZh: 'Streamlit教程',
    titleEn: 'Streamlit',
    summaryZh: '用 Python 快速搭建数据应用与仪表盘。',
    summaryEn: 'Build data apps and dashboards quickly with Python.',
    episodes: []
  },
  {
    id: 'fastapi',
    titleZh: 'FastAPI教程',
    titleEn: 'FastAPI',
    summaryZh: '现代 Python Web API 开发与异步实践。',
    summaryEn: 'Modern Python API development and async patterns.',
    episodes: []
  },
  {
    id: 'nginx',
    titleZh: 'Nginx教程',
    titleEn: 'Nginx',
    summaryZh: '反向代理、负载均衡与静态资源部署。',
    summaryEn: 'Reverse proxy, load balancing, and static hosting.',
    episodes: []
  },
  {
    id: 'ldap',
    titleZh: 'LDAP教程',
    titleEn: 'LDAP',
    summaryZh: '目录服务、认证与常见集成场景。',
    summaryEn: 'Directory services, authentication, and integrations.',
    episodes: []
  },
  {
    id: 'websphere-liberty',
    titleZh: 'WebSphere Application Server Liberty教程',
    titleEn: 'WebSphere Liberty',
    summaryZh: '轻量 Liberty 运行时与云原生部署。',
    summaryEn: 'Lightweight Liberty runtime and cloud-native deployment.',
    episodes: []
  },
  {
    id: 'opc-ua',
    titleZh: 'OPC UA教程',
    titleEn: 'OPC UA',
    summaryZh: '工业通信与安全模型入门。',
    summaryEn: 'Industrial connectivity and security model basics.',
    episodes: []
  },
  {
    id: 'ai-machine-learning',
    titleZh: 'AI机器学习教程',
    titleEn: 'AI & Machine Learning',
    summaryZh: '机器学习基础流程与常见算法概览。',
    summaryEn: 'ML workflow overview and common algorithms.',
    episodes: []
  },
  {
    id: 'mcp',
    titleZh: 'MCP教程',
    titleEn: 'Model Context Protocol (MCP)',
    summaryZh: 'MCP 协议与智能体工具链扩展。',
    summaryEn: 'MCP protocol and agent tooling extensions.',
    episodes: []
  },
  {
    id: 'python-multithread',
    titleZh: 'Python MultiThread教程',
    titleEn: 'Python Multithreading',
    summaryZh: '线程、GIL 与并发编程注意点。',
    summaryEn: 'Threads, the GIL, and concurrency in Python.',
    episodes: []
  },
  {
    id: 'modbus',
    titleZh: 'Modbus教程',
    titleEn: 'Modbus',
    summaryZh: '工业现场总线与寄存器读写。',
    summaryEn: 'Industrial fieldbus and register read/write.',
    episodes: []
  },
  {
    id: 'opc-da',
    titleZh: 'OPC DA教程',
    titleEn: 'OPC DA',
    summaryZh: '经典 OPC 数据访问与迁移思路。',
    summaryEn: 'Classic OPC Data Access and migration notes.',
    episodes: []
  },
  {
    id: 'sklearn',
    titleZh: 'Sklearn教程',
    titleEn: 'scikit-learn',
    summaryZh: 'Scikit-learn 流水线、评估与调参。',
    summaryEn: 'Pipelines, evaluation, and tuning with scikit-learn.',
    episodes: []
  },
  {
    id: 'web-rtc',
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
