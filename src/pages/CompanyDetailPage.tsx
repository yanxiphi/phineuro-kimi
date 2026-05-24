import { useParams, useNavigate } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Building2, MapPin, Calendar, Cpu,
  DollarSign, Award, Mail, Phone, FileText, Globe,
  TrendingUp, Stethoscope, Users, Lightbulb, Lock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { companiesData, getFundingDisplay, getTechRouteMain } from '../data/companiesData';
import {
  getTechRouteColor, getClinicalStageColor, getDiseaseColor,
  getChainLevel, getChainLevelColor,
} from '../data/databaseTags';

function TagItem({ label, color }: { label: string; color: string }) {
  if (!label) return null;
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-burgundy" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === '' || value === '-') return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-slate-blue/50 flex-shrink-0 w-20">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function ChipRow({ label, values, getColor }: { label: string; values?: string[]; getColor?: (v: string) => string }) {
  if (!values || values.length === 0) return null;
  return (
    <div className="flex gap-3 text-sm items-start">
      <span className="text-slate-blue/50 flex-shrink-0 w-20 pt-0.5">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium text-white" style={{ backgroundColor: getColor?.(v) || '#722F37' }}>
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

interface IntelFeed {
  id: number;
  title: string;
  title_zh?: string;
  summary: string;
  summary_zh?: string;
  category: string;
  published_at: string;
  source_name: string;
  url: string;
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = Number(id);
  const company = companiesData.find(c => c.id === companyId);
  const [linkedIntel, setLinkedIntel] = useState<IntelFeed[]>([]);
  const [, setIntelLoading] = useState(false);
  const { isGuest, isExpired, showLogin } = useAuth();

  // 过期用户仅显示7天内的情报
  const displayedIntel = useMemo(() => {
    if (!isExpired) return linkedIntel;
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return linkedIntel.filter(feed => new Date(feed.published_at) >= cutoff);
  }, [linkedIntel, isExpired]);

  useEffect(() => {
    if (companyId) {
      setIntelLoading(true);
      fetch(`https://datasets.phineuro.life/api/intel/by-company/${companyId}?limit=10`)
        .then(res => res.json())
        .then(data => {
          setLinkedIntel(data.data || []);
          setIntelLoading(false);
        })
        .catch(() => {
          setLinkedIntel([]);
          setIntelLoading(false);
        });
    }
  }, [companyId]);

  if (!company) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 text-slate-blue/20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-burgundy mb-2">未找到该企业</h1>
          <p className="text-slate-blue/60 mb-6">数据库中不存在编号为 {id} 的企业</p>
          <button
            onClick={() => navigate('/database')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回数据库
          </button>
        </div>
      </div>
    );
  }

  const techColor = getTechRouteColor(company.techRoute);
  const mainTech = getTechRouteMain(company.techRoute);

  const tags: { label: string; color: string }[] = [];
  if (mainTech) tags.push({ label: mainTech, color: techColor });
  if (company.chainPosition) tags.push({ label: company.chainPosition.split('-')[0], color: getChainLevelColor(getChainLevel(company.chainPosition)) });
  if (company.clinicalStage) tags.push({ label: company.clinicalStage, color: getClinicalStageColor(company.clinicalStage) });
  if (company.fundingStage) tags.push({ label: company.fundingStage, color: '#D35400' });
  if (company.diseaseAreas?.[0]) tags.push({ label: company.diseaseAreas[0], color: getDiseaseColor(company.diseaseAreas[0]) });

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/database')}
          className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> 返回数据库
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-burgundy font-serif">{company.name}</h1>
                {company.country && (
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-slate-blue text-xs font-medium">
                    {company.country}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-blue/60 mb-3">{company.nameEn}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <TagItem key={i} label={tag.label} color={tag.color} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-burgundy/10 text-burgundy text-sm font-medium hover:bg-burgundy hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" /> 官网
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {company.founded && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/5 mb-2">
                  <Calendar className="w-5 h-5 text-burgundy" />
                </div>
                <div className="text-sm font-medium text-foreground">{company.founded}</div>
                <div className="text-xs text-slate-blue/50">成立时间</div>
              </div>
            )}
            {company.location && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/5 mb-2">
                  <MapPin className="w-5 h-5 text-burgundy" />
                </div>
                <div className="text-sm font-medium text-foreground">{company.location}</div>
                <div className="text-xs text-slate-blue/50">总部</div>
              </div>
            )}
            {company.employees && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/5 mb-2">
                  <Users className="w-5 h-5 text-burgundy" />
                </div>
                <div className="text-sm font-medium text-foreground">{company.employees}</div>
                <div className="text-xs text-slate-blue/50">员工规模</div>
              </div>
            )}
            {(company.totalFunding !== null && company.totalFunding !== undefined) && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-burgundy/5 mb-2">
                  <TrendingUp className="w-5 h-5 text-burgundy" />
                </div>
                <div className="text-sm font-medium text-burgundy">{getFundingDisplay(company.totalFunding)}</div>
                <div className="text-xs text-slate-blue/50">累计融资</div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {company.description && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">{company.description}</p>
            </div>
          </div>
        )}

        {/* 访客权限控制：详细信息 */}
        {isGuest ? (
          <div className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-6 overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center z-10">
              <Lock className="w-10 h-10 text-burgundy/40 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">企业详细信息</p>
              <p className="text-xs text-slate-blue/60 mb-4">登录后即可查看完整企业档案</p>
              <button
                onClick={showLogin}
                className="px-5 py-2 rounded-lg bg-burgundy text-white text-sm font-medium hover:bg-burgundy-dark transition-colors"
              >
                立即登录
              </button>
            </div>
            {/* 占位内容，用于保持高度 */}
            <div className="opacity-10 pointer-events-none select-none space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ) : (
          <>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* 基本信息 */}
          <InfoCard icon={Building2} title="基本信息">
            <InfoRow label="企业类型" value={company.type} />
            <InfoRow label="创始人" value={company.founder} />
            <InfoRow label="创始人背景" value={company.founderBg} />
            <InfoRow label="技术来源" value={company.techSource} />
            <InfoRow label="IPO状态" value={company.ipoStatus} />
            <InfoRow label="专利数量" value={company.patents !== null ? `${company.patents} 项` : null} />
          </InfoCard>

          {/* 技术路线 */}
          <InfoCard icon={Cpu} title="技术与产品">
            <InfoRow label="技术路线" value={company.techRoute} />
            <InfoRow label="产业链位置" value={company.chainPosition} />
            <InfoRow label="细分赛道" value={company.segment} />
            <InfoRow label="核心产品" value={company.products} />
            <InfoRow label="产品阶段" value={company.productStage} />
            <InfoRow label="注册认证" value={company.regCert} />
          </InfoCard>

          {/* 融资信息 */}
          <InfoCard icon={DollarSign} title="融资信息">
            <InfoRow label="融资阶段" value={company.fundingStage || company.latestRound} />
            <InfoRow label="最新轮次" value={company.latestRound} />
            <InfoRow label="最新金额" value={company.latestAmount !== null ? `${company.latestAmount}亿元` : null} />
            <InfoRow label="累计融资" value={getFundingDisplay(company.totalFunding)} />
            <InfoRow label="投资方" value={company.investors} />
          </InfoCard>

          {/* 市场与优势 */}
          <InfoCard icon={Award} title="市场与优势">
            <InfoRow label="核心优势" value={company.advantage} />
            <InfoRow label="对标海外" value={company.overseasPeer} />
            <InfoRow label="合作医院" value={company.hospitals} />
            <InfoRow label="学术关联" value={company.academicLink} />
          </InfoCard>

          {/* 疾病领域 */}
          {(company.diseaseAreas?.length || company.diseaseIndications?.length) && (
            <InfoCard icon={Stethoscope} title="疾病领域">
              <ChipRow label="疾病领域" values={company.diseaseAreas} getColor={getDiseaseColor} />
              <ChipRow label="适应症" values={company.diseaseIndications} getColor={() => '#27AE60'} />
              <InfoRow label="临床阶段" value={company.clinicalStage} />
              <ChipRow label="监管状态" values={company.regulatoryStatus} getColor={() => '#8E44AD'} />
              <InfoRow label="产品形态" value={company.productForm} />
            </InfoCard>
          )}

          {/* 商业模式与交叉创新 */}
          {(company.businessModel?.length || company.crossInnovation?.length) && (
            <InfoCard icon={Lightbulb} title="商业模式与创新">
              <ChipRow label="商业模式" values={company.businessModel} getColor={() => '#2980B9'} />
              <ChipRow label="交叉创新" values={company.crossInnovation} getColor={() => '#C0392B'} />
            </InfoCard>
          )}
        </div>

          </>
        )}

        {/* Contact */}
        {(company.email || company.phone) && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center">
                <Mail className="w-4 h-4 text-burgundy" />
              </div>
              <h3 className="font-semibold text-foreground">联系方式</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {company.email && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="w-4 h-4 text-slate-blue/40" />
                  {company.email}
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="w-4 h-4 text-slate-blue/40" />
                  {company.phone}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 相关情报 - 登录用户可见（过期用户仅7天内） */}
        {!isGuest && displayedIntel.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-burgundy" />
              </div>
              <h3 className="font-semibold text-foreground">相关情报</h3>
              <span className="text-xs text-slate-blue/40 ml-2">
                {displayedIntel.length} 条{isExpired ? '（最近7天）' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {displayedIntel.map(feed => (
                <a
                  key={feed.id}
                  href={feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg bg-gray-50 hover:bg-burgundy/5 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-burgundy transition-colors line-clamp-2">
                        {feed.title_zh || feed.title}
                      </p>
                      <p className="text-xs text-slate-blue/50 mt-1 line-clamp-2">
                        {feed.summary_zh || feed.summary}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-blue/40">
                        <span>{feed.source_name}</span>
                        <span>{new Date(feed.published_at).toLocaleDateString('zh-CN')}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          feed.category === '融资' ? 'bg-green-50 text-green-600' :
                          feed.category === '临床' ? 'bg-blue-50 text-blue-600' :
                          feed.category === '政策' ? 'bg-amber-50 text-amber-600' :
                          feed.category === '学术' ? 'bg-burgundy/10 text-burgundy' :
                          'bg-gray-50 text-gray-500'
                        }`}>{feed.category}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Data Source */}
        {company.dataSource && (
          <div className="text-center text-xs text-slate-blue/40 pt-4 border-t border-gray-100">
            <p>数据来源：{company.dataSource}</p>
          </div>
        )}
      </div>
    </div>
  );
}
