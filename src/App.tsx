// src/App.tsx
import './App.css';
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
    <div className="app-container">
      <TopBanner />
      <Header />
      <Section />
      <Footer />
    </div>
    </>
  );
}

