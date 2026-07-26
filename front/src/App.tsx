import '@/App.scss';
import TopBanner from '@/components/TopBanner';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Footer from '@/components/Footer';
import { FilterSearchProvider } from '@/features/filter/context/FilterSearchContext';

export default function App() {
  return (
    <FilterSearchProvider>
      <div className="appContainer">
        <TopBanner />
        <Header />
        <Section />
        <Footer />
      </div>
    </FilterSearchProvider>
  );
}