import { HashRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import News from './pages/News';
import DatabasePage from './pages/DatabasePage';
import Reports from './pages/Reports';
import TechRoutes from './pages/TechRoutes';
import CompanyDetailPage from './pages/CompanyDetailPage';
import CompanyComparePage from './pages/CompanyComparePage';
import FounderProfilePage from './pages/FounderProfilePage';

export default function App() {
  return (
    <AuthProvider>
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
            <Route path="/compare" element={<CompanyComparePage />} />
            <Route path="/founder/:id" element={<FounderProfilePage />} />
          </Routes>
          <ScrollToTop />
          <LoginModal />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
