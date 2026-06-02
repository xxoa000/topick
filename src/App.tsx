<<<<<<< HEAD
// src/App.tsx
import './App.scss';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import { FilterSearchProvider } from './features/filter/context/FilterSearchContext';

export default function App() {
  return (
    <FilterSearchProvider>
      <div className="app-container">
        <TopBanner />
        <Header />
        <Section />
        <Footer />
      </div>
    </FilterSearchProvider>
=======
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'
import "@/App.scss";

export default function App() {
  return (
    <>
    <div className="appContainer">
      <TopBanner />
      <Header />
      <Section />
      <Footer />
    </div>
    </>
>>>>>>> bad76a465ef2fe50cbd3a193dd761eaf6e4f6a3c
  );
}
