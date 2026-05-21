import { Route, Routes } from "react-router-dom";

import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'

export default function Section(){
  return (
    <>
      <table border={1}>

        <div>section</div>
        <Routes>
          <Route path="/myLocationSet/*" element={<MyLocationSet />} />
          <Route path="/login/*" />
          <Route path="/" />

        </Routes>

      </table>
    </>

  )
}