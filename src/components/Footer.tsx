import { useEffect, useRef, useState } from 'react';
import { Brain, MessageCircle, Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const quickLinks = [
  { name: '首页', href: '#hero' },
  { name: '深度专题', href: '#topics' },
  { name: '最新动态', href: '#news' },
  { name: 'Weekly周刊', href: '#articles' },
  { name: '订阅', href: '#cta' },
];

const resources = [
  { name: '关于PhiNeuro', href: '#' },
  { name: '商务合作', href: '#' },
  { name: '咨询预约', href: '#' },
  { name: '内容存档', href: '#' },
];

const socialLinks = [
  { name: '小红书', handle: 'Phi的神经观', href: '#' },
  { name: '公众号', handle: 'Neuro神经科学前沿', href: '#' },
  { name: 'X', handle: '@PhiNeuro', href: '#' },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const footerRef = useRef<HTMLElement>(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="bg-burgundy text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-gold" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg block">PhiNeuro</span>
                <span className="text-xs text-white/60">Phi的神经观</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              在认知革命的前夜，我们追踪最前沿的脑科学，追问最深层的认知问题。
            </p>
            <div className="space-y-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{social.name}: {social.handle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="font-semibold text-lg mb-4">导航</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <h3 className="font-semibold text-lg mb-4">资源</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <h3 className="font-semibold text-lg mb-4">订阅Weekly周刊</h3>
            <p className="text-white/70 text-sm mb-4">
              每周一发送，追踪神经科学前沿。
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail('');
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="您的邮箱"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-gold"
                />
              </div>
              <Button
                type="submit"
                className="bg-gold hover:bg-gold/90 text-burgundy px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t border-white/10 mt-12 pt-8 transition-all duration-800 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: '500ms', transformOrigin: 'left' }}
        />

        {/* Bottom */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '700ms' }}
        >
          <p className="text-white/60 text-sm">
            © 2024 PhiNeuro. 探索认知边界.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              服务条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
