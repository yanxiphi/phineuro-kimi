import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-burgundy hover:bg-burgundy-dark text-white shadow-gold-glow flex items-center justify-center transition-all duration-300 ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-80 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
