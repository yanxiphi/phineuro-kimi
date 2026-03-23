import { useState, useEffect } from 'react';
import { Search, Menu, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: '首页', href: '#hero' },
  { name: '专题', href: '#topics' },
  { name: '新闻', href: '#news' },
  { name: '周刊', href: '#articles' },
  { name: '订阅', href: '#cta' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-expo-out ${
        isScrolled
          ? 'glass shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-burgundy flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className={`flex flex-col transition-colors duration-300 ${
              isScrolled ? 'text-burgundy' : 'text-white'
            }`}>
              <span className="font-serif font-bold text-lg leading-tight">PhiNeuro</span>
              <span className="text-xs opacity-70">Phi的神经观</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`relative text-sm font-medium transition-colors duration-200 link-underline ${
                  isScrolled
                    ? 'text-slate-blue hover:text-burgundy'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className={`p-2 rounded-full transition-all duration-200 ${
                isScrolled
                  ? 'text-slate-blue hover:bg-burgundy/10 hover:text-burgundy'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <Button
              variant={isScrolled ? 'default' : 'outline'}
              className={`transition-all duration-300 ${
                isScrolled
                  ? 'bg-burgundy hover:bg-burgundy/90 text-white'
                  : 'border-white/50 text-white hover:bg-white/10 hover:border-white'
              }`}
            >
              订阅周刊
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-burgundy' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-burgundy' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass shadow-lg transition-all duration-300 ease-expo-out ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="block text-slate-blue hover:text-burgundy font-medium py-2 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-gray-200">
            <Button className="w-full bg-burgundy hover:bg-burgundy/90 text-white">
              订阅周刊
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
