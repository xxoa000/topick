import { NavLink, useParams } from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from './_menu-list-page.module.scss'; // SCSS 파일 임포트

export default function MenuListPage({ photos }: { photos: { photo_id: number; url: string; title?: string }[] }) {
  const { storeNo } = useParams();
  const [menuList, setMenuList] = useState<MenuResponseDTO[]>([]);

  //메뉴 리스트 출력
  useEffect(() => {
    if (!storeNo) return;
    const updateList = async () => {
      try {
        const data = await menuApi.selectList(Number(storeNo));
        console.log(data);
        setMenuList(data);
      } catch(error) {
        if (!axios.isAxiosError(error)) return;
        console.log(error);
      }
    }
    updateList();
  }, [storeNo]);

  return (

  <div className={styles.menuContainer}>
    {photos && photos.length > 0 && (
      <div className={styles.photoSection}>
        <h2 className={styles.photoTitle}>메뉴판 사진</h2>
        <div className={styles.photoWrapper}>
          {photos.map((photo: any) => (
            <div key={photo.photo_id} className={styles.photoItem}>
              <img src={photo.url} alt={photo.title || "메뉴 사진"} referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>
    )}

    <div className={styles.menuListWrapper}>
      {menuList.map((menu, index) => (
        <NavLink key={menu?.menuNo} to={`/store/${storeNo}/menu/${menu?.menuNo}`} className={styles.menuLink}>
          <div className={styles.menuItem} style={{borderBottom: index === menuList?.length - 1 ? 'none' : '1px solid #eee'

              }}>
            <div className={styles.menuInfo}>
              <div className={styles.header}>
                <h3 className={styles.name}>{menu?.menuName}</h3>
                <span className={styles.price}>
                  {menu?.menuPrice ? menu.menuPrice.toLocaleString() : '0'}
                </span>
              </div>
            </div>
              
            <div className={styles.menuActions}>
              <div className={styles.metaInfo}>
                <span className={styles.vatText}>*VAT 포함</span>
                <span className={styles.badge}>매장, 원산지 정보</span>
              </div>
              <div className={styles.imageContainer}>
                <img src={menu?.menuImage} alt={menu?.menuName} referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  </div>
);
}