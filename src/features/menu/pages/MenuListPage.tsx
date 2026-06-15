import { NavLink, useParams} from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuListPage() {
  const { storeNo } = useParams();
  const [menuList,setMenuList] = useState<MenuResponseDTO[]>([]);

  //메뉴 리스트 출력
  useEffect (() => {
    if (!storeNo) return;
    const updateList = async() => {
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
  },[storeNo]);
  


  return (
  <>
  {menuList.map((menu)=>(
    <NavLink key={menu?.menuNo} to={`/store/${storeNo}/menu/${menu?.menuNo}`}>
      <div>
        <span>{menu?.menuName}</span>
        <span>{menu?.menuPrice}</span>
      </div>
    </NavLink>
  ))}
  </>
  );
}