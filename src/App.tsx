import { HashRouter, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Articles from './pages/Articles';
import DatabasePage from './pages/DatabasePage';
import Reports from './pages/Reports';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
        <ScrollToTop />
      </div>
    </HashRouter>
  );
}
