import OrderForm from "@/features/order/components/OrderForm";
import MenuDetailForm from "../components/MenuDetailForm";
import styles from "@/features/menu/pages/_menuDetailPage.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import type { OrderCreateRequestDTO } from "@/features/order/types/orderDTO";
import MenuListPage from "./MenuListPage";


export default function MenuDetailPage() {





  return (
  
  <main className={styles.page}>
    <section className={styles.left}>
      <MenuDetailForm />
    </section>
    <aside className={styles.right}>
      <OrderForm />
    </aside>
  </main>
  );
}