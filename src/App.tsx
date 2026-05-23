import { HashRouter, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import News from './pages/News';
import DatabasePage from './pages/DatabasePage';
import Reports from './pages/Reports';
import TechRoutes from './pages/TechRoutes';
import CompanyDetailPage from './pages/CompanyDetailPage';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tech-routes" element={<TechRoutes />} />
          <Route path="/company/:id" element={<CompanyDetailPage />} />
        </Routes>
        <ScrollToTop />
      </div>
    </HashRouter>
  );
}
