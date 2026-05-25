import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  Search, Filter, X, ExternalLink, Mail, Building2,
  MapPin, Award, TrendingUp, Database as DatabaseIcon, ChevronDown, ChevronUp,
  ArrowLeft, Layers, Stethoscope, Tag, Grid3X3, Microscope,
  BrainCircuit, Activity, Target, Box, Users,
  Cpu, Monitor, Lightbulb, XCircle, Lock, GitCompare
} from 'lucide-react';
import { companiesData, getTechRouteMain, getFundingDisplay } from '../data/companiesData';
import {
  TECH_ROUTES, DISEASE_CATEGORIES,
  getTechRouteColor, getClinicalStageColor, getDiseaseColor,
  getChainLevel, getChainLevelColor, TAG_DIMENSIONS,
} from '../data/databaseTags';
import type { Company } from '../data/companiesData';

// ============================================
// 视图模式
// ============================================
type ViewMode = 'disease' | 'chain' | 'list' | 'tags';

interface ActiveFilters {
  techRoute: string[];
  chainPosition: string[];
  diseaseArea: string[];
  clinicalStage: string[];
  regulatoryStatus: string[];
  productForm: string[];
  businessModel: string[];
  fundingStage: string[];
  crossInnovation: string[];
}

const ALL_DIMENSION_KEYS: (keyof ActiveFilters)[] = [
  'techRoute', 'chainPosition', 'clinicalStage',
  'regulatoryStatus', 'productForm', 'businessModel', 'fundingStage', 'crossInnovation', 'diseaseArea',
];

const INITIAL_FILTERS: ActiveFilters = {
  techRoute: [], chainPosition: [], diseaseArea: [], clinicalStage: [],
  regulatoryStatus: [], productForm: [], businessModel: [], fundingStage: [], crossInnovation: [],
};

// ============================================
// 辅助函数
// ============================================

function matchTag(company: Company, key: keyof ActiveFilters, value: string): boolean {
  switch (key) {
    case 'techRoute':
      return getTechRouteMain(company.techRoute) === value || company.techRoute?.includes(value);
    case 'chainPosition':
      return company.chainPosition?.includes(value);
    case 'diseaseArea':
      return company.diseaseAreas?.includes(value) || company.diseaseIndications?.includes(value)
        || company.segment?.includes(value) || company.products?.includes(value);
    case 'clinicalStage':
      return company.clinicalStage === value || company.productStage?.includes(value);
    case 'regulatoryStatus':
      return company.regulatoryStatus?.includes(value) || company.regCert?.includes(value);
    case 'productForm':
      return company.productForm === value || company.products?.includes(value);
    case 'businessModel':
      return company.businessModel?.includes(value) || company.type?.includes(value);
    case 'fundingStage':
      return company.fundingStage === value || company.latestRound?.includes(value)
        || (value === 'IPO/上市' && company.ipoStatus?.includes('上市'));
    case 'crossInnovation':
      return company.crossInnovation?.includes(value) || company.advantage?.includes(value)
        || company.techRoute?.includes(value) || company.products?.includes(value);
    default: return false;
  }
}

function companyMatchesFilters(company: Company, filters: ActiveFilters): boolean {
  for (const key of ALL_DIMENSION_KEYS) {
    const selected = filters[key];
    if (selected.length > 0) {
      const matched = selected.some(v => matchTag(company, key, v));
      if (!matched) return false;
    }
  }
  return true;
}

function getFilterCount(filters: ActiveFilters): number {
  return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
}

function getTagIcon(dimensionId: string) {
  switch (dimensionId) {
    case 'techRoute': return Microscope;
    case 'chainPosition': return Layers;
    case 'diseaseArea': return Stethoscope;
    case 'clinicalStage': return Activity;
    case 'regulatoryStatus': return Shield;
    case 'productForm': return Box;
    case 'businessModel': return Users;
    case 'fundingStage': return TrendingUp;
    case 'crossInnovation': return Lightbulb;
    default: return Tag;
  }
}

function Shield(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  );
}

// ============================================
// 子组件：企业卡片
// ============================================

function CompanyCard({ company, expanded, onToggle, isComparing, onToggleCompare }: {
  company: Company; expanded: boolean; onToggle: () => void; isComparing?: boolean; onToggleCompare?: () => void;
}) {
  void isComparing; void onToggleCompare;
  const navigate = useNavigate();
  const techColor = getTechRouteColor(company.techRoute);
  const tags: { label: string; color: string; dim: string }[] = [];

  if (company.techRoute) tags.push({ label: company.techRoute.split('（')[0].split('+')[0], color: techColor, dim: 'tech' });
  if (company.chainPosition) tags.push({ label: company.chainPosition.split('-')[0], color: getChainLevelColor(getChainLevel(company.chainPosition)), dim: 'chain' });
  if (company.clinicalStage) tags.push({ label: company.clinicalStage, color: getClinicalStageColor(company.clinicalStage), dim: 'clinical' });
  if (company.diseaseAreas?.[0]) tags.push({ label: company.diseaseAreas[0], color: getDiseaseColor(company.diseaseAreas[0]), dim: 'disease' });
  if (company.crossInnovation?.[0]) tags.push({ label: company.crossInnovation[0], color: '#C0392B', dim: 'cross' });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                onClick={(e) => { e.stopPropagation(); navigate(`/company/${company.id}`); }}
                className="font-semibold text-foreground truncate cursor-pointer hover:text-burgundy transition-colors"
              >{company.name}</span>
              <span className="text-xs text-slate-blue/50 truncate">{company.nameEn}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: tag.color }}>
                  {tag.label}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-slate-blue">+{tags.length - 4}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-blue/60">
              <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{company.location}</span>
              <span>成立 {company.founded}</span>
              {company.totalFunding && (
                <span className="inline-flex items-center gap-1 font-medium text-burgundy">
                  <TrendingUp className="w-3 h-3" />{getFundingDisplay(company.totalFunding)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            {expanded ? <ChevronUp className="w-5 h-5 text-burgundy" /> : <ChevronDown className="w-5 h-5 text-slate-blue/40" />}
          </div>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 bg-burgundy/[0.02]">
          {/* 九维标签展示 */}
          <div className="py-3 space-y-2">
            <h4 className="text-xs font-semibold text-burgundy uppercase tracking-wider">企业多维标签</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TagRow icon={Microscope} label="技术路径" value={company.techRoute} color={techColor} />
              <TagRow icon={Layers} label="产业链位置" value={company.chainPosition} color="#3498DB" />
              <TagRow icon={Stethoscope} label="疾病领域" value={company.diseaseAreas?.join('、') || company.segment} color="#27AE60" />
              <TagRow icon={Activity} label="临床阶段" value={company.clinicalStage || company.productStage} color={getClinicalStageColor(company.clinicalStage || '')} />
              <TagRow icon={Shield} label="监管状态" value={company.regulatoryStatus?.join('、') || company.regCert} color="#8E44AD" />
              <TagRow icon={Box} label="产品形态" value={company.productForm || company.products?.split('/')[0]} color="#16A085" />
              <TagRow icon={Users} label="商业模式" value={company.businessModel?.join('、') || company.type} color="#2980B9" />
              <TagRow icon={TrendingUp} label="融资阶段" value={company.fundingStage || company.latestRound} color="#D35400" />
              <TagRow icon={Lightbulb} label="交叉创新" value={company.crossInnovation?.join('、')} color="#C0392B" />
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
            <div className="space-y-1.5 text-sm">
              <DetailItem label="创始人" value={company.founder} />
              <DetailItem label="创始人背景" value={company.founderBg} />
              <DetailItem label="核心产品" value={company.products} />
              <DetailItem label="对标海外" value={company.overseasPeer} />
            </div>
            <div className="space-y-1.5 text-sm">
              <DetailItem label="最新融资" value={`${company.latestRound} ${company.latestAmount ? `(${company.latestAmount}亿)` : ''}`} />
              <DetailItem label="主要投资方" value={company.investors} />
              <DetailItem label="合作医院" value={company.hospitals} />
              <DetailItem label="学术关联" value={company.academicLink} />
            </div>
          </div>

          {/* 核心优势 + 链接 */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-foreground mb-2">{company.advantage}</p>
            <div className="flex flex-wrap gap-2">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TagRow({ icon: Icon, label, value, color }: { icon: any; label: string; value?: string; color: string }) {
  if (!value || value === '-' || value === 'undefined' || value === 'null') return null;
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
      <span className="text-slate-blue/60 flex-shrink-0">{label}:</span>
      <span className="text-foreground truncate" style={{ color }}>{value}</span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  if (!value || value === '-') return null;
  return (
    <div className="flex gap-2">
      <span className="text-slate-blue/50 flex-shrink-0">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

// ============================================
// 子组件：企业表格
// ============================================

function CompanyTable({ companies, expandedId, onToggle, compareIds, onToggleCompare }: {
  companies: Company[]; expandedId: number | null; onToggle: (id: number) => void;
  compareIds?: number[]; onToggleCompare?: (id: number) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-burgundy/5 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase w-10">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[140px]">企业名称</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase w-12">详情</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[90px]">技术路线</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[100px]">细分赛道</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[80px]">产业链</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[90px]">疾病领域</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[70px]">临床阶段</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[60px]">总部</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase min-w-[70px]">融资</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-blue uppercase w-16">对比</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {companies.map(company => (
              <>
                <tr key={company.id} className="hover:bg-burgundy/[0.02] cursor-pointer transition-colors"
                  onClick={() => onToggle(company.id)}>
                  <td className="px-3 py-2.5 text-slate-blue/50">{company.id}</td>
                  <td className="px-3 py-2.5">
                    <div
                      onClick={(e) => { e.stopPropagation(); navigate(`/company/${company.id}`); }}
                      className="cursor-pointer group"
                    >
                      <div className="font-medium text-burgundy group-hover:underline transition-colors">{company.name}</div>
                      <div className="text-xs text-slate-blue/40 group-hover:text-burgundy/60 transition-colors">{company.nameEn}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    {expandedId === company.id ? <ChevronUp className="w-4 h-4 text-burgundy" /> : <ChevronDown className="w-4 h-4 text-slate-blue/40" />}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium text-white" style={{ backgroundColor: getTechRouteColor(company.techRoute) }}>
                      {company.techRoute.split('（')[0].split('+')[0]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-blue truncate max-w-[120px]">{company.segment.split('/')[0]}</td>
                  <td className="px-3 py-2.5 text-slate-blue">{company.chainPosition.split('-')[0]}</td>
                  <td className="px-3 py-2.5">
                    {company.diseaseAreas?.[0] ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${getDiseaseColor(company.diseaseAreas[0])}15`, color: getDiseaseColor(company.diseaseAreas[0]) }}>
                        {company.diseaseAreas[0]}
                      </span>
                    ) : (
                      <span className="text-slate-blue/40">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {company.clinicalStage ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${getClinicalStageColor(company.clinicalStage)}15`, color: getClinicalStageColor(company.clinicalStage) }}>
                        {company.clinicalStage}
                      </span>
                    ) : (
                      <span className="text-slate-blue/40">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-slate-blue/70">{company.location?.split('/')[0] || '-'}</td>
                  <td className="px-3 py-2.5">
                    {company.totalFunding ? (
                      <span className="font-medium text-burgundy">{getFundingDisplay(company.totalFunding)}</span>
                    ) : (
                      <span className="text-slate-blue/40">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {onToggleCompare && (
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={compareIds?.includes(company.id) || false}
                          onChange={(e) => { e.stopPropagation(); onToggleCompare(company.id); }}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-burgundy focus:ring-burgundy"
                        />
                      </label>
                    )}
                  </td>
                </tr>
                {expandedId === company.id && (
                  <tr>
                    <td colSpan={10} className="px-4 py-4 bg-burgundy/[0.02] border-t border-gray-50">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1.5">
                          <DetailItem label="创始人" value={company.founder} />
                          <DetailItem label="核心产品" value={company.products} />
                          <DetailItem label="产品阶段" value={company.productStage} />
                          <DetailItem label="最新融资" value={`${company.latestRound} ${company.latestAmount ? `(${company.latestAmount}亿)` : ''}`} />
                        </div>
                        <div className="space-y-1.5">
                          <DetailItem label="疾病领域" value={company.diseaseAreas?.join('、')} />
                          <DetailItem label="适应症" value={company.diseaseIndications?.join('、')} />
                          <DetailItem label="交叉创新" value={company.crossInnovation?.join('、')} />
                          <DetailItem label="优势" value={company.advantage} />
                        </div>
                        <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
                          {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy/10 text-burgundy text-sm hover:bg-burgundy hover:text-white transition-colors">
                              <ExternalLink className="w-3 h-3" /> 官网
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {companies.length === 0 && (
        <div className="py-16 text-center">
          <Search className="w-12 h-12 text-slate-blue/20 mx-auto mb-4" />
          <p className="text-slate-blue/50">未找到匹配的企业，请尝试其他筛选条件</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// 子组件：标签筛选面板
// ============================================

function TagFilterPanel({ filters, onChange, onClear, disabled, guestMode, onShowLogin }: {
  filters: ActiveFilters; onChange: (f: ActiveFilters) => void; onClear: () => void; disabled?: boolean; guestMode?: boolean; onShowLogin?: () => void;
}) {
  const [expandedDims, setExpandedDims] = useState<Set<string>>(guestMode ? new Set() : new Set(['techRoute']));

  const toggleDim = (id: string) => {
    setExpandedDims(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTag = (dim: keyof ActiveFilters, value: string) => {
    if (disabled || guestMode) return;
    onChange({
      ...filters,
      [dim]: filters[dim].includes(value)
        ? filters[dim].filter(v => v !== value)
        : [...filters[dim], value],
    });
  };

  const filterCount = getFilterCount(filters);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* 提示横幅 */}
      {guestMode && (
        <div className="px-3 py-2.5 rounded-lg bg-burgundy/5 border border-burgundy/20 text-xs text-burgundy/80">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-medium">登录解锁完整筛选</span>
          </div>
          <p className="text-slate-blue/60 mb-2">注册即可免费试用30天，体验九维标签精准筛选</p>
          {onShowLogin && (
            <button onClick={onShowLogin} className="px-3 py-1 rounded bg-burgundy text-white text-xs font-medium hover:bg-burgundy-dark transition-colors">
              登录 / 注册
            </button>
          )}
        </div>
      )}
      {disabled && !guestMode && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
          试用期已过期，维度筛选功能已受限。
        </div>
      )}
      <div className={`flex items-center justify-between ${disabled || guestMode ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-burgundy" />
          <span className="font-semibold text-sm text-foreground">九维标签筛选</span>
          {filterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-burgundy text-white text-xs font-medium">{filterCount}</span>
          )}
        </div>
        {filterCount > 0 && !disabled && !guestMode && (
          <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
            <X className="w-3 h-3" /> 清除全部
          </button>
        )}
      </div>

      {/* 已选标签快捷展示 */}
      {filterCount > 0 && !guestMode && (
        <div className="flex flex-wrap gap-1.5">
          {ALL_DIMENSION_KEYS.flatMap(key =>
            filters[key].map(value => (
              <button key={`${key}-${value}`} onClick={() => !disabled && toggleTag(key, value)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-burgundy/10 text-burgundy transition-colors ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-red-50'}`}>
                {value} <X className="w-3 h-3" />
              </button>
            ))
          )}
        </div>
      )}

      {/* 各维度折叠面板 */}
      <div className="space-y-1">
        {TAG_DIMENSIONS.map(dim => {
          const Icon = getTagIcon(dim.id);
          const isOpen = expandedDims.has(dim.id);
          const selectedCount = filters[dim.id as keyof ActiveFilters].length;
          return (
            <div key={dim.id} className="border border-gray-100 rounded-lg overflow-hidden">
              <button onClick={() => toggleDim(dim.id)} className={`w-full flex items-center justify-between px-3 py-2 transition-colors ${(disabled || guestMode) ? 'cursor-default' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: dim.color }} />
                  <span className="text-sm font-medium text-foreground">{dim.name}</span>
                  {selectedCount > 0 && !guestMode && (
                    <span className="px-1.5 py-0.5 rounded bg-burgundy/10 text-burgundy text-xs">{selectedCount}</span>
                  )}
                  {guestMode && (
                    <Lock className="w-3 h-3 text-slate-blue/30" />
                  )}
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-blue/40" /> : <ChevronDown className="w-4 h-4 text-slate-blue/40" />}
              </button>
              {isOpen && (
                <div className="px-3 pb-3 flex flex-wrap gap-1.5">
                  {dim.tags.map(tag => {
                    const isSelected = filters[dim.id as keyof ActiveFilters].includes(tag.value);
                    return (
                      <button key={tag.value} onClick={() => toggleTag(dim.id as keyof ActiveFilters, tag.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                          isSelected
                            ? 'text-white font-medium shadow-sm'
                            : (disabled || guestMode) ? 'bg-gray-100 text-slate-blue/40 cursor-not-allowed' : 'bg-gray-100 text-slate-blue hover:bg-gray-200'
                        }`}
                        style={isSelected ? { backgroundColor: tag.color || dim.color } : undefined}
                        disabled={disabled || guestMode}>
                        {tag.value}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 子组件：疾病分类视图
// ============================================

function DiseaseView({ companies, onSelectIndication }: {
  companies: Company[]; onSelectIndication: (ind: string) => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISEASE_CATEGORIES.map(cat => {
          const companyCount = companies.filter(c =>
            c.diseaseAreas?.includes(cat.name) ||
            c.diseaseIndications?.some(i => cat.indications.some(ci => i.includes(ci))) ||
            c.segment?.includes(cat.name) ||
            cat.indications.some(ind => c.segment?.includes(ind) || c.products?.includes(ind))
          ).length;
          const isOpen = expandedCategory === cat.name;

          return (
            <div key={cat.name}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setExpandedCategory(isOpen ? null : cat.name)}>
              <div className="p-4" style={{ borderLeft: `4px solid ${cat.color}` }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-slate-blue">{companyCount} 家</span>
                </div>
                <p className="text-xs text-slate-blue/60 mb-2">{cat.bciApps.join(' / ')}</p>
                <div className="flex flex-wrap gap-1">
                  {cat.indications.map(ind => (
                    <span key={ind} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-50 space-y-2">
                  <p className="text-xs text-slate-blue/50 pt-2">点击适应症筛选企业：</p>
                  {cat.indications.map((ind, idx) => (
                    <button key={ind} onClick={(e) => { e.stopPropagation(); onSelectIndication(ind); }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-burgundy/5 transition-colors flex items-center justify-between group">
                      <div>
                        <span className="text-sm font-medium text-foreground">{ind}</span>
                        <span className="text-xs text-slate-blue/50 ml-2">{cat.bciApps[idx]}</span>
                      </div>
                      <span className="text-xs text-burgundy opacity-0 group-hover:opacity-100 transition-opacity">筛选 →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 子组件：产业链视图
// ============================================

function ChainView({ companies }: { companies: Company[] }) {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string>(TECH_ROUTES[0].value);

  const levels = ['上游', '中游', '下游'] as const;
  const levelLabels: Record<string, { title: string; icon: any; color: string }> = {
    '上游': { title: '上游：核心硬件/材料/元器件', icon: Cpu, color: '#E67E22' },
    '中游': { title: '中游：系统集成/算法/设备', icon: BrainCircuit, color: '#3498DB' },
    '下游': { title: '下游：应用/服务/场景', icon: Target, color: '#27AE60' },
  };

  return (
    <div className="space-y-4">
      {/* 技术路径切换 */}
      <div className="flex flex-wrap gap-2">
        {TECH_ROUTES.map(route => (
          <button key={route.value} onClick={() => setSelectedRoute(route.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedRoute === route.value ? 'text-white shadow-md' : 'bg-gray-100 text-slate-blue hover:bg-gray-200'
            }`}
            style={selectedRoute === route.value ? { backgroundColor: route.color } : undefined}>
            {route.value}
          </button>
        ))}
      </div>

      {/* 上中下游三段式 */}
      <div className="space-y-4">
        {levels.map(level => {
          const config = levelLabels[level];
          const Icon = config.icon;
          // 筛选该层级+该技术路径的企业
          const levelCompanies = companies.filter(c => {
            const matchesLevel = getChainLevel(c.chainPosition) === level;
            const matchesRoute = getTechRouteMain(c.techRoute) === selectedRoute ||
              (selectedRoute === '非侵入式' && !c.techRoute?.includes('侵入') && !c.techRoute?.includes('介入'));
            return matchesLevel && matchesRoute;
          });

          // 按细分环节分组
          const groups = new Map<string, Company[]>();
          levelCompanies.forEach(c => {
            const sub = c.chainPosition.split('-').slice(1).join('-') || '其他';
            if (!groups.has(sub)) groups.set(sub, []);
            groups.get(sub)!.push(c);
          });

          return (
            <div key={level} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: `${config.color}08`, borderBottom: `2px solid ${config.color}` }}>
                <Icon className="w-5 h-5" style={{ color: config.color }} />
                <h3 className="font-semibold text-foreground">{config.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ backgroundColor: config.color }}>{levelCompanies.length}</span>
              </div>
              <div className="p-4 space-y-3">
                {Array.from(groups.entries()).map(([sub, comps]) => (
                  <div key={sub}>
                    <h4 className="text-xs font-semibold text-slate-blue/70 uppercase tracking-wider mb-2">{sub}</h4>
                    <div className="flex flex-wrap gap-2">
                      {comps.map(c => (
                        <span
                          key={c.id}
                          onClick={() => navigate(`/company/${c.id}`)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-foreground border border-gray-100 hover:border-burgundy/30 hover:bg-burgundy/5 hover:text-burgundy transition-colors cursor-pointer"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {levelCompanies.length === 0 && (
                  <p className="text-sm text-slate-blue/40 text-center py-4">该层级暂无{selectedRoute}企业</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 子组件：标签云视图
// ============================================

function TagsCloudView({ filters, onChange }: {
  filters: ActiveFilters; onChange: (f: ActiveFilters) => void;
}) {
  return (
    <div className="space-y-6">
      {TAG_DIMENSIONS.map(dim => {
        const Icon = getTagIcon(dim.id);
        return (
          <div key={dim.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${dim.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: dim.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{dim.name}</h3>
                <p className="text-xs text-slate-blue/50">{dim.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {dim.tags.map(tag => {
                const isSelected = filters[dim.id as keyof ActiveFilters].includes(tag.value);
                return (
                  <button key={tag.value}
                    onClick={() => onChange({
                      ...filters,
                      [dim.id]: isSelected
                        ? filters[dim.id as keyof ActiveFilters].filter(v => v !== tag.value)
                        : [...filters[dim.id as keyof ActiveFilters], tag.value],
                    })}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isSelected ? 'text-white font-medium shadow-sm' : 'bg-gray-100 text-slate-blue hover:bg-gray-200'
                    }`}
                    style={isSelected ? { backgroundColor: tag.color || dim.color } : undefined}>
                    {tag.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// 主组件
// ============================================

export default function DatabasePage() {
  const navigate = useNavigate();
  const { canUseFilters, isGuest, isExpired, showLogin } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('disease');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ActiveFilters>(INITIAL_FILTERS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [listViewMode, setListViewMode] = useState<'card' | 'table'>('table');
  const [countryFilter, setCountryFilter] = useState<'global' | 'china' | 'usa' | 'others'>('global');
  const [compareIds, setCompareIds] = useState<number[]>([]);

  // 过期用户自动清空筛选器（不能继续使用维度筛选）
  useEffect(() => {
    if (isExpired) {
      setFilters(INITIAL_FILTERS);
    }
  }, [isExpired]);

  // 搜索+标签过滤+国家筛选
  const filteredCompanies = useMemo(() => {
    return companiesData.filter(c => {
      const matchesSearch = !searchQuery ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.founder?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.segment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = countryFilter === 'global' ||
        (countryFilter === 'china' && (c.country === '中国' || !c.country)) ||
        (countryFilter === 'usa' && c.country === '美国') ||
        (countryFilter === 'others' && c.country && c.country !== '中国' && c.country !== '美国');
      return matchesSearch && matchesCountry && companyMatchesFilters(c, filters);
    });
  }, [searchQuery, filters, countryFilter]);

  // 统计数据（基于当前筛选结果）
  const stats = useMemo(() => {
    const total = filteredCompanies.length;
    const invasive = filteredCompanies.filter(c => c.techRoute?.includes('侵入式')).length;
    const nonInvasive = filteredCompanies.filter(c => c.techRoute?.includes('非侵入式')).length;
    const listed = filteredCompanies.filter(c => c.type?.includes('上市')).length;
    return { total, invasive, nonInvasive, listed };
  }, [filteredCompanies]);

  // 选择适应症 -> 切换到列表视图并应用筛选
  const handleSelectIndication = useCallback((indication: string) => {
    setFilters(prev => ({ ...prev, diseaseArea: [indication] }));
    setViewMode('list');
  }, []);

  const clearFilters = () => setFilters(INITIAL_FILTERS);
  const filterCount = getFilterCount(filters);
  const hasActiveFilters = searchQuery || filterCount > 0;

  const viewButtons: { mode: ViewMode; label: string; icon: any }[] = [
    { mode: 'chain', label: '产业链', icon: Layers },
    { mode: 'list', label: '企业列表', icon: Grid3X3 },
    { mode: 'disease', label: '疾病分类', icon: Stethoscope },
    { mode: 'tags', label: '标签云', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy/10 text-burgundy text-sm font-medium mb-3">
              <DatabaseIcon className="w-4 h-4" />
              <span>PhiNeuro 独家数据库</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-3">
              全球神经科技企业数据库
            </h1>
            <p className="text-slate-blue max-w-2xl mx-auto">
              全球首个以<span className="font-semibold text-burgundy">疾病为核心维度</span>、以
              <span className="font-semibold text-burgundy">产业链为骨架</span>、覆盖
              <span className="font-semibold text-burgundy">九维标签体系</span>的脑机接口产业数据库
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Building2, label: '覆盖企业', value: `${stats.total}+`, color: '#722F37' },
            { icon: Microscope, label: '侵入式企业', value: stats.invasive, color: '#E74C3C' },
            { icon: Monitor, label: '非侵入式企业', value: stats.nonInvasive, color: '#27AE60' },
            { icon: Award, label: '上市公司', value: stats.listed, color: '#D4AF37' },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl border border-burgundy/10 bg-white shadow-card">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ backgroundColor: `${s.color}15` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="font-mono text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <p className="text-slate-blue/60 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Country Filter */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { key: 'global' as const, label: '全球' },
            { key: 'china' as const, label: '中国' },
            { key: 'usa' as const, label: '美国' },
            { key: 'others' as const, label: '其它' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setCountryFilter(btn.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                countryFilter === btn.key
                  ? 'bg-burgundy text-white shadow-card'
                  : 'bg-white text-slate-blue border border-gray-200 hover:border-burgundy/30 hover:text-burgundy'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {viewButtons.map(btn => {
            const Icon = btn.icon;
            const isActive = viewMode === btn.mode;
            return (
              <button key={btn.mode} onClick={() => setViewMode(btn.mode)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-burgundy text-white shadow-md' : 'bg-white text-slate-blue border border-gray-200 hover:bg-burgundy/5'
                }`}>
                <Icon className="w-4 h-4" /> {btn.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-blue/40" />
            <input type="text" placeholder="搜索企业名称、创始人、技术路线、细分赛道..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-burgundy/5 transition-colors font-medium text-slate-blue">
            <Filter className="w-4 h-4" />
            高级筛选
            {filterCount > 0 && <span className="w-2 h-2 rounded-full bg-burgundy" />}
          </button>
          {hasActiveFilters && (
            <button onClick={() => { setSearchQuery(''); clearFilters(); }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-red-50 text-red-500 transition-colors font-medium">
              <X className="w-4 h-4" /> 清除
            </button>
          )}
        </div>

        {/* 结果数 + 已选标签快捷展示 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-slate-blue/60">
            共找到 <span className="font-semibold text-burgundy">{filteredCompanies.length}</span> 家企业
          </span>
          {filterCount > 0 && (
            <div className="flex flex-wrap gap-1">
              {ALL_DIMENSION_KEYS.flatMap(key =>
                filters[key].map(value => (
                  <button key={`${key}-${value}`} onClick={() => {
                    setFilters(prev => ({ ...prev, [key]: prev[key].filter(v => v !== value) }));
                  }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-burgundy/10 text-burgundy hover:bg-red-50 transition-colors">
                    {value} <XCircle className="w-3 h-3" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:col-span-1">
              {isGuest ? (
                <TagFilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  disabled={false}
                  guestMode={true}
                  onShowLogin={showLogin}
                />
              ) : (
                <TagFilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onClear={clearFilters}
                  disabled={!canUseFilters}
                />
              )}
            </div>
          )}

          {/* Content Area */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {viewMode === 'disease' && (
              <DiseaseView companies={filteredCompanies} onSelectIndication={handleSelectIndication} />
            )}
            {viewMode === 'chain' && (
              <ChainView companies={filteredCompanies} />
            )}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {/* 卡片/表格切换 */}
                <div className="flex justify-end gap-2">
                  <button onClick={() => setListViewMode('table')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      listViewMode === 'table' ? 'bg-burgundy text-white' : 'bg-gray-100 text-slate-blue hover:bg-gray-200'
                    }`}>
                    <Grid3X3 className="w-3.5 h-3.5" /> 表格
                  </button>
                  <button onClick={() => setListViewMode('card')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      listViewMode === 'card' ? 'bg-burgundy text-white' : 'bg-gray-100 text-slate-blue hover:bg-gray-200'
                    }`}>
                    <Layers className="w-3.5 h-3.5" /> 卡片
                  </button>
                </div>
                {listViewMode === 'table' ? (
                  <CompanyTable companies={filteredCompanies} expandedId={expandedId}
                    onToggle={(id) => setExpandedId(expandedId === id ? null : id)}
                    compareIds={compareIds}
                    onToggleCompare={(id) => {
                      setCompareIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev);
                    }}
                  />
                ) : (
                  <>
                    {filteredCompanies.map(company => (
                      <CompanyCard key={company.id} company={company}
                        expanded={expandedId === company.id}
                        onToggle={() => setExpandedId(expandedId === company.id ? null : company.id)}
                        isComparing={compareIds.includes(company.id)}
                        onToggleCompare={() => {
                          setCompareIds(prev => prev.includes(company.id) ? prev.filter(i => i !== company.id) : prev.length < 3 ? [...prev, company.id] : prev);
                        }}
                      />
                    ))}
                  </>
                )}
                {filteredCompanies.length === 0 && (
                  <div className="py-16 text-center">
                    <Search className="w-12 h-12 text-slate-blue/20 mx-auto mb-4" />
                    <p className="text-slate-blue/50">未找到匹配的企业，请尝试其他筛选条件</p>
                  </div>
                )}
              </div>
            )}
            {viewMode === 'tags' && (
              <TagsCloudView filters={filters} onChange={setFilters} />
            )}
          </div>
        </div>

        {/* 浮动对比栏 */}
        {compareIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg px-5 py-3 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-burgundy" />
                <span className="text-sm font-medium text-foreground">已选 {compareIds.length} 家</span>
              </div>
              <div className="flex items-center gap-2">
                {compareIds.map(id => {
                  const c = companiesData.find(x => x.id === id);
                  return c ? (
                    <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-burgundy/10 text-burgundy text-xs">
                      {c.name}
                      <button onClick={() => setCompareIds(prev => prev.filter(i => i !== id))} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareIds([])}
                  className="text-xs text-slate-blue/50 hover:text-red-500 transition-colors"
                >
                  清空
                </button>
                <button
                  onClick={() => navigate(`/compare?ids=${compareIds.join(',')}`)}
                  disabled={compareIds.length < 2}
                  className="px-4 py-1.5 rounded-lg bg-burgundy text-white text-xs font-medium hover:bg-burgundy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  开始对比
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-blue/40">
          <p>数据截止 2026年5月 | 共收录 {companiesData.length} 家全球神经科技企业（中国+海外） | 九维标签体系 v1.0</p>
        </div>
      </div>
    </div>
  );
}
