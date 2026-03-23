import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  summary: string;
  image: string;
  align: 'left' | 'right';
  url: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: '神经科学前沿：新研究挑战了记忆研究50年的基本假设',
    date: '2026年03月15日',
    summary: '发表于《自然·人类行为》：你的"自传"可能不是写出来的，而是编出来的。',
    image: './images/news-1.jpg',
    align: 'left',
    url: 'https://www.notion.so/260202-2fb6d43c4bc0802f9ecaca8548610f34?source=copy_link',
  },
  {
    id: 2,
    title: '生物与人工系统的神经认知融合？',
    date: '2026年12月10日',
    summary: '认知混合化：神经科学与人工智能界面上的身份重塑',
    image: './images/news-2.jpg',
    align: 'right',
    url: 'https://www.notion.so/260319-3286d43c4bc080ce9570e86767542c63?source=copy_link'
  },
  {
    id: 3,
    title: '复制大脑：从模拟到复制',
    date: '2026年03月21日',
    summary: '采用生物启发机制、连接人工神经元和突触的硬件——这种区分变得日益重要。',
    image: './images/news-3.jpg',
    align: 'left',
    url: 'https://www.notion.so/260319Duplicating-the-Brain-From-Simulation-to-Duplication-3286d43c4bc080e1a6eeffdeff5a229b?source=copy_link'
  },
];

export default function News() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            最新动态
          </h2>
          <p
            className={`text-slate-blue transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            追踪脑科学前沿，追问认知本质
          </p>
        </div>

        {/* News List */}
        <div className="space-y-16">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                item.align === 'right' ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative overflow-hidden rounded-2xl group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${item.align === 'left' ? '-translate-x-20' : 'translate-x-20'}`
                } ${item.align === 'right' ? 'lg:order-2' : ''}`}
                style={{ transitionDelay: `${200 + index * 300}ms` }}
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${item.align === 'left' ? 'translate-x-20' : '-translate-x-20'}`
                } ${item.align === 'right' ? 'lg:order-1' : ''}`}
                style={{ transitionDelay: `${400 + index * 300}ms` }}
              >
                <div className="flex items-center gap-2 text-sm text-slate-blue/70 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-4 hover:text-burgundy transition-colors duration-200 cursor-pointer">
                  {item.title}
                </h3>

                <p className="text-slate-blue/80 leading-relaxed mb-6">
                  {item.summary}
                </p>

                <a
                  href={item.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-burgundy font-medium hover:text-gold transition-all duration-300 group/link"
                >
                  阅读全文
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
