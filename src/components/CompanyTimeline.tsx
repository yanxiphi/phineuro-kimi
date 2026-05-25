import { useMemo } from 'react';
import {
  Calendar, TrendingUp, Stethoscope, Box, Handshake, User,
  FlaskConical, Award, Circle
} from 'lucide-react';

interface TimelineEvent {
  date: string;
  type: 'founded' | 'funding' | 'clinical' | 'regulatory' | 'product' | 'partnership' | 'personnel' | 'academic' | 'other';
  title: string;
  url?: string;
}

const EVENT_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  founded: { label: '成立', color: '#722F37', icon: Calendar },
  funding: { label: '融资', color: '#D35400', icon: TrendingUp },
  clinical: { label: '临床', color: '#2980B9', icon: Stethoscope },
  regulatory: { label: '监管', color: '#8E44AD', icon: Award },
  product: { label: '产品', color: '#27AE60', icon: Box },
  partnership: { label: '合作', color: '#16A085', icon: Handshake },
  personnel: { label: '人事', color: '#C0392B', icon: User },
  academic: { label: '学术', color: '#B01C2E', icon: FlaskConical },
  other: { label: '动态', color: '#95A5A6', icon: Circle },
};

export default function CompanyTimeline({ founded, intelFeeds }: {
  founded?: string;
  intelFeeds: Array<{ id: number; title: string; title_zh?: string; url: string; published_at: string; event_type?: string }>;
}) {
  const events = useMemo(() => {
    const list: TimelineEvent[] = [];

    if (founded) {
      list.push({ date: founded, type: 'founded', title: '公司成立' });
    }

    for (const feed of intelFeeds) {
      const type = (feed.event_type || 'other') as TimelineEvent['type'];
      list.push({
        date: feed.published_at,
        type,
        title: feed.title_zh || feed.title,
        url: feed.url,
      });
    }

    // 按日期排序（最新的在前）
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [founded, intelFeeds]);

  if (events.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-burgundy" />
        </div>
        <h3 className="font-semibold text-foreground">企业时间线</h3>
        <span className="text-xs text-slate-blue/40">{events.length} 个里程碑</span>
      </div>

      <div className="relative pl-4">
        {/* 垂直轴线 */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

        <div className="space-y-4">
          {events.map((evt, index) => {
            const config = EVENT_CONFIG[evt.type] || EVENT_CONFIG.other;
            const Icon = config.icon;
            const isFirst = index === 0;

            return (
              <div key={index} className="relative flex gap-3">
                {/* 节点 */}
                <div className={`relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isFirst ? 'ring-2 ring-burgundy/20' : ''}`}
                  style={{ backgroundColor: config.color }}>
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded text-white font-medium"
                      style={{ backgroundColor: config.color }}>
                      {config.label}
                    </span>
                    <span className="text-[11px] text-slate-blue/40">
                      {new Date(evt.date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  {evt.url ? (
                    <a href={evt.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-burgundy transition-colors line-clamp-2">
                      {evt.title}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{evt.title}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
