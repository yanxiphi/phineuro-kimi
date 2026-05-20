import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, X, Brain, Database, FileText, Home, Radio, Cpu } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { label: '首页', path: '/', icon: Home },
  { label: '前沿资讯', path: '/news', icon: Radio },
  { label: '数据库', path: '/database', icon: Database },
  { label: '报告', path: '/reports', icon: FileText },
  { label: '技术路径', path: '/tech-routes', icon: Cpu },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream/95 backdrop-blur-md shadow-nav py-3'
          : 'bg-cream/80 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Brain className="w-8 h-8 text-burgundy transition-colors duration-300" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gold rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-serif text-xl font-bold tracking-tight text-burgundy transition-colors duration-300">
                PhiNeuro
              </span>
              <span className="text-[10px] text-slate-blue/60 tracking-widest uppercase -mt-0.5">
                Neuro神经科技前沿
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const isDatabase = link.path === '/database';
              const isReports = link.path === '/reports';
              const Icon = link.icon;

              return (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-burgundy bg-burgundy/10'
                      : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                    {(isDatabase || isReports) && !active && (
                      <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    )}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-burgundy rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-burgundy hover:bg-burgundy/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-cream/98 backdrop-blur-lg border-b border-gray-200 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const isDatabase = link.path === '/database';
            const isReports = link.path === '/reports';
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-burgundy bg-burgundy/10'
                    : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
                {(isDatabase || isReports) && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] bg-gold/20 text-gold-dark rounded-full font-semibold">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
