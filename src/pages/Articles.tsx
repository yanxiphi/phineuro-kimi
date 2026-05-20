import { useState } from 'react';
import { Newspaper, Clock, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: '脑机接口：连接心智与机器',
    excerpt: '从Neuralink到Synchron，探索脑机接口技术的最新突破与伦理边界。脑机接口正从实验室走向临床应用，为瘫痪患者带来希望，同时也引发了关于隐私和身份认同的深层思考。',
    date: '2025-05-15',
    category: '脑机接口',
    tags: ['神经科技', '前沿'],
    readTime: '15分钟',
  },
  {
    id: 2,
    title: '认知科学：意识的神经基础',
    excerpt: '追问意识的本质：神经活动如何产生主观体验？整合信息理论（IIT）与全局工作空间理论（GWT）的争论持续升温，而最新的实验证据正逐渐揭开意识的神秘面纱。',
    date: '2025-05-10',
    category: '认知科学',
    tags: ['意识研究', '哲学'],
    readTime: '20分钟',
  },
  {
    id: 3,
    title: 'AI伦理：当机器拥有意识',
    excerpt: '探讨人工智能的道德地位与认知权利问题。随着大语言模型展现出越来越强的"理解"能力，我们不得不面对一个根本性问题：机器能否拥有意识？如果可能，我们应如何对待它们？',
    date: '2025-05-05',
    category: 'AI伦理',
    tags: ['人工智能', '哲学'],
    readTime: '18分钟',
  },
  {
    id: 4,
    title: '神经科技投资：下一个风口',
    excerpt: '神经科技领域的投资机会与商业趋势分析。从脑机接口到神经调控，从药物研发到认知增强，神经科技正成为资本市场关注的新热点。',
    date: '2025-04-28',
    category: '投资',
    tags: ['商业', '趋势'],
    readTime: '12分钟',
  },
  {
    id: 5,
    title: '神经退行性疾病：2025年治疗进展',
    excerpt: '阿尔茨海默病、帕金森病的最新治疗突破，从抗淀粉样蛋白到基因疗法。2025年注定是神经退行性疾病治疗领域的转折之年。',
    date: '2025-04-20',
    category: '医学',
    tags: ['神经疾病', '治疗'],
    readTime: '15分钟',
  },
  {
    id: 6,
    title: '意识的整合信息理论：IIT深度解析',
    excerpt: 'Tononi的整合信息理论如何量化意识，以及它在AI意识检测中的应用前景。IIT提供了一个数学框架来度量意识，但其核心假设仍面临诸多挑战。',
    date: '2025-04-15',
    category: '认知科学',
    tags: ['意识研究', '理论'],
    readTime: '18分钟',
  },
];

export default function Articles() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = ['全部', ...new Set(articles.map(a => a.category))];

  const filteredArticles = selectedCategory === '全部'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

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
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-burgundy/10">
              <Newspaper className="w-5 h-5 text-burgundy" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-burgundy">文章</h1>
              <p className="text-sm text-slate-blue/60">神经科学 × 哲学的交叉视角</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-slate-blue border border-gray-200 hover:border-burgundy/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="group bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 hover:shadow-card-hover hover:border-burgundy/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-burgundy/10 text-burgundy text-xs font-medium">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
                <span className="text-xs text-slate-blue/50">{article.date}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-burgundy mb-3 group-hover:text-burgundy-light transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-slate-blue/70 leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-blue/50">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex gap-1.5">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-100 text-slate-blue/60 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-16 text-center">
            <Newspaper className="w-12 h-12 text-slate-blue/20 mx-auto mb-4" />
            <p className="text-slate-blue/50">该分类下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
