import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
  ArrowLeft, Building2, GraduationCap, Briefcase, BookOpen,
  Award, Globe, Linkedin, User, Info
} from 'lucide-react';
import { companiesData } from '../data/companiesData';

interface Founder {
  id: string;
  name: string;
  name_en?: string;
  title?: string;
  current_company_id?: number;
  companies: Array<{ company_id: number; role: string; period: string }>;
  education?: Array<{ institution: string; degree: string; field: string; period?: string }>;
  work_experience?: Array<{ company: string; title: string; period: string; description?: string }>;
  background?: string;
  research_focus?: string[];
  patents?: number;
  publications?: Array<{ title: string; journal: string; year: string; url?: string }>;
  bio?: string;
  photo_url?: string;
  social_links?: { linkedin?: string; twitter?: string; scholar?: string };
  data_source?: string;
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-burgundy" />
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  );
}

export default function FounderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [founder, setFounder] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://datasets.phineuro.life/api/founders/${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setFounder(data.data as Founder);
        } else {
          setError(data.error === 'Founder not found' ? '创始人信息搭建中' : (data.error || '创始人信息搭建中'));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('加载失败');
        setLoading(false);
      });
  }, [id]);

  const currentCompany = founder?.current_company_id
    ? companiesData.find(c => c.id === founder.current_company_id)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !founder) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <User className="w-16 h-16 text-slate-blue/20 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-burgundy mb-2">创始人信息</h1>
          <p className="text-slate-blue/60 mb-6">{error || '创始人信息搭建中'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy text-white text-sm font-medium hover:bg-burgundy-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-blue/70 hover:text-burgundy transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="h-24 bg-burgundy/10" />
          <div className="px-6 pb-6 relative">
            <div className="-mt-12 mb-4 flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-burgundy/20 border-4 border-white flex items-center justify-center shadow-sm">
                {founder.photo_url ? (
                  <img src={founder.photo_url} alt={founder.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <User className="w-10 h-10 text-burgundy/60" />
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-foreground">{founder.name}</h1>
                {founder.name_en && <p className="text-sm text-slate-blue/60">{founder.name_en}</p>}
                {founder.title && <p className="text-sm text-burgundy mt-0.5">{founder.title}</p>}
              </div>
            </div>

            {currentCompany && (
              <div className="flex items-center gap-2 text-sm text-slate-blue/70 mb-3">
                <Building2 className="w-4 h-4" />
                <span>现任：</span>
                <button
                  onClick={() => navigate(`/company/${currentCompany.id}`)}
                  className="text-burgundy hover:underline font-medium"
                >
                  {currentCompany.name}
                </button>
              </div>
            )}

            {founder.bio && (
              <p className="text-sm text-text-secondary leading-relaxed">{founder.bio}</p>
            )}

            {founder.social_links && (
              <div className="flex items-center gap-3 mt-3">
                {founder.social_links.linkedin && (
                  <a href={founder.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-blue/60 hover:text-burgundy transition-colors">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
                {founder.social_links.scholar && (
                  <a href={founder.social_links.scholar} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-blue/60 hover:text-burgundy transition-colors">
                    <BookOpen className="w-3.5 h-3.5" /> Google Scholar
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Background */}
            {founder.background && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={Info} title="学术背景" />
                <p className="text-sm text-text-secondary leading-relaxed">{founder.background}</p>
              </div>
            )}

            {/* Education */}
            {founder.education && founder.education.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={GraduationCap} title="教育背景" />
                <div className="space-y-3">
                  {founder.education.map((edu, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-burgundy" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{edu.institution}</p>
                        <p className="text-xs text-slate-blue/60">{edu.degree} · {edu.field}</p>
                        {edu.period && <p className="text-xs text-slate-blue/40">{edu.period}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {founder.work_experience && founder.work_experience.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={Briefcase} title="工作经历" />
                <div className="space-y-3">
                  {founder.work_experience.map((exp, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-burgundy" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{exp.title}</p>
                        <p className="text-xs text-slate-blue/60">{exp.company}</p>
                        <p className="text-xs text-slate-blue/40">{exp.period}</p>
                        {exp.description && <p className="text-xs text-text-secondary mt-1">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {founder.publications && founder.publications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={BookOpen} title="代表成果" />
                <div className="space-y-2">
                  {founder.publications.map((pub, i) => (
                    <div key={i} className="text-sm">
                      {pub.url ? (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer"
                          className="text-foreground hover:text-burgundy transition-colors line-clamp-1">
                          {pub.title}
                        </a>
                      ) : (
                        <p className="text-foreground line-clamp-1">{pub.title}</p>
                      )}
                      <p className="text-xs text-slate-blue/50">{pub.journal} · {pub.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Research Focus */}
            {founder.research_focus && founder.research_focus.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={Globe} title="研究方向" />
                <div className="flex flex-wrap gap-1.5">
                  {founder.research_focus.map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-burgundy/[0.08] text-burgundy text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Patents */}
            {founder.patents !== undefined && founder.patents !== null && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={Award} title="专利数量" />
                <p className="text-2xl font-bold text-burgundy">{founder.patents}</p>
                <p className="text-xs text-slate-blue/50">项专利</p>
              </div>
            )}

            {/* Related Companies */}
            {founder.companies && founder.companies.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionTitle icon={Building2} title="关联企业" />
                <div className="space-y-2">
                  {founder.companies.map((c, i) => {
                    const company = companiesData.find(cd => cd.id === c.company_id);
                    return (
                      <button
                        key={i}
                        onClick={() => company && navigate(`/company/${company.id}`)}
                        className="w-full text-left p-2.5 rounded-lg bg-gray-50 hover:bg-burgundy/[0.04] transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground">{company?.name || '未知企业'}</p>
                        <p className="text-xs text-slate-blue/50">{c.role} · {c.period}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Data Source Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-blue/40 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-blue/50">{founder.data_source || '信息来自公开报道搜集，仅供行业研究参考'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
