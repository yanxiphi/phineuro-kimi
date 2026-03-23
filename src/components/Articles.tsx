import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock, BookOpen, Mail } from 'lucide-react';

interface WeeklyItem {
  id: number;
  title: string;
  issue: string;
  readTime: string;
  summary: string;
}

const weeklyItems: WeeklyItem[] = [
  {
    id: 1,
    title: 'Neuralink人体试验：首年数据解读',
    issue: 'Weekly #152',
    readTime: '10分钟',
    summary: 'Neuralink首位人体受试者Noland Arbaugh的一年体验数据，以及脑机接口技术的临床前景。',
  },
  {
    id: 2,
    title: '自由意志的幻觉：神经科学的挑战',
    issue: 'Weekly #151',
    readTime: '15分钟',
    summary: '从Libet实验到现代神经科学，探讨自由意志是否只是大脑事后的叙事建构。',
  },
  {
    id: 3,
    title: '神经退行性疾病：2024年治疗进展',
    issue: 'Weekly #150',
    readTime: '12分钟',
    summary: '阿尔茨海默病、帕金森病的最新治疗突破，从抗淀粉样蛋白到基因疗法。',
  },
  {
    id: 4,
    title: '意识的整合信息理论：IIT深度解析',
    issue: 'Weekly #149',
    readTime: '18分钟',
    summary: 'Tononi的整合信息理论如何量化意识，以及它在AI意识检测中的应用前景。',
  },
];

export default function Articles() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="articles"
      ref={sectionRef}
      className="py-24 bg-cream"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2
              className={`font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Weekly周刊
            </h2>
            <p
              className={`text-slate-blue transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              每周精选神经科学前沿研究解读
            </p>
          </div>
          <a
            href="#"
            className={`inline-flex items-center gap-2 text-burgundy font-medium hover:text-gold transition-all duration-300 group ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            查看全部周刊
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Weekly List */}
        <div className="space-y-4">
          {weeklyItems.map((item, index) => (
            <a
              key={item.id}
              href="#"
              className={`block group transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`relative flex items-start gap-6 p-6 rounded-xl transition-all duration-300 ${
                  hoveredId === item.id
                    ? 'bg-burgundy/5 border-l-4 border-burgundy pl-5'
                    : 'bg-white border-l-4 border-transparent hover:bg-burgundy/5'
                }`}
              >
                {/* Issue Number */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                    hoveredId === item.id
                      ? 'bg-burgundy text-white scale-110'
                      : 'bg-gray-100 text-slate-blue group-hover:bg-burgundy/10 group-hover:text-burgundy'
                  }`}
                >
                  <span className="text-xs opacity-70">Issue</span>
                  <span className="font-mono font-bold text-lg">{item.id}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gold font-medium">{item.issue}</span>
                  </div>
                  <h3
                    className={`font-serif text-xl font-semibold mb-2 transition-colors duration-200 ${
                      hoveredId === item.id ? 'text-burgundy' : 'text-foreground'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-blue/80 text-sm mb-3 line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-blue/60">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>深度解读</span>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className={`flex-shrink-0 self-center transition-all duration-300 ${
                    hoveredId === item.id
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <ArrowRight
                    className={`w-6 h-6 transition-transform duration-300 ${
                      hoveredId === item.id ? 'rotate-0 text-burgundy' : '-rotate-45'
                    }`}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div
          className={`mt-8 p-6 bg-burgundy/5 rounded-xl border border-burgundy/10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-burgundy flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">订阅Weekly周刊</h4>
                <p className="text-sm text-slate-blue/70">每周一发送，追踪神经科学前沿</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors">
              立即订阅
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
