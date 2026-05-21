import { Route, Routes } from "react-router-dom";

import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'
import Login from "../features/member/pages/Login";

export default function Section(){
  return (
    <section>section
      <Routes>
        <Route path="/myLocationSet/*" element={<MyLocationSet />} />
        <Route path="/login/*" element={<Login />}/>
        <Route path="/" />
      </Routes>
    </section>
  );
}