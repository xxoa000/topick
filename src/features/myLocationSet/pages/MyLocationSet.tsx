import React from 'react';
import { useState } from 'react';

import DaumPostcode, { type Address } from 'react-daum-postcode';

// import axios from "axios";
import { apiCall } from '../services/apiService'; // 기존 apiCall 임포트
import { getCoordsByAddress } from '../services/coordsByAddress';

const MyLocationSet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState<string>(''); // 선택된 주소 상태
  const [addressData, setAddressData] = useState<any>(null); // 서버 전송용 원본 데이터 객체

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
    setIsOpen(false); // 주소 선택 후 모달 자동으로 닫기 

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
        memberId: "javaFather", // 실제 서비스라면 로그인된 ID 등을 넣으세요.
        addressPostcode: addressData.zonecode,
        addressRoad: addressData.roadAddress,
        addressLot: addressData.jibunAddress,
        addressDetail: "상세주소 직접 입력란의 값", // 필요 시 input 추가
        addressName: addressData.buildingName, //필요 시 input 추가
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

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>주소 검색</button>
      {isOpen && (
        <div style={modalOverlayStyle} onClick={() => setIsOpen(false)}>
          {/* 모달 바디 상자 (e.stopPropagation()으로 흰 상자 클릭 시 닫히는 걸 막음) */}
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            {/* 모달 상단 헤더 영역 */}
            <div style={modalHeaderStyle}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>주소 검색</span>
              <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>X</button>
            </div>

            {/* 카카오 주소 검색 도구 (높이를 지정해 주어야 모달 안에서 이쁘게 깨지지 않고 나옵니다) */}
            <DaumPostcode onComplete={handleComplete} style={{ height: '470px' }} />
          </div>
        </div>
      )}

      {/* 3. 검색 결과 출력 영역 */}
      {address && (
        <div style={resultBoxStyle}>
          <p><strong>선택된 주소:</strong> {address}</p>
          <p><strong>우편번호:</strong> {addressData?.zonecode}</p>

          <hr />
          {/* 서버로 보내는 버튼 */}
          <button onClick={sendToServer} style={sendBtnStyle}>
            서버로 주소 전송하기
          </button>
        </div>
      )}
    </div>
  );
};

// --- 기존 스타일 양식 ---
const btnStyle = { padding: '8px 16px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const sendBtnStyle = { ...btnStyle, backgroundColor: '#007bff', marginTop: '10px' };
const resultBoxStyle = { marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' };

// --- 모달 구조를 구현하기 위해 새로 추가된 필수 스타일 스타일 ---
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // 화면을 어둡게 만드는 반투명 검은 배경
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000 // 웹화면의 그 어떤 요소보다 가장 최상단에 뜨도록 배치
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '500px', // 검색 도구가 들어갈 알맞은 가로 사이즈 고정
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  boxSizing: 'border-box'
};

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  paddingBottom: '10px',
  borderBottom: '1px solid #eee'
};

const closeBtnStyle = {
  border: 'none',
  background: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#555'
};

export default MyLocationSet