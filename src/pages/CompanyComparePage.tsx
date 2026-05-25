import { useSearchParams, useNavigate } from 'react-router';
import { useMemo, useState, useEffect } from 'react';
import {
  ArrowLeft, Building2, Cpu, Stethoscope, DollarSign,
  Award, Users, Lightbulb, MapPin, Calendar, TrendingUp,
  Microscope, Layers, Activity, Shield, Box, Tag,
  X, BarChart3
} from 'lucide-react';
import { companiesData, getFundingDisplay, getTechRouteMain } from '../data/companiesData';
import {
  getTechRouteColor, getClinicalStageColor, getDiseaseColor,
  getChainLevel, getChainLevelColor,
} from '../data/databaseTags';
import CompanyTimeline from '../components/CompanyTimeline';

interface IntelFeed {
  id: number;
  title: string;
  title_zh?: string;
  url: string;
  published_at: string;
  event_type?: string;
}

const MAX_COMPARE = 3;

function CompareRow({ label, icon: Icon, children }: {
  label: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-slate-blue/60">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, 1fr)` }}>
        {children}
      </div>
    </div>
  );
}

function CompareCell({ value, color, tags }: {
  value?: string | string[] | number | null; color?: string; tags?: { label: string; color: string }[];
}) {
  if (tags && tags.length > 0) {
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((t, i) => (
          <span key={i} className="px-2 py-0.5 rounded text-[11px] font-medium text-white" style={{ backgroundColor: t.color }}>
            {t.label}
          </span>
        ))}
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-blue/30 text-sm">-</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-slate-blue text-xs">{v}</span>
        ))}
      </div>
    );
  }
  if (!value || value === '-' || value === '') {
    return <span className="text-slate-blue/30 text-sm">-</span>;
  }
  if (color) {
    return <span className="text-sm font-medium" style={{ color }}>{value}</span>;
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

function CompanyHeader({ company, onRemove }: {
  company: typeof companiesData[0]; onRemove: () => void;
}) {
  const navigate = useNavigate();
  const techColor = getTechRouteColor(company.techRoute);
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-4">
      <button onClick={onRemove} className="absolute top-2 right-2 p-1 rounded-lg hover:bg-gray-100 text-slate-blue/40 hover:text-red-500 transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div
        onClick={() => navigate(`/company/${company.id}`)}
        className="cursor-pointer hover:text-burgundy transition-colors"
      >
        <h3 className="font-bold text-foreground text-base pr-6">{company.name}</h3>
        <p className="text-xs text-slate-blue/50 mt-0.5">{company.nameEn}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {company.techRoute && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: techColor }}>
            {getTechRouteMain(company.techRoute)}
          </span>
        )}
        {company.clinicalStage && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ backgroundColor: getClinicalStageColor(company.clinicalStage) }}>
            {company.clinicalStage}
          </span>
        )}
        {company.country && (
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-slate-blue">
            {company.country}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CompanyComparePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const ids = idsParam.split(',').map(Number).filter(n => !isNaN(n) && n > 0).slice(0, MAX_COMPARE);

  const selectedCompanies = useMemo(() => {
    return ids.map(id => companiesData.find(c => c.id === id)).filter(Boolean) as typeof companiesData;
  }, [ids]);

  const [intelMap, setIntelMap] = useState<Record<number, IntelFeed[]>>({});
  const [intelLoading, setIntelLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) return;
    setIntelLoading(true);
    fetch(`https://datasets.phineuro.life/api/intel/by-company/batch?ids=${ids.join(',')}&limit=10`)
      .then(res => res.json())
      .then(data => {
        const map: Record<number, IntelFeed[]> = {};
        if (data.data) {
          for (const [key, feeds] of Object.entries(data.data)) {
            map[parseInt(key)] = (feeds as IntelFeed[]);
          }
        }
        setIntelMap(map);
        setIntelLoading(false);
      })
      .catch(() => {
        setIntelMap({});
        setIntelLoading(false);
      });
  }, [idsParam]);

  if (selectedCompanies.length < 2) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <BarChart3 className="w-16 h-16 text-slate-blue/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-burgundy mb-2">企业对比</h1>
          <p className="text-slate-blue/60 mb-6">请至少选择 2 家企业进行对比</p>
          <button
            onClick={() => navigate('/database')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 前往数据库选择企业
          </button>
        </div>
      </div>
    );
  }

  const colCount = selectedCompanies.length;

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回
          </button>
          <h1 className="text-xl font-bold text-burgundy font-serif">企业多维对比</h1>
          <span className="text-xs text-slate-blue/40">{selectedCompanies.length} 家</span>
        </div>

        {/* Company Headers */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
          {selectedCompanies.map(company => (
            <CompanyHeader
              key={company.id}
              company={company}
              onRemove={() => {
                const newIds = ids.filter(id => id !== company.id);
                navigate(`/compare?ids=${newIds.join(',')}`);
              }}
            />
          ))}
        </div>

        {/* Compare Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-burgundy/[0.02]">
            <h2 className="font-semibold text-foreground text-sm">九维标签对比</h2>
          </div>

          <div className="px-5">
            <CompareRow label="技术路线" icon={Microscope}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.techRoute} color={getTechRouteColor(c.techRoute)} />
              ))}
            </CompareRow>

            <CompareRow label="产业链位置" icon={Layers}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.chainPosition} color={getChainLevelColor(getChainLevel(c.chainPosition))} />
              ))}
            </CompareRow>

            <CompareRow label="细分赛道" icon={Tag}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.segment} />
              ))}
            </CompareRow>

            <CompareRow label="疾病领域" icon={Stethoscope}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} tags={c.diseaseAreas?.map(d => ({ label: d, color: getDiseaseColor(d) }))} />
              ))}
            </CompareRow>

            <CompareRow label="临床阶段" icon={Activity}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.clinicalStage} color={getClinicalStageColor(c.clinicalStage || '')} />
              ))}
            </CompareRow>

            <CompareRow label="监管状态" icon={Shield}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.regulatoryStatus} />
              ))}
            </CompareRow>

            <CompareRow label="产品形态" icon={Box}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.productForm} />
              ))}
            </CompareRow>

            <CompareRow label="商业模式" icon={Users}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.businessModel} />
              ))}
            </CompareRow>

            <CompareRow label="融资阶段" icon={TrendingUp}>
              {selectedCompanies.map(c => (
                <CompareCell key={c.id} value={c.fundingStage || c.latestRound} />
              ))}
            </CompareRow>
          </div>
        </div>

        {/* Deep Info Compare */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-gray-100 bg-burgundy/[0.02]">
            <h2 className="font-semibold text-foreground text-sm">深度信息对比</h2>
          </div>
          <div className="px-5">
            <CompareRow label="成立时间" icon={Calendar}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.founded} />)}
            </CompareRow>
            <CompareRow label="总部" icon={MapPin}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.location} />)}
            </CompareRow>
            <CompareRow label="创始人" icon={Building2}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.founder} />)}
            </CompareRow>
            <CompareRow label="创始人背景" icon={Cpu}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.founderBg} />)}
            </CompareRow>
            <CompareRow label="核心产品" icon={Award}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.products} />)}
            </CompareRow>
            <CompareRow label="累计融资" icon={DollarSign}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={getFundingDisplay(c.totalFunding)} color="#B01C2E" />)}
            </CompareRow>
            <CompareRow label="最新轮次" icon={TrendingUp}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={`${c.latestRound || '-'} ${c.latestAmount ? `(${c.latestAmount}亿)` : ''}`} />)}
            </CompareRow>
            <CompareRow label="投资方" icon={Users}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.investors} />)}
            </CompareRow>
            <CompareRow label="核心优势" icon={Lightbulb}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.advantage} />)}
            </CompareRow>
            <CompareRow label="对标海外" icon={BarChart3}>
              {selectedCompanies.map(c => <CompareCell key={c.id} value={c.overseasPeer} />)}
            </CompareRow>
          </div>
        </div>

        {/* 时间线对比 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6">
          <div className="px-5 py-3 border-b border-gray-100 bg-burgundy/[0.02]">
            <h2 className="font-semibold text-foreground text-sm">商业化时间线对比</h2>
          </div>
          <div className="p-5">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
              {selectedCompanies.map(c => (
                <div key={c.id}>
                  <h4 className="text-sm font-medium text-burgundy mb-3">{c.name}</h4>
                  {intelLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-xs text-slate-blue/50">加载情报...</span>
                    </div>
                  ) : (
                    <CompanyTimeline founded={c.founded} intelFeeds={intelMap[c.id] || []} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/database')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回数据库
          </button>
        </div>
      </div>
    </div>
  );
}
