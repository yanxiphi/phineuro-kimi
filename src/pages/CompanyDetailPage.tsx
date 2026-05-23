import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft, Building2, MapPin, Calendar, Cpu,
  DollarSign, Award, Mail, Phone, FileText, Globe,
  TrendingUp, Stethoscope, Users, Lightbulb,
} from 'lucide-react';
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

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = Number(id);
  const company = companiesData.find(c => c.id === companyId);

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
