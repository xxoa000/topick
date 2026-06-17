import { Route, Routes, useLocation } from "react-router-dom";
import styles from "@/components/_section.module.scss";
import { FilterHomePage } from '../features/filter';
import MyLocationSet from '../features/myLocationSet/pages/MyLocationSet'

import LoginPage from "../features/member/pages/LoginPage";
import Home from "./Home";
import JoinPage from "@/features/member/pages/JoinPage";
import StorePage from "@/features/store/pages/StorePage";
import OrderPage from "@/features/order/pages/OrderPage";
import PaymentPage from "@/features/payment/pages/PaymentPage";
import MyInfoPage from "@/features/myInfo/pages/MyInfoPage";
import MenuDetailPage from "@/features/menu/pages/MenuDetailPage";
import MenuListPage from "@/features/menu/pages/MenuListPage";

export default function Section() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation
  return (
    <section className={styles.section}>
      <Routes location={backgroundLocation || location}>

        <Route path="/" element={<Home />} />
        <Route path="/filter" element={<FilterHomePage />} />
        <Route path="/member/login/*" element={<LoginPage />} />
        <Route path="/member/join/*" element={<JoinPage />} />
        {/* <Route path="/store/:storeNo/menu/:menuNo/*" element={<MenuDetailPage />}/> */}
        <Route path="/store/:storeNo/menu/list" element={<MenuListPage />} />
        <Route path="/store/:storeNo/*" element={<StorePage />} />
        <Route path="/order/*" element={<OrderPage />} />
        <Route path="/payment/*" element={<PaymentPage />} />
        <Route path="/my-info/*" element={<MyInfoPage />} />
        {!backgroundLocation && <Route path="/my-location-set/*" element={<MyLocationSet />} />}
      </Routes>
      
      {backgroundLocation && (
        <Routes>
          <Route path="/my-location-set/*" element={<MyLocationSet />} />
        </Routes>
      )}
    </section>
  );
}