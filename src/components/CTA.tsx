import { useEffect, useRef, useState } from 'react';
import { Check, Send, Sparkles, Diamond, Circle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socialLinks = [
  { name: '小红书', handle: 'Phi的神经观', icon: MessageCircle, color: 'bg-red-500' },
  { name: '公众号', handle: 'Neuro神经科学前沿', icon: MessageCircle, color: 'bg-green-500' },
  { name: 'X', handle: '@PhiNeuro', icon: MessageCircle, color: 'bg-slate-800' },
];

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative py-24 bg-slate-blue overflow-hidden"
    >
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Diamond
          className={`absolute top-16 left-16 w-8 h-8 text-gold/30 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transitionDelay: '200ms', animation: isVisible ? 'float 6s ease-in-out infinite' : 'none' }}
        />
        <Circle
          className={`absolute top-24 right-24 w-6 h-6 text-white/20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transitionDelay: '300ms', animation: isVisible ? 'float-slow 8s ease-in-out infinite 1s' : 'none' }}
        />
        <Sparkles
          className={`absolute bottom-20 left-20 w-10 h-10 text-gold/20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transitionDelay: '400ms', animation: isVisible ? 'float 7s ease-in-out infinite 2s' : 'none' }}
        />
        <Diamond
          className={`absolute bottom-16 right-16 w-8 h-8 text-white/10 rotate-45 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transitionDelay: '500ms', animation: isVisible ? 'float-slow 9s ease-in-out infinite 0.5s' : 'none' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`font-serif text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            加入PhiNeuro社区
          </h2>
          <p
            className={`text-white/80 text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            订阅Weekly周刊，获取神经科学前沿解读
          </p>
        </div>

        {/* Email Form */}
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div className="flex-1 relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入您的邮箱"
              className="w-full px-5 py-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all"
              disabled={isSubmitted}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitted}
            className={`px-8 py-6 rounded-xl font-semibold transition-all duration-300 ${
              isSubmitted
                ? 'bg-green-500 hover:bg-green-500'
                : 'bg-gold hover:bg-gold/90 text-burgundy animate-pulse-glow'
            }`}
          >
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                已订阅
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                订阅
              </>
            )}
          </Button>
        </form>

        {/* Social Links */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '750ms' }}
        >
          <p className="text-center text-white/60 text-sm mb-6">或关注我们的社交媒体</p>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className={`w-8 h-8 rounded-lg ${social.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{social.name}</p>
                    <p className="text-white/60 text-xs">{social.handle}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Trust Points */}
        <div
          className={`flex flex-wrap justify-center gap-6 mt-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          {['免费订阅', '随时取消', '每周更新'].map((point) => (
            <div key={point} className="flex items-center gap-2 text-white/70">
              <Check className="w-5 h-5 text-gold" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
