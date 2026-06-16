import OrderForm from "@/features/order/components/OrderForm";
import MenuDetailForm from "../components/MenuDetailForm";
import styles from "@/features/menu/pages/_menuDetailPage.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import type { OrderCreateRequestDTO } from "@/features/order/types/orderDTO";


export default function MenuDetailPage() {

  const methods = useForm<OrderCreateRequestDTO>({
    defaultValues: {
      orderListVisitType: "visit",
      orderListRequest: "",
      detailList: []
    }
  });



  return (
  <FormProvider {...methods}>
  <main className={styles.page}>
    <section className={styles.left}>
      <MenuDetailForm />
    </section>
    <aside className={styles.right}>
      <OrderForm />
    </aside>
  </main>
  </FormProvider>
  );
}