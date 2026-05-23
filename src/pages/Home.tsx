import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
  Brain, Newspaper, Database, FileText, ArrowRight,
  ChevronRight, Clock, BookOpen, TrendingUp, Check, Cpu,
  Zap, Calendar, ExternalLink
} from 'lucide-react';
// import NeuronCanvas from '../components/NeuronCanvas';

interface IntelFeed {
  id: string;
  title: string;
  summary: string;
  title_zh?: string;
  summary_zh?: string;
  published_at: string;
  category: string;
  source_name: string;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function isWithin24h(dateStr: string): boolean {
  const now = new Date().getTime();
  const d = new Date(dateStr).getTime();
  return (now - d) < 24 * 60 * 60 * 1000;
}

const previewArticles = [
  {
    id: 1,
    title: '脑机接口：连接心智与机器',
    excerpt: '从Neuralink到Synchron，探索脑机接口技术的最新突破与伦理边界。脑机接口正从实验室走向临床应用...',
    category: '脑机接口',
    date: '2025-05-15',
    readTime: '15分钟',
    featured: true,
  },
  {
    id: 2,
    title: '认知科学：意识的神经基础',
    excerpt: '追问意识的本质：神经活动如何产生主观体验？整合信息理论与全局工作空间理论的争论持续升温...',
    category: '认知科学',
    date: '2025-05-10',
    readTime: '20分钟',
    featured: false,
  },
  {
    id: 3,
    title: 'AI伦理：当机器拥有意识',
    excerpt: '探讨人工智能的道德地位与认知权利问题。随着大语言模型展现出越来越强的理解能力...',
    category: 'AI伦理',
    date: '2025-05-05',
    readTime: '18分钟',
    featured: false,
  },
];

const previewReports = [
  {
    title: '2025年脑机接口蓝皮书',
    description: '未来将至，打造人机交互新范式。涵盖市场分析、技术趋势、政策解读等多维度内容。',
    source: '前瞻研究院',
    tag: '行业蓝皮书',
  },
  {
    title: '中国脑机接口行业现状与展望',
    description: '从简单解码到互动学习，全面梳理中国脑机接口产业发展现状与未来趋势。',
    source: '医疗器械专题',
    tag: '行业研究',
  },
  {
    title: '脑机接口深度报告：科幻照进现实',
    description: '产业落地加速，涵盖市场分析、技术路线、竞争格局等核心内容。',
    source: '中邮证券',
    tag: '券商研报',
  },
];

const dbHighlights = [
  { label: '覆盖企业', value: '105+' },
  { label: '技术路线', value: '12+' },
  { label: '产业链环节', value: '8+' },
];

export default function Home() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);
  const [intelFeeds, setIntelFeeds] = useState<IntelFeed[]>([]);
  const [intelLoading, setIntelLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('https://datasets.phineuro.life/api/intel?limit=5')
      .then((res) => res.json())
      .then((data) => {
        setIntelFeeds(data.data || []);
        setIntelLoading(false);
      })
      .catch(() => {
        setIntelFeeds([]);
        setIntelLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* ===== Hero Section ===== */}
      <section className="relative w-full min-h-[700px] h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        />

        {/* Gradient Overlays - 左红右蓝渐变 */}
        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(135deg, rgba(114,47,55,0.88) 0%, rgba(80,30,40,0.80) 35%, rgba(30,35,60,0.85) 65%, rgba(15,25,50,0.92) 100%)'
        }} />
        <div className="absolute inset-0 z-[1]" style={{
          background: 'radial-gradient(ellipse at 75% center, rgba(74,85,104,0.35) 0%, transparent 60%)'
        }} />

        {/* Content - Two Column Layout */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 lg:px-6 flex items-start gap-8 lg:gap-12 pt-28">
          {/* Left: Brand Intro */}
          <div className={`flex-1 max-w-[620px] transition-all duration-700 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* Tagline */}
            <div className="mb-5">
              <div className="w-10 h-px bg-gold mb-3"></div>
              <span className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
                神经科技 × 脑机接口 × 认知科学
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15] mb-5"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
            >
              探索认知边界
            </h1>

            {/* Subtitle */}
            <p className="text-base lg:text-lg text-white/75 max-w-[520px] mb-6 leading-relaxed">
              在认知革命的前夜，追踪最前沿的脑科学，追问最深层的认知问题
              ——在这个奇点时刻，理解人之所以为人的边界。
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['跨学科深度', '8年药企经验', '新中双视角'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/news')}
                className="h-12 px-7 bg-burgundy hover:bg-burgundy-light text-white font-semibold text-sm rounded-full transition-all hover:scale-[1.02]"
              >
                浏览前沿资讯
              </button>
              <a
                href="https://datasets.phineuro.life"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-7 bg-transparent border border-white/40 hover:border-white text-white font-medium text-sm rounded-full transition-all hover:bg-white/10 inline-flex items-center gap-2"
              >
                BCI训练数据集 <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Right: 7×24H Intel Feed */}
          <div className={`hidden lg:block w-[400px] flex-shrink-0 mt-8 transition-all duration-700 ease-out delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="bg-charcoal/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5" style={{ maxHeight: '420px' }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-gold" />
                  <h3 className="text-sm font-bold text-white">7×24H 情报</h3>
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/40 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-gold/20 items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    </span>
                  </span>
                </div>
                <button onClick={() => navigate('/news')} className="text-xs text-gold hover:text-white transition-colors">查看更多 →</button>
              </div>
              <p className="text-[11px] text-white/50 mb-4">过去72小时累计聚合 <span className="text-gold font-semibold">128</span> 条产业情报</p>

              {/* Date Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <Calendar size={12} className="text-white/40" />
                <span className="text-xs text-white/60">
                  {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-0 overflow-y-auto" style={{ maxHeight: '260px' }}>
                {intelLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : intelFeeds.length === 0 ? (
                  <p className="text-xs text-white/40 text-center py-8">暂无情报数据</p>
                ) : (
                  intelFeeds.map((feed, index) => (
                    <a
                      key={feed.id}
                      href={`https://datasets.phineuro.life/intel/${feed.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 group cursor-pointer hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors"
                    >
                      {/* Time dot line */}
                      <div className="flex flex-col items-center pt-1">
                        <div className={`w-2 h-2 rounded-full ${isWithin24h(feed.published_at) ? 'bg-gold' : 'bg-white/30'}`} />
                        {index < intelFeeds.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-white/10 mt-1" />}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-1">
                        <span className="text-[11px] text-white/40 font-mono">{formatTime(feed.published_at)}</span>
                        <p className="text-[13px] text-white/85 leading-snug mt-0.5 group-hover:text-gold transition-colors line-clamp-2">
                          {feed.title_zh || feed.title}
                        </p>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gold animate-pulse-glow"></div>
          <span className="text-[10px] text-white/40 tracking-wider">滚动探索</span>
        </div>
      </section>

      {/* ===== Main Content Area ===== */}
      <div>
        {/* Dark-to-light transition gradient */}
        <div className="h-[60px] w-full" style={{
          background: 'linear-gradient(to bottom, #1A1A2E 0%, #FDFCF8 100%)'
        }} />

        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar */}
            <aside className="hidden lg:block w-[180px] flex-shrink-0">
              <div className="sticky top-[120px]">
                <nav className="space-y-0.5">
                  {[
                    { label: '首页', active: true },
                    { label: '前沿资讯', path: '/news' },
                    { label: '企业数据库', path: 'https://datasets.phineuro.life', external: true },
                    { label: 'BCI报告', path: '/reports' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => item.path ? navigate(item.path) : undefined}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all ${
                        item.active
                          ? 'text-burgundy bg-burgundy/[0.08] border-l-[3px] border-burgundy'
                          : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/[0.06] hover:border-l-[3px] hover:border-burgundy border-l-[3px] border-transparent'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                {/* Stats Card */}
                <div className="mt-6 bg-cream-dark rounded-lg border border-border-light p-4">
                  <p className="text-xs font-medium text-burgundy mb-3">数据库概览</p>
                  {dbHighlights.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5">
                      <span className="text-[11px] text-slate-blue">{item.label}</span>
                      <span className="text-sm font-bold text-burgundy">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 max-w-[720px]">
              {/* Module Cards Section */}
              <div className="animate-in mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-burgundy rounded-full"></div>
                  <h2 className="font-serif text-2xl font-bold text-burgundy">四大核心板块</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* News Card */}
                  <button
                    onClick={() => navigate('/news')}
                    className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 border border-border-light hover:border-burgundy/20 text-left cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-burgundy/10 flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                      <Newspaper size={24} className="text-burgundy" />
                    </div>
                    <h4 className="text-sm font-semibold text-burgundy mb-2">前沿资讯</h4>
                    <p className="text-[12px] text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                      政策动态、前沿论文、新闻报道，追踪神经科技最新资讯。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-burgundy font-medium">实时更新</span>
                      <span className="text-[12px] text-burgundy flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入 <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>

                  {/* Database Card */}
                  <a
                    href="https://datasets.phineuro.life"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 border border-border-light hover:border-burgundy/20 text-left cursor-pointer relative block"
                  >
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                      NEW
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-burgundy/10 flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                      <Database size={24} className="text-burgundy" />
                    </div>
                    <h4 className="text-sm font-semibold text-burgundy mb-2">BCI 数据集</h4>
                    <p className="text-[12px] text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                      覆盖 25+ 核心 BCI 数据集，涵盖 EEG、ECoG、MEG 等多模态数据。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-burgundy font-medium">25+ 数据集</span>
                      <span className="text-[12px] text-burgundy flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入 <ArrowRight size={12} />
                      </span>
                    </div>
                  </a>

                  {/* Reports Card */}
                  <button
                    onClick={() => navigate('/reports')}
                    className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 border border-border-light hover:border-burgundy/20 text-left cursor-pointer relative"
                  >
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                      NEW
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-burgundy/10 flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                      <FileText size={24} className="text-burgundy" />
                    </div>
                    <h4 className="text-sm font-semibold text-burgundy mb-2">BCI 行业报告</h4>
                    <p className="text-[12px] text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                      脑机接口行业深度研究报告，涵盖市场分析、技术趋势、政策解读。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-burgundy font-medium">限时免费</span>
                      <span className="text-[12px] text-burgundy flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入 <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>

                  {/* Tech Routes Card */}
                  <button
                    onClick={() => navigate('/tech-routes')}
                    className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5 border border-border-light hover:border-burgundy/20 text-left cursor-pointer relative"
                  >
                    <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                      NEW
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-burgundy/10 flex items-center justify-center mb-4 group-hover:bg-burgundy/20 transition-colors">
                      <Cpu size={24} className="text-burgundy" />
                    </div>
                    <h4 className="text-sm font-semibold text-burgundy mb-2">技术路径</h4>
                    <p className="text-[12px] text-text-secondary line-clamp-2 mb-3 leading-relaxed">
                      BCI技术路径解析、训练数据集、训练设备产品展示与购买。
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-burgundy font-medium">产品在售</span>
                      <span className="text-[12px] text-burgundy flex items-center gap-1 group-hover:gap-2 transition-all">
                        进入 <ArrowRight size={12} />
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Featured Articles - 左图右文排版 */}
              <div className="animate-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-burgundy rounded-full"></div>
                    <h2 className="font-serif text-2xl font-bold text-burgundy">精选资讯</h2>
                  </div>
                  <button
                    onClick={() => navigate('/news')}
                    className="text-[13px] text-slate-blue hover:text-burgundy flex items-center gap-1 transition-colors"
                  >
                    查看更多 <ChevronRight size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  {previewArticles.map((item) => (
                    <article
                      key={item.id}
                      onClick={() => navigate('/news')}
                      className={`animate-in flex gap-4 bg-white rounded-lg border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 group cursor-pointer ${
                        item.featured ? 'border-l-[3px] border-l-burgundy border-border-light' : 'border-border-light hover:border-l-[3px] hover:border-l-burgundy'
                      }`}
                    >
                      {/* Image Placeholder */}
                      <div className={`flex-shrink-0 overflow-hidden rounded-l-lg ${item.featured ? 'w-[240px]' : 'w-[200px]'}`}>
                        <div className={`w-full min-h-[130px] h-full bg-gradient-to-br from-burgundy/20 to-gold/20 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500`}>
                          <BookOpen size={32} className="text-burgundy/40" />
                        </div>
                      </div>
                      <div className="flex-1 py-3 pr-4 min-w-0">
                        <h3 className="text-[15px] font-semibold text-text-primary line-clamp-2 leading-snug group-hover:text-burgundy transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[13px] text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-burgundy/[0.06] text-burgundy text-[11px] font-medium rounded-full">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-blue ml-auto flex items-center gap-1">
                            <Clock size={10} />
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Industry Reports - 卡片网格 */}
              <div className="animate-in mt-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gold rounded-full"></div>
                    <h2 className="font-serif text-2xl font-bold text-burgundy">行业报告</h2>
                  </div>
                  <button
                    onClick={() => navigate('/reports')}
                    className="text-[13px] text-slate-blue hover:text-burgundy flex items-center gap-1 transition-colors"
                  >
                    查看更多 <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {previewReports.map((report, index) => (
                    <div
                      key={index}
                      onClick={() => navigate('/reports')}
                      className="bg-cream rounded-xl border border-border-light overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
                    >
                      <div className="aspect-[16/9] overflow-hidden relative">
                        <div className="w-full h-full bg-gradient-to-br from-charcoal/30 to-burgundy/30 flex items-center justify-center">
                          <TrendingUp size={36} className="text-burgundy/50" />
                        </div>
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-gold text-charcoal text-[10px] font-medium rounded">
                          {report.tag}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-burgundy transition-colors">
                          {report.title}
                        </h4>
                        <p className="text-[12px] text-text-secondary line-clamp-3 mt-1.5 leading-relaxed">
                          {report.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-blue">
                          <FileText size={10} />
                          {report.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-[320px] flex-shrink-0">
              <div className="sticky top-[120px] space-y-6">
                {/* About Card */}
                <div className="animate-in bg-white rounded-lg border border-border-light p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={20} className="text-burgundy" />
                    <h4 className="text-base font-semibold text-burgundy">关于 PhiNeuro</h4>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed mb-3">
                    在认知革命的前夜，追踪最前沿的脑科学，追问最深层的认知问题。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['跨学科深度', '8年药企经验', '新中双视角'].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-burgundy/[0.06] text-burgundy text-[11px] font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="animate-in">
                  <h4 className="text-base font-semibold text-burgundy mb-3">快速导航</h4>
                  <div className="space-y-2">
                    {[
                      { label: '前沿资讯', path: '/news', desc: '政策·论文·新闻实时追踪' },
                      { label: 'BCI 数据集', path: 'https://datasets.phineuro.life', desc: '25+核心BCI数据集', external: true },
                      { label: 'BCI行业报告', path: '/reports', desc: '市场分析·技术趋势' },
                    ].map((link) => (
                      <a
                        key={link.label}
                        href={link.path}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="w-full text-left bg-white rounded-lg border border-border-light p-3 hover:shadow-card hover:border-burgundy/20 transition-all group block"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-burgundy">{link.label}</span>
                          <ArrowRight size={12} className="text-slate-blue group-hover:text-burgundy group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-[11px] text-text-secondary mt-0.5">{link.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="animate-in bg-cream-dark rounded-lg border border-border-light p-4">
                  <h4 className="text-sm font-semibold text-burgundy mb-3">关注我们</h4>
                  <div className="flex items-center gap-4">
                    {['小红书', '公众号', 'X'].map((platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="text-[12px] text-slate-blue hover:text-burgundy transition-colors"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ===== Newsletter Section ===== */}
      <section
        className="w-full py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #722F37 0%, #5A252C 100%)' }}
      >
        <div className="max-w-[800px] mx-auto px-4 lg:px-6 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-3">
            订阅 PhiNeuro 周刊
          </h2>
          <p className="text-base text-white/70 mb-8 leading-relaxed">
            每周精选神经科学与哲学交叉领域的最新动态、深度解读与前沿思考
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <input
              type="email"
              placeholder="输入您的邮箱地址"
              className="h-12 w-full sm:w-[360px] px-5 rounded-full bg-white/10 border border-white/30 text-white placeholder:text-white/50 text-sm outline-none focus:border-gold transition-all focus:shadow-[0_0_20px_rgba(114,47,55,0.3)]"
            />
            <button className="h-12 px-7 bg-burgundy hover:bg-burgundy-light text-white font-semibold text-sm rounded-full transition-all hover:scale-[1.02] whitespace-nowrap">
              立即订阅
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {['免费订阅', '随时取消', '每周更新'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/60">
                <Check size={14} className="text-gold" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="w-full bg-charcoal pt-16 lg:pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-0 mb-3">
                <Brain className="w-6 h-6 text-burgundy mr-2" />
                <span className="font-serif text-2xl font-bold text-white">PhiNeuro</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold ml-0.5 mt-2"></span>
              </div>
              <p className="text-xs text-white/50 mb-4">探索认知边界</p>
              <p className="text-xs text-white/40 leading-relaxed">
                在认知革命的前夜，追踪最前沿的脑科学，追问最深层的认知问题。
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">导航</h4>
              <ul className="space-y-2.5">
                {[
                  { label: '首页', path: '/' },
                  { label: '前沿资讯', path: '/news' },
                  { label: 'BCI 数据集', path: 'https://datasets.phineuro.life', external: true },
                  { label: 'BCI行业报告', path: '/reports' },
                ].map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-white/60 hover:text-gold transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-[13px] text-white/60 hover:text-gold transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">资源</h4>
              <ul className="space-y-2.5">
                {['神经科技数据库', 'BCI行业报告', '深度文章', '产业动态'].map((link) => (
                  <li key={link}>
                    <span className="text-[13px] text-white/60 hover:text-gold transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">联系</h4>
              <div className="flex items-center gap-4 mb-4">
                {['小红书', '公众号', 'X'].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="text-[13px] text-white/60 hover:text-gold transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
              <p className="text-[11px] text-white/40">
                数据仅供参考，不构成投资建议
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/40">
              &copy; 2024-2025 PhiNeuro. 探索认知边界.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-white/40">数据仅供参考，不构成投资建议</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
