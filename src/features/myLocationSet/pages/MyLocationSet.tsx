import DaumPostcode from 'react-daum-postcode';
import { useMyLocation } from '../hooks/useMyLocation';
import styles from './_my-location-set.module.scss';

const MyLocationSet = () => {

  // Hook에서 필요한 데이터와 함수만 구조분해할당으로 가져옵니다.
  const {
    step, setStep, address, addressData, addressName, setAddressName,
    addressDetail, setAddressDetail, mapContainerRef,
    handleClose, handleComplete, sendToServer, changeAdderssDefault, handleConfirmCurrentLocation
    , addressList, isLoading
  } = useMyLocation();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>

        {/* [화면 1] 나의 저장위치 목록 */}
        {step === 1 && (
          <>
            <div className={styles.modalHeader}>
              <div className={styles.headerTitle}>내 위치 설정</div>
              <button onClick={handleClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <button onClick={() => setStep(2)} className={styles.addAddressBtn}>
                + 위치 추가하기
              </button>

              {/* 🌟 로딩 중 처리 및 실제 DB 데이터 매핑 */}
              {
                isLoading ? (
                  <div className={styles.emptyState} >
                    <p className={styles.emptyText}> 주소록을 불러오는 중입니다...</p>
                  </div>
                ) : addressList && addressList.length > 0 ? (
                  <div className={styles.addressListContainer} >
                    {
                      addressList.map((item) => (
                        <div key={item.addressNo} className={item.addressDefault ==='Y' 
                        ? styles.addressDefaultCard 
                        : styles.addressCard} 
                        onClick={() => changeAdderssDefault(item.addressNo)}>
                          <div className={styles.cardContent} >
                            < div className={styles.cardName} > {item.addressName} </div>
                            < div className={styles.cardAddress} > {item.addressRoad} {item.addressDetail} </div>
                          </div>

                          < button onClick={() => alert('수정 기능 준비 중')} className={styles.editBtn} >
                            수정
                          </button>
                          < button onClick={() => alert('삭제 기능 준비 중')} className={styles.deleteBtn} >
                            삭제
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className={styles.emptyState} >
                    <div className={styles.emptyIcon}>📍</div>
                    < p className={styles.emptyText} > 등록된 위치가 없습니다.</p>
                    < p className={styles.emptySubText} > 위치 추가하기를 눌러 < br /> 주소를 입력해주세요! </p>
                  </div>
                )}
            </div>
          </>
        )}

        {/* [화면 2] 데이터 추가하기 입력 폼 */}
        {step === 2 && (
          <>
            <div className={styles.modalHeader}>
              <button onClick={() => setStep(1)} className={styles.backBtn}>＜</button>
              <div className={styles.headerTitle}>위치 추가하기</div>
              <button onClick={handleClose} className={styles.closeBtn}>✕</button>
            </div>

            {/* 내용이 많아도 모달 크기는 고정되고 이 영역만 스크롤됩니다 */}
            <div className={styles.modalBody}>
              <div style={{ flex: 1 }}>

                {/* 별칭 지정 */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>별칭 지정</label>
                  <input type="text" placeholder="주소 별칭" className={styles.input} style={{ marginBottom: '8px' }}
                    value={addressName} onChange={(e) => setAddressName(e.target.value)} />
                </div>

                {/* 주소 */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>주소</label>
                  <div className={styles.searchBarContainer} onClick={() => setStep(3)}>
                    <span style={{ color: '#aaa', marginRight: '6px' }}>🔍</span>
                    <input
                      type="text"
                      placeholder="우편번호 찾기"
                      value={address ? `[${addressData?.zonecode}] ${address}` : ''}
                      readOnly
                      className={styles.searchBarInput}
                    />
                  </div>
                  <br />
                  <button onClick={() => setStep(4)} className={styles.addAddressBtn}>
                    + 현재 위치로 찾기
                  </button>

                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>상세주소</label>
                  <input type="text" placeholder="상세주소 (50자까지 입력 가능)" className={styles.input}
                    value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
                </div>
              </div>

              {/* 하단 버튼 블록을 바닥에 고정 */}
              <div className={styles.buttonGroup}>
                <button onClick={() => setStep(1)} className={styles.cancelBtn}>취소하기</button>
                <button onClick={sendToServer} className={styles.saveBtn}>저장하기</button>
              </div>
            </div>
          </>
        )}

        {/* [화면 3] 주소찾기 (다음 API 실행 화면) */}
        {step === 3 && (
          <>
            <div className={styles.modalHeader}>
              <button onClick={() => setStep(2)} className={styles.backBtn}>＜</button>
              <div className={styles.headerTitle}>주소찾기</div>
              <button onClick={handleClose} className={styles.closeBtn}>✕</button>
            </div>
            {/* DaumPostcode가 고정된 바디 높이를 100% 채우도록 설정 */}
            <div className={styles.modalBody} style={{ overflow: 'hidden' }}>
              <DaumPostcode onComplete={handleComplete} style={{ height: '100%', width: '100%' }} />
            </div>
          </>
        )}

        {/* [화면 4] 현재 위치로 찾기 (카카오 지도 화면) */}
        {step === 4 && (
          <>
            <div className={styles.modalHeader}>
              <button onClick={() => setStep(2)} className={styles.backBtn}>＜</button>
              <div className={styles.headerTitle}>현재 위치 찾기</div>
              <button onClick={handleClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ overflow: 'hidden', position: 'relative' }}>
              {/* 실제 카카오 지도가 그려지는 영역 */}
              <div ref={mapContainerRef} style={{ width: '100%', height: '82%', borderRadius: '8px' }}></div>

              {/* 지도 선택 완료 버튼 배치 */}
              <div className={styles.buttonGroup} style={{ marginTop: '12px' }}>
                <button onClick={handleConfirmCurrentLocation} className={styles.saveBtn}>
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

export default MyLocationSet;