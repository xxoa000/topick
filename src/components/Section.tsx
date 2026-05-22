import { Route, Routes } from "react-router-dom";
import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'
import Login from "../features/member/pages/LoginPage";
import Home from "./Home";

export default function Section(){
  return (
    <section>section
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/myLocationSet/*" element={<MyLocationSet />} />
        <Route path="/login/*" element={<Login />}/>
      </Routes>
    </section>
  );
}