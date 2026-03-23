import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Neural Network Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy/90 via-burgundy/70 to-transparent" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-40 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Tag */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-white/90 font-medium">神经科学 × 哲学</span>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1
                className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                探索认知边界
              </h1>
              <p
                className={`text-xl sm:text-2xl text-gold font-serif italic transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                Exploring the Boundaries of Cognition
              </p>
            </div>

            {/* Brand Story */}
            <p
              className={`text-lg text-white/80 max-w-xl leading-relaxed transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '700ms' }}
            >
              在认知革命的前夜，我们追踪最前沿的脑科学，追问最深层的认知问题——在这个奇点时刻，理解人之所以为人的边界。
            </p>

            {/* Differentiators */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '900ms' }}
            >
              {['跨学科深度', '8年药企经验', '新中双视角'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm border border-white/20"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '1100ms' }}
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-burgundy font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                订阅Weekly周刊
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 hover:border-white px-8 py-6 rounded-xl transition-all duration-300"
              >
                了解PhiNeuro
              </Button>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="hidden lg:block relative h-[500px]">
            {/* Card 1 - BCI */}
            <div
              className={`absolute top-0 right-0 w-72 rounded-2xl overflow-hidden shadow-2xl transition-all duration-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDelay: '600ms',
                transform: isVisible ? 'perspective(1000px) rotateY(-5deg) translateZ(0)' : 'perspective(1000px) rotateY(-90deg)',
              }}
            >
              <img
                src="/images/topic-bci.jpg"
                alt="Brain-Computer Interface"
                className="w-full h-auto"
              />
            </div>

            {/* Card 2 - Cognition */}
            <div
              className={`absolute top-24 right-32 w-64 rounded-2xl overflow-hidden shadow-2xl transition-all duration-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDelay: '750ms',
                transform: isVisible ? 'perspective(1000px) rotateY(5deg) translateZ(40px)' : 'perspective(1000px) rotateY(-90deg)',
                animation: isVisible ? 'float 7s ease-in-out infinite 2s' : 'none',
              }}
            >
              <img
                src="/images/topic-cognition.jpg"
                alt="Cognitive Science"
                className="w-full h-auto"
              />
            </div>

            {/* Card 3 - AI Ethics */}
            <div
              className={`absolute bottom-0 right-16 w-60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-800 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDelay: '900ms',
                transform: isVisible ? 'perspective(1000px) rotateY(-3deg) translateZ(80px)' : 'perspective(1000px) rotateY(-90deg)',
                animation: isVisible ? 'float 8s ease-in-out infinite 4s' : 'none',
              }}
            >
              <img
                src="/images/topic-ai-ethics.jpg"
                alt="AI Ethics"
                className="w-full h-auto"
              />
            </div>

            {/* Decorative Elements */}
            <Brain
              className={`absolute top-10 right-10 w-8 h-8 text-gold transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{ transitionDelay: '1000ms' }}
            />
            <Sparkles
              className={`absolute bottom-32 right-48 w-6 h-6 text-gold/70 transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{ transitionDelay: '1100ms' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
