// src/App.tsx
import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Section from './components/Section'
import Footer from './components/Footer'


import './App.css'

export default function App() {
  return (
    <>
      <Routes>
        {/* 기본 메인 레이아웃 */}
        <Route
          path="*" //정의되지 않은 경로를 포함하여 모든 주소에 대해 반응
          element={
            <div className="app-container">
              <TopBanner />
              <Header />
              <Section />
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}

