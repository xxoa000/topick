import { publicApiClient } from "@/config/axios";
import type { MenuResponseDTO } from "../types/menuDTO";

  export const menuApi = {

    //메뉴 리스트
    selectList: async(storeNo:number) => {
      const response = await publicApiClient.get<MenuResponseDTO[]> (
        `/store/${storeNo}/menu`
      );
      return response.data;
    },

    //메뉴 상세
    selectOne: async(storeNo:number, menuNo:number) => {
      const response = await publicApiClient.get<MenuResponseDTO> (
        `/store/${storeNo}/menu/${menuNo}`
      );
      return response.data;
    }

  } //menuApi