import { publicApiClient } from "@/config/axios";
import type { MenuResponseDTO } from "../types/menuDTO";

  export const menuApi = {

    selectList: async(storeNo:number) => {
      const response = await publicApiClient.get<MenuResponseDTO[]> (
        `/store/${storeNo}/menu`
      );
      return response.data;
    },

    selectOne: async(storeNo:number, menuNo:number) => {
      const response = await publicApiClient.get<MenuResponseDTO> (
        `/store/${storeNo}/menu/${menuNo}`
      );
      return response.data;
    }

  } //menuApi