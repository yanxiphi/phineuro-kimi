import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface TopicItem {
  id: number;
  title: string;
  image: string;
  tags: string[];
  description: string;
  readTime: string;
  rotation: number;
}

const topicItems: TopicItem[] = [
  {
    id: 1,
    title: '脑机接口：连接心智与机器',
    image: '/images/topic-bci.jpg',
    tags: ['脑机接口', '神经科技', '前沿'],
    description: '从Neuralink到Synchron，探索脑机接口技术的最新突破与伦理边界。',
    readTime: '15分钟',
    rotation: -2,
  },
  {
    id: 2,
    title: '认知科学：意识的神经基础',
    image: '/images/topic-cognition.jpg',
    tags: ['认知科学', '意识研究', '哲学'],
    description: '追问意识的本质：神经活动如何产生主观体验？',
    readTime: '20分钟',
    rotation: 1,
  },
  {
    id: 3,
    title: 'AI伦理：当机器拥有意识',
    image: '/images/topic-ai-ethics.jpg',
    tags: ['AI伦理', '人工智能', '哲学'],
    description: '探讨人工智能的道德地位与认知权利问题。',
    readTime: '18分钟',
    rotation: -1,
  },
  {
    id: 4,
    title: '神经科技投资：下一个风口',
    image: '/images/topic-investment.jpg',
    tags: ['投资', '商业', '趋势'],
    description: '神经科技领域的投资机会与商业趋势分析。',
    readTime: '12分钟',
    rotation: 2,
  },
];

export default function FeaturedData() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="topics"
      ref={sectionRef}
      className="py-24 bg-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2
              className={`font-serif text-3xl sm:text-4xl font-bold text-burgundy mb-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              深度专题
            </h2>
            <p
              className={`text-slate-blue transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              神经科学 × 哲学的交叉视角
            </p>
          </div>
          <a
            href="#"
            className={`inline-flex items-center gap-2 text-burgundy font-medium hover:text-gold transition-all duration-300 group ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            查看全部专题
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topicItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionDelay: `${300 + index * 120}ms`,
                transform: isVisible ? `rotate(${item.rotation}deg)` : `rotate(${item.rotation}deg) translateY(80px)`,
              }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-burgundy/10 text-burgundy rounded-md transition-colors duration-200 hover:bg-burgundy hover:text-white cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-burgundy transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-blue/80 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-slate-blue/60">
                      <Clock className="w-4 h-4" />
                      <span>{item.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gold">
                      <BookOpen className="w-4 h-4" />
                      <span>深度</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
