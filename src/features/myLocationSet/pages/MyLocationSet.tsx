import React, { useEffect, useRef } from 'react';
import { useState } from 'react';

import DaumPostcode, { type Address } from 'react-daum-postcode';

import { apiCall } from '../services/apiService'; // 기존 apiCall 임포트
import { getCoordsByAddress } from '../services/coordsByAddress';
import { useNavigate } from 'react-router-dom';

const MyLocationSet = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState<string>(''); // 선택된 주소 상태
  const [addressData, setAddressData] = useState<Address | null>(null); // 서버 전송용 원본 데이터 객체
  const [addressName, setAddressName] = useState<string>(''); // 별칭 상태
  const [addressDetail, setAddressDetail] = useState<string>(''); // 상세주소 상태

  const memberIsLogin = sessionStorage.getItem("memberIsLogin");
	const member = memberIsLogin ? JSON.parse(memberIsLogin) : null;
  const isLogin = member !== null;

  // 지도를 담을 DOM 참조와 선택된 임시 좌표 상태
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleClose = () => {
    navigate(-1); // 브라우저 뒤로가기 실행 (모달 닫힘 효과)
  };

  // 우편번호 검색 완료 처리 (Step 3 -> Step 2)
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(data); // 콘솔에서 전체 데이터 구조 확인 가능 
    setAddress(fullAddress);
    setAddressData(data); // 서버로 보낼 원본 객체 저장 
    setAddressName(data.buildingName || "현재 위치");
    setStep(2);

  };

  // 자바(서버)로 데이터를 보내는 함수
  const sendToServer = async () => {
    if (!addressData) {
      alert("주소를 먼저 검색해주세요.");
      return;
    }

    try {
      const coords = await getCoordsByAddress(addressData.roadAddress);
      console.log("coords");
      console.log(coords);
      if (!coords) {
        alert("좌표를 변환할 수 없는 주소입니다.");
        return;
      }
      const requestData = {
        memberId: member.memberId, // 실제 서비스라면 로그인된 ID 등을 넣으세요.
        addressPostcode: addressData.zonecode,
        addressRoad: addressData.roadAddress,
        addressLot: addressData.jibunAddress,
        addressDetail: addressDetail, // 필요 시 input 추가
        addressName: addressName || "내 위치", //필요 시 input 추가
        addressX: coords.x,
        addressY: coords.y
      };

      console.log("서버로 보내는 데이터: ", requestData);

      const url = '/api/myLocationSet/join'; // 자바 컨트롤러 매핑 주소

      apiCall(url, 'POST', requestData, null)
        .then((response) => {
          alert("서버에 주소가 성공적으로 저장되었습니다");
          console.log(response);
          // navigate("/");
        })
        .catch((err) => {
          console.error("전송 에러:", err);
          alert(`저장 실패: ${err}`);
        });
    } catch (err) {
      console.error("좌표 변환 중 오류:", err);
    }
  };

  // ★ Step 4 진입 시 카카오 지도 초기화 및 GPS 호출 로직
  useEffect(() => {
    if (step !== 4 || !mapContainerRef.current) return; //step이 4가 아니거나 not null(not false) 

    const { kakao } = window as any; // const kakao = (window as any).kakao;
    if (!kakao || !kakao.maps) {
      alert("카카오 맵 라이브러리가 로드되지 않았습니다.");
      return;
    }

    // 기본 좌표 (GPS 차단 시 사용할 기본값: 미금역)
    let defaultLat = 37.3500951835995;
    let defaultLng = 127.108932846326;

    const initMap = (latitude: number, longitude: number, myLevel: number) => {
      const options = {
        center: new kakao.maps.LatLng(latitude, longitude), //지도의 중심점
        level: myLevel, // 확대/축소 수준
      };
      const map = new kakao.maps.Map(mapContainerRef.current, options); //그려질 div, 옵션

      // 마커 생성 및 표시
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
      });
      marker.setMap(map);
      setTempCoords({ lat: latitude, lng: longitude });

      // 지도 클릭 시 마커 이동 및 좌표 업데이트 이벤트
      kakao.maps.event.addListener(map, 'center_changed', () => {
        const center = map.getCenter();
        marker.setPosition(center);
        setTempCoords({ lat: center.getLat(), lng: center.getLng() });
      });
    };

    // 브라우저 Geolocation API로 현재 위치 가져오기
    if (navigator.geolocation) { //브라우저 위치정보 API 존재 여부
      navigator.geolocation.getCurrentPosition( //위치권한 허용 || 위치가 받아진 경우
        (position) => {
          initMap(position.coords.latitude, position.coords.longitude, 3);
        },
        () => { //위치권한 거부 || 위치를 불러올 수 없는 경우
          alert("현재 위치(GPS)를 가져올 수 없어 기본 위치로 표시합니다.");
          initMap(defaultLat, defaultLng, 3);
        }
      );
    } else {
      initMap(defaultLat, defaultLng, 3); 
    }
  }, [step]);

  // ★ 지도에서 선택한 좌표를 텍스트 주소로 변환하여 등록 폼(Step 2)으로 복귀하는 함수
  const handleConfirmCurrentLocation = () => {
    if (!tempCoords) return;

    const { kakao } = window as any;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2Address(tempCoords.lng, tempCoords.lat, (result: any, status: any) => { //요청값 / () 응답값
      if (status === kakao.maps.services.Status.OK) {
        const addrInfo = result[0];

        // 1. 필요한 데이터 추출 (도로명 주소 존재 여부에 따른 안전한 추출)
        const roadAddress = addrInfo.road_address ? addrInfo.road_address.address_name : '';
        const jibunAddress = addrInfo.address ? addrInfo.address.address_name : '';
        const zonecode = addrInfo.road_address ? addrInfo.road_address.zone_no : '';
        const buildingName = addrInfo.road_address ? addrInfo.road_address.building_name : '';
        const bname = addrInfo.address ? addrInfo.address.region_3depth_name : ''; // 법정동 명칭

        // 2. UI 표시용 전체 주소 문자열 (도로명 우선, 없으면 지번)
        const displayAddress = roadAddress || jibunAddress;

        // 3. 상태 업데이트 - 기존 코드의 sendToServer 및 UI와 호환되도록 구성
        setAddress(displayAddress);

        // ★ 핵심: Address 타입 객체 구조 모방 (sendToServer에서 사용하는 필드 위주)
        setAddressData({
          zonecode: zonecode || '00000',      // 우편번호
          roadAddress: roadAddress || jibunAddress, // 도로명 주소 (없으면 지번으로 대체)
          jibunAddress: jibunAddress,        // 지번 주소
          address: displayAddress,           // 기본 주소 필드
          buildingName: buildingName || '',  // 건물명
          bname: bname || '',                // 법정동
          addressType: addrInfo.road_address ? 'R' : 'J' // 도로명(R) 또는 지번(J) 타입 구분
        } as Address);

        // 4. 별칭 설정 (건물명이 있으면 건물명, 없으면 '현재 위치')
        setAddressName(buildingName || '현재 위치');
        
        setStep(2);
      } else {
        alert("선택하신 지점의 주소를 변환할 수 없습니다.");
      }
    });
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>

        {/* [화면 1] 나의 배송주소록 목록 */}
        {step === 1 && (
          <>
            <div style={modalHeaderStyle}>
              <div style={headerTitleStyle}>내 위치 설정</div>
              <button onClick={handleClose} style={closeBtnStyle}>✕</button>
            </div>

            <div style={modalBodyStyle}>
              <button onClick={() => setStep(2)} style={addAddressBtnStyle}>
                + 위치 추가하기
              </button>

              {/* 고정 크기 내부에서 가운데 정렬되도록 flex 적용 */}
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>📍</div>
                <p style={emptyTextStyle}>사용 가능한 위치가 없습니다.</p>
                <p style={emptySubTextStyle}>위치 추가하기를 눌러<br />주소를 입력해주세요!</p>
              </div>
            </div>
          </>
        )}

        {/* [화면 2] 데이터 추가하기 입력 폼 */}
        {step === 2 && (
          <>
            <div style={modalHeaderStyle}>
              <button onClick={() => setStep(1)} style={backBtnStyle}>＜</button>
              <div style={headerTitleStyle}>위치 추가하기</div>
              <button onClick={handleClose} style={closeBtnStyle}>✕</button>
            </div>

            {/* 내용이 많아도 모달 크기는 고정되고 이 영역만 스크롤됩니다 */}
            <div style={modalBodyStyle}>
              <div style={{ flex: 1 }}>

                {/* 별칭 지정 */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>별칭 지정</label>
                  <input type="text" placeholder="주소 별칭" style={{ ...inputStyle, marginBottom: '8px' }}
                    value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                </div>

                {/* 주소 */}
                <div style={formGroupStyle}>
                  <label style={labelStyle}>주소</label>
                  <div style={searchBarContainerStyle} onClick={() => setStep(3)}>
                    <span style={{ color: '#aaa', marginRight: '6px' }}>🔍</span>
                    <input
                      type="text"
                      placeholder="우편번호 찾기"
                      value={address ? `[${addressData?.zonecode}] ${address}` : ''}
                      readOnly
                      style={searchBarInputStyle}
                    />
                  </div>
                  <br />
                  <button onClick={() => setStep(4)} style={addAddressBtnStyle}>
                    + 현재 위치로 찾기
                  </button>

                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>상세주소</label>
                  <input type="text" placeholder="상세주소 (50자까지 입력 가능)" style={inputStyle} 
                    value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)}/>
                </div>
              </div>

              {/* 하단 버튼 블록을 바닥에 고정 */}
              <div style={buttonGroupStyle}>
                <button onClick={() => setStep(1)} style={cancelBtnStyle}>취소하기</button>
                <button onClick={sendToServer} style={saveBtnStyle}>저장하기</button>
              </div>
            </div>
          </>
        )}

        {/* [화면 3] 주소찾기 (다음 API 실행 화면) */}
        {step === 3 && (
          <>
            <div style={modalHeaderStyle}>
              <button onClick={() => setStep(2)} style={backBtnStyle}>＜</button>
              <div style={headerTitleStyle}>주소찾기</div>
              <button onClick={handleClose} style={closeBtnStyle}>✕</button>
            </div>
            {/* DaumPostcode가 고정된 바디 높이를 100% 채우도록 설정 */}
            <div style={{ ...modalBodyStyle, overflow: 'hidden' }}>
            <DaumPostcode onComplete={handleComplete} style={{ height: '100%', width: '100%' }} />
          </div>
          </>
        )}

        {/* [화면 4] 현재 위치로 찾기 (카카오 지도 화면) */}
        {step === 4 && (
          <>
            <div style={modalHeaderStyle}>
              <button onClick={() => setStep(2)} style={backBtnStyle}>＜</button>
              <div style={headerTitleStyle}>현재 위치 찾기</div>
              <button onClick={handleClose} style={closeBtnStyle}>✕</button>
            </div>
            
            <div style={{ ...modalBodyStyle, overflow: 'hidden', position: 'relative' }}>
              {/* 실제 카카오 지도가 그려지는 영역 */}
              <div ref={mapContainerRef} style={{ width: '100%', height: '82%', borderRadius: '8px' }}></div>
              
              {/* 지도 선택 완료 버튼 배치 */}
              <div style={{ ...buttonGroupStyle, marginTop: '12px' }}>
                <button onClick={handleConfirmCurrentLocation} style={saveBtnStyle}>
                  이 위치로 주소 설정
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
};

// ★ 가로(maxWidth: 450px)와 세로(height: 620px)를 고정하고 Flex 구조 채택
const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '20px', borderRadius: '16px',
  width: '90%', maxWidth: '450px', height: '620px',
  display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  position: 'relative', paddingBottom: '15px', borderBottom: '1px solid #f1f3f5',
  height: '30px', flexShrink: 0
};

const backBtnStyle: React.CSSProperties = {
  position: 'absolute', left: 0, border: 'none', background: 'none',
  fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', color: '#555',
  padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const headerTitleStyle: React.CSSProperties = {
  fontWeight: 'bold', fontSize: '18px', color: '#111'
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute', right: 0, border: 'none', background: 'none',
  fontSize: '20px', cursor: 'pointer', color: '#555'
};

// ★ 핵심: 남은 공간을 다 차지하고 내용이 넘치면 스크롤 바 생성
const modalBodyStyle: React.CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column',
  overflowY: 'auto', paddingTop: '15px'
};

/* 화면 1 (목록) 스타일 */
const addAddressBtnStyle = {
  width: '100%', padding: '12px', backgroundColor: 'transparent',
  border: '1px solid #ced4da', borderRadius: '8px', cursor: 'pointer',
  fontSize: '15px', fontWeight: '500', color: '#495057', marginBottom: '20px',
  flexShrink: 0
};

const emptyStateStyle: React.CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', paddingBottom: '40px'
};

const emptyIconStyle: React.CSSProperties = {
  width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f3f5',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  marginBottom: '15px', fontSize: '28px'
};

const emptyTextStyle = { fontSize: '16px', fontWeight: 'bold', color: '#495057', margin: '0 0 8px 0' };
const emptySubTextStyle = { fontSize: '14px', color: '#868e96', textAlign: 'center' as const, margin: 0, lineHeight: '1.4' };

/* 화면 2 (폼 입력) 스타일 */
const formGroupStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', marginBottom: '18px'
};

const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '8px' };

const circleIconStyle = {
  width: '38px', height: '38px', borderRadius: '50%', border: 'none',
  color: 'white', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const helpTextStyle = { fontSize: '11px', color: '#adb5bd', marginBottom: '8px' };
const inputStyle = {
  width: '100%', padding: '11px', border: '1px solid #dee2e6', borderRadius: '8px',
  boxSizing: 'border-box' as const, fontSize: '14px', outline: 'none'
};

const searchBarContainerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', width: '100%', padding: '11px',
  border: '1px solid #dee2e6', borderRadius: '8px', boxSizing: 'border-box', cursor: 'pointer'
};

const searchBarInputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '14px', cursor: 'pointer' };

// 버튼 묶음을 아래에 고정하기 위한 스타일
const buttonGroupStyle: React.CSSProperties = {
  display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '15px', flexShrink: 0
};

const baseBtn = { padding: '14px', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', flex: 1 };
const cancelBtnStyle = { ...baseBtn, backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', color: '#495057' };
const saveBtnStyle = { ...baseBtn, backgroundColor: '#6bc941', color: 'white' };

export default MyLocationSet;