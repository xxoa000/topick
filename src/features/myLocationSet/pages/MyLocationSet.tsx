import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import { useMyLocation } from '../hooks/useMyLocation';

// 디자인 확인을 위한 임시 데이터 배열
const mockAddresses = [
  { id: 1, name: '우리집 🏠', address: '서울특별시 강남구 테헤란로 123', detail: '101동 202호' },
  { id: 2, name: '회사 🏢', address: '경기도 성남시 분당구 판교역로 234', detail: 'H스퀘어 N동 5층' },
];

const MyLocationSet = () => {
  // Hook에서 필요한 데이터와 함수만 구조분해할당으로 가져옵니다.
  const {
    step, setStep, address, addressData, addressName, setAddressName,
    addressDetail, setAddressDetail, mapContainerRef,
    handleClose, handleComplete, sendToServer, handleConfirmCurrentLocation
  } = useMyLocation();

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

              {/* 저장된 위치 목록 표시 영역 */}
              {mockAddresses && mockAddresses.length > 0 ? (
                // 1. 저장된 위치 목록이 있을 때
                <div style={addressListContainerStyle}>
                  {mockAddresses.map((item) => (
                    <div key={item.id} style={addressCardStyle}>
                      <div style={cardContentStyle}>
                        <div style={cardNameStyle}>{item.name}</div>
                        <div style={cardAddressStyle}>{item.address}</div>
                        <div style={cardDetailStyle}>{item.detail}</div>
                      </div>

                      <button onClick={() => alert('수정 기능 준비 중')} style={editBtnStyle}>
                        수정
                      </button>
                      <button onClick={() => alert('삭제 기능 준비 중')} style={deleteBtnStyle}>
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // 2. 저장된 위치 목록이 없을 때 (Empty State)
                <div style={emptyStateStyle}>
                  <div style={emptyIconStyle}>📍</div>
                  <p style={emptyTextStyle}>사용 가능한 위치가 없습니다.</p>
                  <p style={emptySubTextStyle}>위치 추가하기를 눌러<br />주소를 입력해주세요!</p>
                </div>
              )}
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
                    value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
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

// 목록을 감싸는 컨테이너
const addressListContainerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: '12px'
};

// 개별 주소 카드 카드 (버튼 배치를 위해 position: 'relative' 부여)
const addressCardStyle: React.CSSProperties = {
  position: 'relative',
  padding: '16px',
  border: '1px solid #e9ecef',
  borderRadius: '12px',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

// 우측 버튼들과 글자가 겹치지 않도록 안쪽 여백 설정
const cardContentStyle: React.CSSProperties = {
  paddingRight: '55px'
};

const cardNameStyle = { fontSize: '15px', fontWeight: 'bold', color: '#212529' };
const cardAddressStyle = { fontSize: '13px', color: '#495057', marginTop: '4px', lineHeight: '1.4' };
const cardDetailStyle = { fontSize: '13px', color: '#868e96' };

// 우측 상단 수정 버튼
const editBtnStyle: React.CSSProperties = {
  position: 'absolute', top: '16px', right: '16px',
  border: 'none', background: 'none', color: '#495057',
  fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0
};

// 우측 하단 삭제 버튼
const deleteBtnStyle: React.CSSProperties = {
  position: 'absolute', bottom: '16px', right: '16px',
  border: 'none', background: 'none', color: '#f03e3e',
  fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0
};