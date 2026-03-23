import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import FeaturedData from './components/FeaturedData';
import News from './components/News';
import Articles from './components/Articles';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FeaturedData />
        <News />
        <Articles />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
