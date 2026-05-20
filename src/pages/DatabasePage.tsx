import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, Filter, X, ExternalLink, Mail, Phone, Building2, FlaskConical,
  MapPin, Award, TrendingUp, Database as DatabaseIcon, ChevronDown, ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { companiesData, getTechRouteMain, getFundingDisplay } from '../data/companiesData';

export default function DatabasePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechRoute, setSelectedTechRoute] = useState<string>('全部');
  const [selectedChain, setSelectedChain] = useState<string>('全部');
  const [selectedType, setSelectedType] = useState<string>('全部');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Compute filter options
  const techRoutes = useMemo(() => {
    const routes = new Set<string>();
    companiesData.forEach(c => routes.add(getTechRouteMain(c.techRoute)));
    return ['全部', ...Array.from(routes).sort()];
  }, []);

  const chainPositions = useMemo(() => {
    const positions = new Set<string>();
    companiesData.forEach(c => {
      const main = c.chainPosition.split('-')[0];
      if (main) positions.add(main);
    });
    return ['全部', ...Array.from(positions).sort()];
  }, []);

  const companyTypes = useMemo(() => {
    const types = new Set<string>();
    companiesData.forEach(c => {
      const t = c.type.replace(/（.*）/, '');
      types.add(t);
    });
    return ['全部', ...Array.from(types).sort()];
  }, []);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companiesData.filter(c => {
      const matchesSearch = !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTech = selectedTechRoute === '全部' || getTechRouteMain(c.techRoute) === selectedTechRoute;
      const matchesChain = selectedChain === '全部' || c.chainPosition.startsWith(selectedChain);
      const matchesType = selectedType === '全部' || c.type.replace(/（.*）/, '') === selectedType;

      return matchesSearch && matchesTech && matchesChain && matchesType;
    });
  }, [searchQuery, selectedTechRoute, selectedChain, selectedType]);

  // Stats
  const stats = useMemo(() => {
    const total = companiesData.length;
    const startups = companiesData.filter(c => c.type.includes('初创')).length;
    const listed = companiesData.filter(c => c.type.includes('上市')).length;
    const funding = companiesData.reduce((sum, c) => sum + (c.totalFunding || 0), 0);
    return { total, startups, listed, funding };
  }, []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTechRoute('全部');
    setSelectedChain('全部');
    setSelectedType('全部');
  };

  const hasActiveFilters = searchQuery || selectedTechRoute !== '全部' || selectedChain !== '全部' || selectedType !== '全部';

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
              <DatabaseIcon className="w-4 h-4" />
              <span>PhiNeuro 独家数据库</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-4">
              中国神经科技企业数据库
            </h1>
            <p className="text-slate-blue text-lg max-w-2xl mx-auto">
              覆盖 <span className="font-semibold text-burgundy">{stats.total}+家</span> 中国境内神经科技企业，涵盖脑机接口、神经调控、上游供应链及下游应用全链条
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="text-center p-6 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-burgundy/10 mb-4">
              <Building2 className="w-6 h-6 text-burgundy" />
            </div>
            <div className="font-mono text-3xl font-bold text-burgundy mb-1">{stats.total}+</div>
            <p className="text-slate-blue/70 text-sm">覆盖企业</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-burgundy/10 mb-4">
              <FlaskConical className="w-6 h-6 text-burgundy" />
            </div>
            <div className="font-mono text-3xl font-bold text-burgundy mb-1">{stats.startups}</div>
            <p className="text-slate-blue/70 text-sm">初创企业</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-burgundy/10 mb-4">
              <Award className="w-6 h-6 text-burgundy" />
            </div>
            <div className="font-mono text-3xl font-bold text-burgundy mb-1">{stats.listed}</div>
            <p className="text-slate-blue/70 text-sm">上市公司</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-burgundy/10 bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-burgundy/10 mb-4">
              <TrendingUp className="w-6 h-6 text-burgundy" />
            </div>
            <div className="font-mono text-3xl font-bold text-burgundy mb-1">{stats.funding.toFixed(1)}+</div>
            <p className="text-slate-blue/70 text-sm">累计融资(亿)</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-blue/50" />
              <input
                type="text"
                placeholder="搜索企业名称、创始人、技术路线、细分赛道..."
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
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-burgundy" />
              )}
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
                <label className="text-sm font-medium text-slate-blue mb-2 block">技术路线</label>
                <div className="flex flex-wrap gap-2">
                  {techRoutes.map(route => (
                    <button
                      key={route}
                      onClick={() => setSelectedTechRoute(route)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedTechRoute === route
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-slate-blue hover:bg-burgundy/10'
                      }`}
                    >
                      {route}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-blue mb-2 block">产业链位置</label>
                <div className="flex flex-wrap gap-2">
                  {chainPositions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSelectedChain(pos)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedChain === pos
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-slate-blue hover:bg-burgundy/10'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-blue mb-2 block">企业类型</label>
                <div className="flex flex-wrap gap-2">
                  {companyTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedType === type
                          ? 'bg-burgundy text-white'
                          : 'bg-gray-100 text-slate-blue hover:bg-burgundy/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-slate-blue/60">
            共找到 <span className="font-semibold text-burgundy">{filteredCompanies.length}</span> 家企业
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-burgundy/5 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider w-16">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[120px]">企业名称</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[100px]">技术路线</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[100px]">细分赛道</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[100px]">产业链</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[80px]">成立</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[80px]">总部</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[80px]">融资</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-blue uppercase tracking-wider min-w-[60px]">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td colSpan={9} className="p-0">
                      <div
                        className="hover:bg-burgundy/5 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === company.id ? null : company.id)}
                      >
                        <div className="grid grid-cols-[48px_120px_100px_100px_100px_80px_80px_80px_48px] lg:grid-cols-[48px_1fr_120px_120px_100px_80px_80px_80px_48px] items-center px-4 py-3">
                          <span className="text-sm text-slate-blue/60">{company.id}</span>
                          <div className="min-w-0">
                            <div className="font-medium text-foreground truncate">{company.name}</div>
                            <div className="text-xs text-slate-blue/50 truncate">{company.nameEn}</div>
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs rounded-md bg-burgundy/10 text-burgundy font-medium w-fit truncate">
                            {company.techRoute.split('（')[0].split('+')[0]}
                          </span>
                          <span className="text-sm text-slate-blue truncate">{company.segment.split('/')[0]}</span>
                          <span className="text-sm text-slate-blue truncate">{company.chainPosition.split('-')[0]}</span>
                          <span className="text-sm text-slate-blue/70">{company.founded}</span>
                          <span className="text-sm text-slate-blue/70 truncate">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              {company.location.split('/')[0] || '-'}
                            </span>
                          </span>
                          <span>
                            {company.totalFunding ? (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-burgundy">
                                <TrendingUp className="w-3 h-3" />
                                {getFundingDisplay(company.totalFunding)}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-blue/40">-</span>
                            )}
                          </span>
                          <span>
                            {expandedId === company.id ? (
                              <ChevronUp className="w-4 h-4 text-burgundy" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-blue/40" />
                            )}
                          </span>
                        </div>
                      </div>
                      {expandedId === company.id && (
                        <div className="px-4 py-5 bg-burgundy/5 border-t border-gray-100">
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Basic Info */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-burgundy flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> 企业信息
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="text-slate-blue/60">创始人：</span><span className="text-foreground">{company.founder || '-'}</span></div>
                                <div><span className="text-slate-blue/60">创始人背景：</span><span className="text-foreground">{company.founderBg || '-'}</span></div>
                                <div><span className="text-slate-blue/60">企业类型：</span><span className="text-foreground">{company.type}</span></div>
                                <div><span className="text-slate-blue/60">IPO状态：</span><span className="text-foreground">{company.ipoStatus}</span></div>
                                <div><span className="text-slate-blue/60">员工规模：</span><span className="text-foreground">{company.employees || '-'}</span></div>
                                <div><span className="text-slate-blue/60">技术来源：</span><span className="text-foreground">{company.techSource}</span></div>
                                <div><span className="text-slate-blue/60">学术关联：</span><span className="text-foreground">{company.academicLink || '-'}</span></div>
                                <div><span className="text-slate-blue/60">专利数量：</span><span className="text-foreground">{company.patents ? `${company.patents}项` : '-'}</span></div>
                              </div>
                            </div>
                            {/* Products & Funding */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-burgundy flex items-center gap-2">
                                <FlaskConical className="w-4 h-4" /> 产品与融资
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div><span className="text-slate-blue/60">核心产品：</span><span className="text-foreground">{company.products}</span></div>
                                <div><span className="text-slate-blue/60">产品阶段：</span><span className="text-foreground">{company.productStage}</span></div>
                                <div><span className="text-slate-blue/60">注册证：</span><span className="text-foreground">{company.regCert || '-'}</span></div>
                                <div><span className="text-slate-blue/60">最新融资：</span><span className="text-foreground">{company.latestRound} {company.latestAmount ? `(${company.latestAmount}亿)` : ''}</span></div>
                                <div><span className="text-slate-blue/60">累计融资：</span><span className="text-foreground">{getFundingDisplay(company.totalFunding)}</span></div>
                                <div><span className="text-slate-blue/60">主要投资方：</span><span className="text-foreground">{company.investors || '-'}</span></div>
                                <div><span className="text-slate-blue/60">合作医院：</span><span className="text-foreground">{company.hospitals || '-'}</span></div>
                                <div><span className="text-slate-blue/60">对标海外：</span><span className="text-foreground">{company.overseasPeer || '-'}</span></div>
                              </div>
                            </div>
                            {/* Description & Contact */}
                            <div className="md:col-span-2 space-y-3">
                              <h4 className="font-semibold text-burgundy flex items-center gap-2">
                                <Award className="w-4 h-4" /> 核心优势与联系方式
                              </h4>
                              <p className="text-sm text-foreground">{company.advantage}</p>
                              <div className="flex flex-wrap gap-3 pt-2">
                                {company.website && (
                                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy/10 text-burgundy text-sm hover:bg-burgundy hover:text-white transition-colors">
                                    <ExternalLink className="w-3 h-3" /> 官网
                                  </a>
                                )}
                                {company.email && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-slate-blue text-sm">
                                    <Mail className="w-3 h-3" /> {company.email}
                                  </span>
                                )}
                                {company.phone && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-slate-blue text-sm">
                                    <Phone className="w-3 h-3" /> {company.phone}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-blue/40 pt-2">数据来源：{company.dataSource}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCompanies.length === 0 && (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-slate-blue/20 mx-auto mb-4" />
              <p className="text-slate-blue/50">未找到匹配的企业，请尝试其他搜索条件</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-slate-blue/50">
          <p>数据截止 2026年5月 | 共收录 {companiesData.length} 家中国境内神经科技企业 | 数据来源于公开信息，仅供参考</p>
        </div>
      </div>
    </div>
  );
}
