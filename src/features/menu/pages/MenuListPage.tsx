import { NavLink, useParams } from "react-router-dom";
import { menuApi } from "../services/menuApi";
import type { MenuResponseDTO } from "../types/menuDTO";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuListPage() {
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
      } catch (error) {
        if (!axios.isAxiosError) return;
        console.log(error);
      }
    }
    updateList();
  }, [storeNo]);



  return (

    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '25px', backgroundColor: '#fff', marginBottom: '20px' }}>

      {/* <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
        {photos.map((photo: any) => (
          <div key={photo.photo_id} style={{ flex: '0 0 150px', height: '110px', backgroundColor: '#f0f0f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#999' }}>
            <img src={photo.url} alt={photo.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
              referrerPolicy="no-referrer" />
          </div>
        ))}
      </div> */}

      <div style={{ display: 'flex', flexDirection: 'column' }}>


        {menuList.map((menu, index) => (
          <NavLink key={menu?.menuNo} to={`/store/${storeNo}/menu/${menu?.menuNo}`}>


            <div

              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 0',
                borderBottom: index === menuList?.length - 1 ? 'none' : '1px solid #eee'
              }}
            >
              {/* [왼쪽] 메뉴명 및 가격 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold', color: '#111' }}>
                    {menu?.menuName}
                  </h3>
                  <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#ec7b23' }}>
                    {menu?.menuPrice ? menu.menuPrice.toLocaleString() : '0'}
                  </span>
                </div>
                {/* 데이터 구조상 설명 필드가 잘려있으므로, 있을 때만 렌더링하거나 기본 문구 처리 */}

              </div>

              {/* [오른쪽] 부가정보 및 이미지 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: '#bbb' }}>*VAT 포함</span>
                  <span style={{
                    fontSize: '11px',
                    color: '#666',
                    border: '1px solid #e2e2e2',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer'
                  }}>
                    매장, 원산지 정보
                  </span>
                </div>

                {/* 이미지 틀 */}
                <div style={{ width: '130px', height: '90px', backgroundColor: '#f9f9f9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                  <img
                    // src={menu.img_url || menu.imageUrl || defaultMenuIcon}
                    alt={menu?.menuName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아이콘으로 대체 안전장치
                      // (e.target as HTMLImageElement).src = defaultMenuIcon;
                    }}
                  />
                </div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}