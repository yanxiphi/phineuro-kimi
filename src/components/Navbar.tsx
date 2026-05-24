import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Menu, X, Brain, Database, FileText, Home, Radio, Cpu, ExternalLink, ChevronDown, Globe, Server, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavLink {
  label: string;
  path: string;
  icon: React.ElementType;
  external?: boolean;
}

interface DropdownItem {
  label: string;
  path: string;
  icon: React.ElementType;
  external?: boolean;
  desc?: string;
}

const navLinks: (NavLink | { label: string; icon: React.ElementType; dropdown: DropdownItem[] })[] = [
  { label: '首页', path: '/', icon: Home },
  { label: '前沿资讯', path: '/news', icon: Radio },
  {
    label: '数据库',
    icon: Database,
    dropdown: [
      { label: '全球企业数据库', path: '/database', icon: Globe, desc: '105+ 神经科技企业全景' },
      { label: 'BCI 训练数据集', path: 'https://datasets.phineuro.life', icon: Server, external: true, desc: '25+ 核心 BCI 数据集' },
    ],
  },
  { label: '报告', path: '/reports', icon: FileText },
  { label: '技术路径', path: '/tech-routes', icon: Cpu },
];

function DesktopAuthButton() {
  const { user, isLoggedIn, showLogin, logout } = useAuth();

  if (isLoggedIn && user) {
    return (
      <div className="hidden lg:flex items-center gap-2 ml-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-burgundy/10 text-burgundy text-sm">
          <User className="w-4 h-4" />
          <span className="max-w-[80px] truncate">{user.name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            user.tier === 'pro' ? 'bg-amber-100 text-amber-700' :
            user.tier === 'registered' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {user.tier === 'pro' ? '专业' : user.tier === 'registered' ? '试用' : '基础'}
          </span>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg text-slate-blue/50 hover:text-burgundy hover:bg-burgundy/5 transition-colors"
          title="退出登录"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={showLogin}
      className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-burgundy bg-burgundy/10 hover:bg-burgundy hover:text-white transition-all ml-2"
    >
      <User className="w-4 h-4" />
      登录
    </button>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path: string, external?: boolean) => {
    if (external) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isDropdownActive = (items: DropdownItem[]) => {
    return items.some((item) => !item.external && isActive(item.path));
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
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <Brain className="w-8 h-8 text-burgundy transition-colors duration-300" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-burgundy-light rounded-full animate-pulse" />
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
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navLinks.map((link) => {
              if ('dropdown' in link) {
                const active = isDropdownActive(link.dropdown);
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                        active
                          ? 'text-burgundy bg-burgundy/10'
                          : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                      }`}
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Dropdown */}
                    <div
                      className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-elevated border border-border-light overflow-hidden transition-all duration-200 ${
                        openDropdown === link.label
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigate(item.path, item.external)}
                          className="w-full text-left px-4 py-3 hover:bg-burgundy/[0.04] transition-colors flex items-start gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-burgundy/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-burgundy/20 transition-colors">
                            <item.icon className="w-4 h-4 text-burgundy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-text-primary group-hover:text-burgundy transition-colors">
                                {item.label}
                              </span>
                              {item.external && <ExternalLink className="w-3 h-3 text-slate-blue/40" />}
                            </div>
                            <p className="text-[11px] text-slate-blue/60 mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              const active = !link.external && isActive(link.path);
              const isReports = link.path === '/reports';
              const Icon = link.icon;

              return (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path, link.external)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-burgundy bg-burgundy/10'
                      : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3 opacity-60" />}
                    {isReports && !active && (
                      <span className="w-1.5 h-1.5 bg-burgundy-light rounded-full" />
                    )}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-burgundy rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Button */}
          <DesktopAuthButton />

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
            if ('dropdown' in link) {
              const active = isDropdownActive(link.dropdown);
              const isOpen = openDropdown === link.label;
              return (
                <div key={link.label}>
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : link.label)}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-burgundy bg-burgundy/10'
                        : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigate(item.path, item.external)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-blue hover:text-burgundy hover:bg-burgundy/5 transition-all"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                          {item.external && <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active = !link.external && isActive(link.path);
            const isReports = link.path === '/reports';
            const Icon = link.icon;

            return (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path, link.external)}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-burgundy bg-burgundy/10'
                    : 'text-slate-blue hover:text-burgundy hover:bg-burgundy/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
                {link.external && <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />}
                {isReports && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] bg-burgundy/20 text-burgundy rounded-full font-semibold">
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
