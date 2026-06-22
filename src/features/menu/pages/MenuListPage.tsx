import { useParams } from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import { useEffect, useState } from "react";
import axios from "axios";
import s from "./_menu-list-page.module.scss";
import { FormProvider, useForm } from "react-hook-form";
import type { OrderCreateRequestDTO } from "@/features/order/types/orderDTO";
import OrderForm from "@/features/order/components/OrderForm";
import MenuDetailForm from "../components/MenuDetailForm";


type Photo = {
  photo_id: number;
  url: string;
  title?: string;
};

type MenuListPageProps = {
  photos?: Photo[];
};


export default function MenuListPage({ photos = [] }: MenuListPageProps) {
  // 추후 옵션 용으로 쓸 예정
  //const [openMenuNo, setOpenMenuNo] = useState<number | null>(null);
  const { storeNo } = useParams();
  const [menuList, setMenuList] = useState<MenuResponseDTO[]>([]);

  // 주문용 기본 값 설정
  const methods = useForm<OrderCreateRequestDTO>({
    defaultValues: {
      orderListVisitType: "visit",
      orderListRequest: "",
      detailList: []
    }
  });

  useEffect(() => {
    if (!storeNo) return;
    const updateList = async () => {
      try {
        const data = await menuApi.selectList(Number(storeNo));
        console.log("menuList data:", data);
        console.log("menuNo 목록:", data.map((m) => m.menuNo));
        setMenuList(data);
      } catch (error) {
        if (!axios.isAxiosError(error)) return;
        console.log(error);
      }
    };
    updateList();
  }, [storeNo]);

  return (
    <main className={s.menuContainer}>
      <article className={s.photoSection}>
        <h2 className={s.photoTitle}>메뉴</h2>
        {photos && photos.length > 0 && (
          <div className={s.photoWrapper}>
            {photos.map((photo) => (
              <div key={photo.photo_id} className={s.photoItem}>
                <img src={photo.url} alt={photo.title || "메뉴 사진"} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        )}
      </article>

      <FormProvider {...methods}>
        <section className={s.page}>
          <section className={s.left}>
            {menuList.map((menu, index) => (
              <div key={menu.menuNo} className={s.menuItem}
                  style={{ borderBottom: index === menuList.length - 1 ? "none" : "1px solid #eee" }}
                // onClick={() => setOpenMenuNo(prev => prev === menu.menuNo ? null : menu.menuNo)}
                >
                  <MenuDetailForm menu={menu} />
                  {/* 추후 메뉴 옵션 선택용 */}
                  {/* {openMenuNo === menu.menuNo && <MenuOptionForm menu={menu} />} */}
              </div>
            ))}
          </section>
          {/* 주문 폼 */}
          <aside className={s.right}>
            <OrderForm />
          </aside>
        </section>

        
      </FormProvider>
    </main>
  );
}






