import { Route, Routes } from "react-router-dom";
import {FilterHomePage } from '../features/filter';
import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'
import Login from "../features/member/pages/LoginPage";


export default function Section(){
  return (
    <section className="section-root">
      <Routes>
        <Route path="/filter" element={<FilterHomePage />}/>
        <Route path="/myLocationSet/*" element={<MyLocationSet />} />
        <Route path="/login/*" element={<Login />}/>
      </Routes>
    </section>
  );
}