import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText, Download, Calendar, Building, Search, ArrowLeft,
  Filter, X, ExternalLink
} from 'lucide-react';

interface BCIReport {
  id: number;
  title: string;
  date: string;
  year: number;
  source: string;
  category: string;
  downloadUrl?: string;
  sourceUrl?: string;
  isNew?: boolean;
}

const bciReports: BCIReport[] = [
  {
    id: 1,
    title: '2025年脑机接口蓝皮书：未来将至，打造人机交互新范式',
    date: '2025-02-11',
    year: 2025,
    source: '前瞻研究院',
    category: '行业蓝皮书',
    downloadUrl: 'https://www.sgpjbg.com/bgdown/608134.html?id=608134',
  },
  {
    id: 2,
    title: '中国脑机接口行业现状与展望',
    date: '2025-03-05',
    year: 2025,
    source: '医疗器械专题',
    category: '行业研究',
  },
  {
    id: 3,
    title: '脑机接口：从简单解码到互动学习',
    date: '2025-03-15',
    year: 2025,
    source: '学术期刊',
    category: '学术研究',
  },
  {
    id: 4,
    title: '脑机接口深度报告：科幻照进现实，产业落地加速',
    date: '2025-06-25',
    year: 2025,
    source: '中邮证券',
    category: '券商研报',
  },
  {
    id: 5,
    title: '产业赛道与主题投资风向标：深海科技、稳定币及脑机接口',
    date: '2025-07-06',
    year: 2025,
    source: '行业研究',
    category: '投资研究',
  },
  {
    id: 6,
    title: '脑机接口：从概念到落地，开启交互新时代',
    date: '2025-07-13',
    year: 2025,
    source: '计算机行业深度报告',
    category: '券商研报',
  },
  {
    id: 7,
    title: '2025脑机接口市场规模应用领域支持政策及受益标的分析报告',
    date: '2025-07-16',
    year: 2025,
    source: '行业研究',
    category: '投资研究',
  },
  {
    id: 8,
    title: '医药行业2025年中期投资策略：BD加速创新药重估，后续持续看好创新药及产业链、AI医疗、脑机接口等结构性机会',
    date: '2025-07-23',
    year: 2025,
    source: '医药行业研究',
    category: '行业研究',
  },
  {
    id: 9,
    title: '脑机接口专利关键技术白皮书',
    date: '2025-07-27',
    year: 2025,
    source: '知识产权研究',
    category: '知识产权',
    downloadUrl: 'https://bydrug.pharmcube.com/news/detail/0bf478389016a8183e99d502e4fcd630',
  },
  {
    id: 10,
    title: '脑机接口技术与应用研究报告（2025年）',
    date: '2025-08-14',
    year: 2025,
    source: '中国信通院',
    category: '官方报告',
    sourceUrl: 'http://mp.weixin.qq.com/s?__biz=Mzk0OTUzMjA2MQ==&mid=2247584571&idx=3&sn=385e8d81de525763d9afc89c90bcb1c3',
  },
  {
    id: 11,
    title: '计算机行业专题研究：技术进步与政策支持双重共振，脑机接口产业未来可期',
    date: '2025-08-15',
    year: 2025,
    source: '计算机行业专题',
    category: '行业研究',
  },
  {
    id: 12,
    title: '我国脑科学与脑机接口行业发展现状及建议',
    date: '2025-09-15',
    year: 2025,
    source: '政策研究',
    category: '政策研究',
  },
  {
    id: 13,
    title: '脑机接口行业研究报告：解码大脑交互密码，开启人机协同纪元',
    date: '2025-09-27',
    year: 2025,
    source: '光大证券',
    category: '券商研报',
  },
  {
    id: 14,
    title: '脑机接口行业深度系列报告——"十五五"重点赛道，脑机接口有望迎来新机遇',
    date: '2025-10-26',
    year: 2025,
    source: '行业深度报告',
    category: '投资研究',
  },
  {
    id: 15,
    title: '脑机接口行业深度专题二：三个维度看脑机接口行业发展趋势',
    date: '2025-11-08',
    year: 2025,
    source: '医疗器械专题',
    category: '行业研究',
  },
  {
    id: 16,
    title: '脑机接口行业深度报告：脑科学产业与政策趋势共振',
    date: '2025-11-15',
    year: 2025,
    source: '中邮证券',
    category: '券商研报',
  },
  {
    id: 17,
    title: '脑机接口赋能企业ESG管理创新报告',
    date: '2025-11-28',
    year: 2025,
    source: '中金蝶（韩璧丞）',
    category: 'ESG研究',
    isNew: true,
  },
  {
    id: 18,
    title: '脑机接口：机器人中的人机交换',
    date: '2024-12-19',
    year: 2024,
    source: '浙商证券',
    category: '券商研报',
  },
  {
    id: 19,
    title: '脑机接口"奇点"临近，关注康复医疗和抑郁症领域的应用',
    date: '2024-07-08',
    year: 2024,
    source: '国海证券',
    category: '券商研报',
  },
  {
    id: 20,
    title: '脑机接口：未来正在到来',
    date: '4-06-17',
    year: 2024,
    source: '行业深度报告',
    category: '行业研究',
  },
  {
    id: 21,
    title: '2024脑机接口研究进展和临床应用研究分析报告（脑科学创新发展论坛）',
    date: '2024-05-21',
    year: 2024,
    source: 'VBEF/邵杨鳕',
    category: '学术报告',
  },
  {
    id: 22,
    title: '2024脑机接口研究进展和临床应用研究分析报告',
    date: '2024-05-08',
    year: 2024,
    source: '蛋壳研究院',
    category: '行业研究',
  },
  {
    id: 23,
    title: '脑机接口产业：盛放前夜，未来已至',
    date: '2024-04-07',
    year: 2024,
    source: '天风医药',
    category: '行业研究',
  },
  {
    id: 24,
    title: '脑机接口行业报告：人脑与数字世界的融合未来',
    date: '2024-03-17',
    year: 2024,
    source: '行业报告',
    category: '行业研究',
  },
  {
    id: 25,
    title: '脑机接口深度报告',
    date: '2024-02-09',
    year: 2024,
    source: '量子位',
    category: '科技媒体',
  },
  {
    id: 26,
    title: '脑机接口深度报告：迈过技术论证期，进入产业化的黎明',
    date: '2024-02-04',
    year: 2024,
    source: '软件与服务行业',
    category: '券商研报',
  },
  {
    id: 27,
    title: '脑机接口技术发展与应用研究报告（2023年）',
    date: '2023-12-28',
    year: 2023,
    source: '中国信通院',
    category: '官方报告',
    downloadUrl: 'https://www.sgpjbg.com/bgdown/149882.html',
  },
  {
    id: 28,
    title: '2023年脑机接口报告',
    date: '2023-12-26',
    year: 2023,
    source: '清华五道口',
    category: '学术研究',
  },
  {
    id: 29,
    title: '2023中国脑机接口行业研究报告',
    date: '2023-12-02',
    year: 2023,
    source: '行业研究',
    category: '行业研究',
  },
  {
    id: 30,
    title: '脑机接口技术在医疗健康领域应用白皮书（2023年）',
    date: '2023-11-08',
    year: 2023,
    source: '中国信通院',
    category: '官方报告',
    downloadUrl: 'https://m.sgpjbg.com/bgdown/145125.html',
  },
  {
    id: 31,
    title: '脑机接口行业图谱',
    date: '2023-07-07',
    year: 2023,
    source: '清华五道口',
    category: '学术研究',
  },
  {
    id: 32,
    title: '机器人硬件拆解三：柔性传感器在智能机器人和脑机接口应用前瞻',
    date: '2023-06-24',
    year: 2023,
    source: '国盛证券',
    category: '券商研报',
  },
  {
    id: 33,
    title: '脑机接口行业深度：行业现状、市场发展分析、产业链及相关公司深度梳理',
    date: '2023-06-06',
    year: 2023,
    source: '慧博智能投研',
    category: '券商研报',
  },
  {
    id: 34,
    title: '2022年脑机接口价值趋势报告',
    date: '2023-03-05',
    year: 2022,
    source: '动脉橙',
    category: '行业研究',
  },
  {
    id: 35,
    title: '脑机接口总体愿景与关键技术研究报告（2022年）',
    date: '2022-11-29',
    year: 2022,
    source: '中国信通院',
    category: '官方报告',
  },
  {
    id: 36,
    title: '2022全球脑机接口技术与应用发展研究报告',
    date: '2022-11-04',
    year: 2022,
    source: '亿欧智库',
    category: '行业研究',
  },
  {
    id: 37,
    title: '2022年脑机接口行业研究报告',
    date: '2022-10-08',
    year: 2022,
    source: '蛋壳研究院',
    category: '行业研究',
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | '全部'>('全部');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showFilters, setShowFilters] = useState(false);

  const years = useMemo(() => {
    const yrs = new Set(bciReports.map(r => r.year));
    return ['全部', ...Array.from(yrs).sort((a, b) => b - a)];
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(bciReports.map(r => r.category));
    return ['全部', ...Array.from(cats).sort()];
  }, []);

  const filteredReports = useMemo(() => {
    return bciReports.filter(r => {
      const matchesSearch = !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === '全部' || r.year === selectedYear;
      const matchesCategory = selectedCategory === '全部' || r.category === selectedCategory;
      return matchesSearch && matchesYear && matchesCategory;
    });
  }, [searchQuery, selectedYear, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedYear('全部');
    setSelectedCategory('全部');
  };

  const hasActiveFilters = searchQuery || selectedYear !== '全部' || selectedCategory !== '全部';

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
              <FileText className="w-4 h-4" />
              <span>PhiNeuro 报告中心</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-4">
              BCI 脑机接口行业报告专题
            </h1>
            <p className="text-slate-blue text-lg max-w-2xl mx-auto">
              汇集 <span className="font-semibold text-burgundy">{bciReports.length}份</span> 脑机接口行业深度报告，涵盖券商研报、政策研究、学术报告及行业蓝皮书
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          <div className="text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/10 mb-3">
              <FileText className="w-5 h-5 text-burgundy" />
            </div>
            <div className="font-mono text-2xl font-bold text-burgundy mb-1">{bciReports.length}</div>
            <p className="text-slate-blue/70 text-xs">报告总数</p>
          </div>
          <div className="text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/10 mb-3">
              <Calendar className="w-5 h-5 text-burgundy" />
            </div>
            <div className="font-mono text-2xl font-bold text-burgundy mb-1">2022-2025</div>
            <p className="text-slate-blue/70 text-xs">时间跨度</p>
          </div>
          <div className="text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/10 mb-3">
              <Building className="w-5 h-5 text-burgundy" />
            </div>
            <div className="font-mono text-2xl font-bold text-burgundy mb-1">{categories.length - 1}</div>
            <p className="text-slate-blue/70 text-xs">报告类型</p>
          </div>
          <div className="col-span-3 sm:col-span-1 text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card hidden lg:block">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 mb-3">
              <Download className="w-5 h-5 text-gold-dark" />
            </div>
            <div className="font-mono text-2xl font-bold text-burgundy mb-1">—</div>
            <p className="text-slate-blue/70 text-xs">持续更新</p>
          </div>
          <div className="col-span-3 sm:col-span-1 text-center p-5 rounded-2xl border border-burgundy/10 bg-white shadow-card hidden lg:block">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/10 mb-3">
              <ExternalLink className="w-5 h-5 text-burgundy" />
            </div>
            <div className="font-mono text-2xl font-bold text-burgundy mb-1">全部</div>
            <p className="text-slate-blue/70 text-xs">可下载</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-blue/50" />
              <input
                type="text"
                placeholder="搜索报告标题、发布机构..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-burgundy/5 transition-colors font-medium text-slate-blue"
            >
              <Filter className="w-4 h-4" />
              筛选
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-burgundy" />}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-red-50 text-red-500 transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                清除
              </button>
            )}
          </div>

          {showFilters && (
            <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-blue mb-2 block">年份</label>
                <div className="flex flex-wrap gap-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedYear === year
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-slate-blue hover:bg-burgundy/10'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-blue mb-2 block">报告类型</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-slate-blue hover:bg-burgundy/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-slate-blue/60">
            共找到 <span className="font-semibold text-burgundy">{filteredReports.length}</span> 份报告
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
          <div className="divide-y divide-gray-100">
            {filteredReports.map((report, index) => (
              <div
                key={report.id}
                className="group px-4 sm:px-6 py-4 hover:bg-burgundy/5 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-burgundy">{filteredReports.length - index}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-burgundy transition-colors leading-relaxed pr-4">
                          {report.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-burgundy/10 text-burgundy text-xs font-medium">
                            <Building className="w-3 h-3" />
                            {report.source}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-slate-blue/70 text-xs">
                            <Calendar className="w-3 h-3" />
                            {report.date}
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-gray-50 text-slate-blue/60 rounded-md border border-gray-200">
                            {report.category}
                          </span>
                          {report.isNew && (
                            <span className="px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const url = report.downloadUrl || report.sourceUrl;
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          } else {
                            alert(`《${report.title}》暂无直接下载链接。\n\n来源：${report.source}\n建议通过发布机构官网或PhiNeuro公众号获取。`);
                          }
                        }}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-burgundy/10 text-burgundy text-sm font-medium hover:bg-burgundy hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="下载报告"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">下载</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredReports.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-slate-blue/20 mx-auto mb-4" />
              <p className="text-slate-blue/50">未找到匹配的报告，请尝试其他搜索条件</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-blue/50">
          <p>报告来源涵盖券商研究所、行业研究机构、政府智库及学术机构 | 数据仅供参考</p>
          <p className="mt-2">
            如需获取完整PDF版本，建议联系对应发布机构或关注 PhiNeuro 公众号获取下载链接
          </p>
        </div>
      </div>
    </div>
  );
}
