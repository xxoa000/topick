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
  );
}