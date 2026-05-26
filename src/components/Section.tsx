import { Route, Routes } from "react-router-dom";
import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'
import LoginPage from "../features/member/pages/LoginPage";
import Home from "./Home";
import JoinPage from "@/features/member/pages/JoinPage";
import StorePage from "@/features/store/pages/StorePage";
import OrderPage from "@/features/order/pages/OrderPage";
import PaymentPage from "@/features/payment/pages/PaymentPage";
import MyInfoPage from "@/features/myInfo/pages/MyInfoPage";

export default function Section(){
  return (
    <section>section
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/my-location-set/*" element={<MyLocationSet />} />
        <Route path="/member/login/*" element={<LoginPage />}/>
        <Route path="/member/join/*" element={<JoinPage />}/>
        <Route path="/store/*" element={<StorePage />}/>
        <Route path="/order/*" element={<OrderPage />}/>
        <Route path="/payment/*" element={<PaymentPage />}/>
        <Route path="/my-info/*" element={<MyInfoPage />}/>
      </Routes>
    </section>
  );
}