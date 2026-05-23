import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Radio, ArrowLeft, Landmark, FileText, Newspaper,
  Calendar, ExternalLink, Tag, Clock, Zap, Activity
} from 'lucide-react';

type NewsCategory = 'policy' | 'papers' | 'news' | 'intel';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  tags: string[];
  url?: string;
  isHot?: boolean;
}

interface IntelFeed {
  id: string;
  title: string;
  summary: string;
  title_zh?: string;
  summary_zh?: string;
  url: string;
  source_name: string;
  published_at: string;
  category: string;
}

const policyData: NewsItem[] = [
  {
    id: 1,
    title: '北京市发布脑机接口创新发展行动计划（2025-2030）',
    summary: '北京市科委中关村管委会发布《北京市脑机接口创新发展行动计划》，提出到2030年培育3-5家具有全球影响力的脑机接口企业，打造具有国际竞争力的产业集群。',
    source: '北京市科委',
    date: '2025-05-15',
    tags: ['地方政策', '产业规划'],
    isHot: true,
  },
  {
    id: 2,
    title: '国家药监局发布《脑机接口医疗器械注册审查指导原则》征求意见稿',
    summary: '为指导脑机接口医疗器械的注册申报和技术审评，国家药监局医疗器械技术审评中心组织起草了相关指导原则，明确侵入式与非侵入式脑机接口的审评要求。',
    source: '国家药监局',
    date: '2025-04-28',
    tags: ['监管政策', '医疗器械'],
  },
  {
    id: 3,
    title: '科技部"脑科学与类脑研究"重大项目2025年度申报指南发布',
    summary: '国家重点研发计划"脑科学与类脑研究"重点专项2025年度项目申报指南发布，涵盖脑认知原理解析、脑疾病诊治、类脑计算与脑机智能等方向。',
    source: '科技部',
    date: '2025-04-10',
    tags: ['科研项目', '国家级'],
  },
  {
    id: 4,
    title: '上海市浦东新区推出脑机接口产业专项扶持政策',
    summary: '浦东新区发布专项政策，对脑机接口领域的高层次人才给予最高500万元资助，对重大产业化项目给予最高1亿元支持。',
    source: '浦东发布',
    date: '2025-03-22',
    tags: ['地方政策', '人才补贴'],
  },
  {
    id: 5,
    title: '工信部：将脑机接口纳入未来产业重点发展方向',
    summary: '工业和信息化部在新闻发布会上表示，脑机接口作为未来产业的重要方向，将加大政策支持力度，推动产学研用协同创新。',
    source: '工信部',
    date: '2025-03-08',
    tags: ['产业政策', '国家级'],
  },
];

const papersData: NewsItem[] = [
  {
    id: 1,
    title: 'Nature: 基于柔性神经电极的高通量脑信号记录系统',
    summary: '斯坦福大学研究团队开发了一种新型柔性神经电极阵列，可实现超过10000个神经元的同步记录，为高精度脑机接口奠定了硬件基础。',
    source: 'Nature Neuroscience',
    date: '2025-05-12',
    tags: ['侵入式BCI', '神经电极'],
    isHot: true,
  },
  {
    id: 2,
    title: 'Science: 非侵入式脑机接口实现意念打字速度新突破',
    summary: '加州大学旧金山分校团队利用高密度EEG结合深度学习，实现了每分钟90个字符的意念打字速度，准确率达99%，接近正常键盘输入水平。',
    source: 'Science',
    date: '2025-04-30',
    tags: ['非侵入式BCI', '解码算法'],
  },
  {
    id: 3,
    title: 'Neuron: 半侵入式ECoG脑机接口长期稳定性研究',
    summary: '研究表明，置于硬膜下的ECoG电极可在人体内稳定记录神经信号超过5年，信号质量无明显衰减，验证了半侵入式路径的长期可行性。',
    source: 'Neuron',
    date: '2025-04-18',
    tags: ['半侵入式BCI', '长期稳定性'],
  },
  {
    id: 4,
    title: 'IEEE TBME: 基于超声神经调控的闭环脑机接口系统',
    summary: '加州理工学院团队开发了基于聚焦超声的闭环神经调控系统，可实现无创、高精度的深部脑区调控，为抑郁症、帕金森治疗提供新方案。',
    source: 'IEEE TBME',
    date: '2025-03-25',
    tags: ['超声调控', '闭环系统'],
  },
  {
    id: 5,
    title: 'Nature Biomedical Engineering:  AI辅助解码算法提升BCI泛化能力',
    summary: '研究团队提出了一种基于元学习的神经解码算法，可在不同用户和不同记录 session 间快速适应，大幅减少BCI系统的校准时间。',
    source: 'Nature BME',
    date: '2025-03-10',
    tags: ['AI解码', '迁移学习'],
  },
  {
    id: 6,
    title: '基于脑机接口的康复训练系统',
    summary: '上海大学团队基于MATLAB和VC++混合编程开发了BCI康复训练系统，用于中风患者康复。通过解码EEG信号实时识别运动意图，触发康复外设从视觉、听觉和触觉给予反馈，实现患者主动康复。',
    source: 'Journal of System Simulation',
    date: '2019-02-15',
    tags: ['非侵入式BCI', '康复训练'],
    url: 'https://dc-china-simulation.researchcommons.org/cgi/viewcontent.cgi?article=2214&context=journal',
    isHot: true,
  },
];

const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Neuralink 获 FDA 批准开展第二例人体临床试验',
    summary: '马斯克旗下脑机接口公司Neuralink宣布，FDA已批准其开展第二例N1植入物的人体临床试验，计划2025年内完成10例植入。',
    source: 'Reuters',
    date: '2025-05-18',
    tags: ['Neuralink', '临床试验'],
    isHot: true,
  },
  {
    id: 2,
    title: '中国首款半侵入式脑机接口产品进入创新医疗器械特别审查程序',
    summary: '博睿康科技自主研发的半侵入式脑机接口系统通过国家药监局创新医疗器械特别审查程序，有望成为国内首个获批的脑机接口医疗器械。',
    source: '动脉网',
    date: '2025-05-10',
    tags: ['博睿康', '产品获批'],
  },
  {
    id: 3,
    title: 'Synchron 完成 7500 万美元融资，推动血管内脑机接口商业化',
    summary: 'Synchron宣布完成C轮融资，投资方包括比尔·盖茨、杰夫·贝索斯等。公司计划利用资金推进Stentrode产品的FDA注册和商业化。',
    source: 'TechCrunch',
    date: '2025-04-22',
    tags: ['Synchron', '融资动态'],
  },
  {
    id: 4,
    title: '强脑科技（BrainCo）发布首款消费级智能仿生手',
    summary: '强脑科技发布基于肌电信号的智能仿生手产品，可实现多自由度精细抓握，定价人民币29999元，面向截肢患者和特种作业人群。',
    source: '36氪',
    date: '2025-04-15',
    tags: ['强脑科技', '产品发布'],
  },
  {
    id: 5,
    title: '国内首个脑机接口产业园在武汉东湖高新区揭牌',
    summary: '武汉东湖高新区脑机接口产业园正式揭牌，首批入驻企业12家，涵盖电极材料、芯片设计、系统集成、临床应用等产业链环节。',
    source: '湖北日报',
    date: '2025-04-01',
    tags: ['产业园区', '武汉'],
  },
  {
    id: 6,
    title: '中国科学院脑科学与智能技术卓越创新中心发布年度重大进展',
    summary: '中心发布了2024年度十大重大进展，包括猕猴大脑皮层单细胞空间转录组图谱、新型柔性神经探针等脑机接口相关成果。',
    source: '科学网',
    date: '2025-03-20',
    tags: ['中科院', '科研成果'],
  },
];

const tabs = [
  { key: 'policy' as NewsCategory, label: '政策', icon: Landmark, data: policyData },
  { key: 'papers' as NewsCategory, label: '前沿论文', icon: FileText, data: papersData },
  { key: 'news' as NewsCategory, label: '新闻报道', icon: Newspaper, data: newsData },
  { key: 'intel' as NewsCategory, label: '7×24H 情报', icon: Zap, data: [] as NewsItem[] },
];

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export default function NewsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NewsCategory>('policy');
  const [intelFeeds, setIntelFeeds] = useState<IntelFeed[]>([]);
  const [intelLoading, setIntelLoading] = useState(false);

  const currentTab = tabs.find(t => t.key === activeTab)!;

  useEffect(() => {
    if (activeTab === 'intel') {
      setIntelLoading(true);
      fetch('https://datasets.phineuro.life/api/intel?limit=20')
        .then((res) => res.json())
        .then((data) => {
          setIntelFeeds(data.data || []);
          setIntelLoading(false);
        })
        .catch(() => {
          setIntelFeeds([]);
          setIntelLoading(false);
        });
    }
  }, [activeTab]);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      '融资': '融资', '临床': '临床', '政策': '政策',
      '技术突破': '技术突破', '产品发布': '产品发布',
      '产业动态': '产业动态', '学术': '学术',
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      '融资': 'bg-green-50 text-green-700',
      '临床': 'bg-blue-50 text-blue-700',
      '政策': 'bg-amber-50 text-amber-700',
      '技术突破': 'bg-purple-50 text-purple-700',
      '产品发布': 'bg-pink-50 text-pink-700',
      '产业动态': 'bg-slate-50 text-slate-700',
      '学术': 'bg-burgundy/[0.08] text-burgundy',
    };
    return colors[cat] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/10 text-burgundy text-sm font-medium mb-4">
              <Radio className="w-4 h-4" />
              <span>PhiNeuro 前沿资讯中心</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-4">
              前沿资讯
            </h1>
            <p className="text-slate-blue/70 max-w-2xl mx-auto">
              追踪神经科技领域最新政策动态、学术论文、行业新闻与实时情报
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: '政策动态', value: policyData.length, icon: Landmark },
            { label: '前沿论文', value: papersData.length, icon: FileText },
            { label: '行业新闻', value: newsData.length, icon: Newspaper },
            { label: '实时情报', value: '24H', icon: Activity },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/10 mb-3">
                <stat.icon className="w-5 h-5 text-burgundy" />
              </div>
              <div className="font-mono text-2xl font-bold text-burgundy mb-1">{stat.value}</div>
              <p className="text-slate-blue/70 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-burgundy text-white shadow-card'
                    : 'bg-white text-slate-blue border border-gray-200 hover:border-burgundy/30 hover:text-burgundy'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'intel' ? (
          <div>
            {intelLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-slate-blue/60">加载情报数据中...</span>
              </div>
            ) : intelFeeds.length === 0 ? (
              <div className="text-center py-16 text-slate-blue/50">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>暂无情报数据</p>
              </div>
            ) : (
              <div className="space-y-4">
                {intelFeeds.map((feed) => (
                  <a
                    key={feed.id}
                    href={feed.url || `https://datasets.phineuro.life/intel/${feed.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-xl border border-border-light p-5 hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${getCategoryColor(feed.category)}`}>
                            {getCategoryLabel(feed.category)}
                          </span>
                          <span className="text-[11px] text-slate-blue/60">
                            来源：{feed.source_name || '未知'}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-burgundy transition-colors">
                          {feed.title_zh || feed.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-4">
                          {feed.summary_zh || feed.summary}
                        </p>
                        {feed.title_zh && (
                          <p className="text-xs text-slate-blue/40 italic mb-2">
                            原文：{feed.title}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-blue">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(feed.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(feed.published_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-burgundy/10 text-burgundy text-sm group-hover:bg-burgundy group-hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">查看</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentTab.data.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const targetUrl = item.url || `https://www.baidu.com/s?wd=${encodeURIComponent(item.title)}`;
                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                }}
                className="bg-white rounded-xl border border-border-light p-5 hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {item.isHot && (
                        <span className="px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                          HOT
                        </span>
                      )}
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-burgundy/[0.06] text-burgundy rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-burgundy transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-blue">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        来源：{item.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-burgundy/10 text-burgundy text-sm group-hover:bg-burgundy group-hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">查看来源</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-blue/50">
          <p>资讯来源于公开渠道抓取，仅供参考 | 数据每日自动更新</p>
        </div>
      </div>
    </div>
  );
}
