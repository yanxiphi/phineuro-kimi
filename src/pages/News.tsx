import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Radio, ArrowLeft, Landmark, FileText, Newspaper,
  Calendar, ExternalLink, Tag, Clock, Zap,
  Building2
} from 'lucide-react';

type ContentCategory = 'policy' | 'academic' | 'industry' | 'company' | 'all';

interface IntelFeed {
  id: number;
  title: string;
  summary: string;
  title_zh?: string;
  summary_zh?: string;
  url: string;
  source_name: string;
  published_at: string;
  category: string;
  content_category?: string;
  tags?: string;
}

const API_BASE = 'https://datasets.phineuro.life/api';

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function parseTags(tagsStr?: string): string[] {
  if (!tagsStr) return [];
  try {
    const parsed = JSON.parse(tagsStr);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fallback
  }
  return [];
}

function getCategoryLabel(cat?: string) {
  const labels: Record<string, string> = {
    policy: '政策', academic: '学术', industry: '产业', company: '公司',
    '融资': '融资', '临床': '临床', '政策': '政策',
    '技术突破': '技术突破', '产品发布': '产品发布',
    '产业动态': '产业动态', '学术': '学术',
  };
  return labels[cat || ''] || cat || '动态';
}

function getCategoryColor(cat?: string) {
  const colors: Record<string, string> = {
    policy: 'bg-amber-50 text-amber-700',
    academic: 'bg-blue-50 text-blue-700',
    industry: 'bg-slate-50 text-slate-700',
    company: 'bg-burgundy/[0.08] text-burgundy',
    '融资': 'bg-green-50 text-green-700',
    '临床': 'bg-blue-50 text-blue-700',
    '政策': 'bg-amber-50 text-amber-700',
    '技术突破': 'bg-purple-50 text-purple-700',
    '产品发布': 'bg-pink-50 text-pink-700',
    '产业动态': 'bg-slate-50 text-slate-700',
    '学术': 'bg-burgundy/[0.08] text-burgundy',
  };
  return colors[cat || ''] || 'bg-gray-50 text-gray-700';
}

export default function NewsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ContentCategory>('all');
  const [feeds, setFeeds] = useState<IntelFeed[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [countsLoading, setCountsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 加载计数
  useEffect(() => {
    setCountsLoading(true);
    const categories: ContentCategory[] = ['policy', 'academic', 'industry', 'company'];
    Promise.all(
      categories.map(cat =>
        fetch(`${API_BASE}/intel?content_category=${cat}&limit=1`)
          .then(r => r.json())
          .then(data => ({ cat, total: data.pagination?.total || 0 }))
          .catch(() => ({ cat, total: 0 }))
      )
    ).then(results => {
      const map: Record<string, number> = {};
      for (const r of results) {
        map[r.cat] = r.total;
      }
      setCounts(map);
      setCountsLoading(false);
    });
  }, []);

  // 加载情报列表
  const loadFeeds = (cat: ContentCategory, p: number) => {
    setLoading(true);
    const url = cat === 'all'
      ? `${API_BASE}/intel?limit=20&page=${p}`
      : `${API_BASE}/intel?content_category=${cat}&limit=20&page=${p}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const newFeeds = (data.data || []) as IntelFeed[];
        if (p === 1) {
          setFeeds(newFeeds);
        } else {
          setFeeds(prev => [...prev, ...newFeeds]);
        }
        setHasMore(newFeeds.length === 20);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(1);
    loadFeeds(activeCategory, 1);
  }, [activeCategory]);

  const filteredFeeds = useMemo(() => {
    return feeds;
  }, [feeds]);

  const stats = [
    { key: 'policy' as ContentCategory, label: '政策动态', icon: Landmark },
    { key: 'academic' as ContentCategory, label: '前沿论文', icon: FileText },
    { key: 'industry' as ContentCategory, label: '行业新闻', icon: Newspaper },
    { key: 'company' as ContentCategory, label: '公司动态', icon: Building2 },
  ];

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
              追踪神经科技领域最新政策动态、学术论文、行业新闻与公司动态
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const count = counts[stat.key] || 0;
            const isActive = activeCategory === stat.key;
            return (
              <button
                key={stat.key}
                onClick={() => setActiveCategory(isActive ? 'all' : stat.key)}
                className={`text-center p-5 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-burgundy bg-burgundy/5 shadow-card'
                    : 'border-burgundy/10 bg-white shadow-card hover:border-burgundy/30'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                  isActive ? 'bg-burgundy text-white' : 'bg-burgundy/10'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-burgundy'}`} />
                </div>
                <div className="font-mono text-2xl font-bold text-burgundy mb-1">
                  {countsLoading ? '-' : count}
                </div>
                <p className="text-slate-blue/70 text-xs">{stat.label}</p>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading && feeds.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-slate-blue/60">加载资讯中...</span>
          </div>
        ) : filteredFeeds.length === 0 ? (
          <div className="text-center py-16 text-slate-blue/50">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>暂无资讯数据</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeeds.map((feed) => {
              const hasTranslation = !!feed.title_zh?.trim();
              const displayTitle = feed.title_zh?.trim() || feed.title;
              const displaySummary = feed.summary_zh?.trim() || feed.summary;
              const cat = feed.content_category || feed.category || 'industry';
              const tags = parseTags(feed.tags);

              return (
                <a
                  key={feed.id}
                  href={feed.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl border border-border-light p-5 hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${getCategoryColor(cat)}`}>
                          {getCategoryLabel(cat)}
                        </span>
                        <span className="text-[11px] text-slate-blue/60">
                          来源：{feed.source_name || '未知'}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-burgundy transition-colors">
                        {displayTitle}
                        {!hasTranslation && <span className="ml-1 text-[10px] text-slate-blue/40 font-normal">[原文]</span>}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-3">
                        {displaySummary}
                      </p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {tags.map((tag, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] bg-burgundy/[0.06] text-burgundy rounded-full">
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
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
              );
            })}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadFeeds(activeCategory, nextPage);
                  }}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-slate-blue hover:border-burgundy/30 hover:text-burgundy transition-all disabled:opacity-50"
                >
                  {loading ? '加载中...' : '加载更多'}
                </button>
              </div>
            )}
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
