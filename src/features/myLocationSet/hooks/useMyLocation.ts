import { useState, useEffect, useRef, useCallback } from 'react';
import type { Address } from 'react-daum-postcode';
import { useNavigate } from 'react-router-dom';
import useCustomLogin from '@/hooks/useCustomLogin';
import { getCoordsByAddress, saveMyLocationApi, getMyLocationListApi } from '../services/locationService'
import type { AddressItem } from '../types/location'; // 타입 추가

export const useMyLocation = () => {
  const navigate = useNavigate();
  const { member } = useCustomLogin();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState<string>('');
  const [addressData, setAddressData] = useState<Address | null>(null);
  const [addressName, setAddressName] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');

  //@@@@@@@@@@@@@@2 🌟 백엔드에서 받아온 주소록 리스트 상태 추가
  const [addressList, setAddressList] = useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 지도를 담을 DOM 참조와 선택된 임시 좌표 상태
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);

  // 브라우저 뒤로가기 실행 (모달 닫힘 효과)
  const handleClose = () => navigate(-1);

  //주소록 목록을 불러오는 함수 (재사용을 위해 useCallback 처리)
  const fetchAddressList = useCallback(async () => { //useEffect 안에서 지정된 값이 변경되는 경우에만 재실행 (useCallback)
    if (!member?.memberId) return;
    
    try {
      setIsLoading(true);
      const list = await getMyLocationListApi(member.memberId);
      setAddressList(list);
    } catch (err) {
      console.error("주소 목록 로드 실패:", err);
    } finally {
      setIsLoading(false);
    }
  }, [member?.memberId]); //감시대상 지정

  //컴포넌트 마운트 시점 혹은 member 정보가 수정되는 경우
  useEffect(() => {
    if (member?.memberId) {
      fetchAddressList();
    }
  }, [member?.memberId, fetchAddressList]);

  // 우편번호 검색 완료 처리 (Step 3 -> Step 2)
  const handleComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
    setAddressData(data);
    setAddressName(data.buildingName || "현재 위치");
    setStep(2);
  };

  //서버로 데이터를 보내는 함수
  const sendToServer = async () => {
    if (!addressData) {
      alert("주소를 먼저 검색해주세요.");
      return;
    }
    try {
      const coords = await getCoordsByAddress(addressData.roadAddress);
      if (!coords) {
        alert("좌표를 변환할 수 없는 주소입니다.");
        return;
      }

      const requestData = {
        memberId: member?.memberId,
        addressPostcode: addressData.zonecode,
        addressRoad: addressData.roadAddress,
        addressLot: addressData.jibunAddress,
        addressDetail: addressDetail,
        addressName: addressName || "내 위치",
        addressX: coords.x,
        addressY: coords.y
      };

      await saveMyLocationApi(requestData);
      setStep(1);
      alert("서버에 주소가 성공적으로 저장되었습니다");

      // 🌟 주소 저장 성공 후 리스트 동기화
      await fetchAddressList(); 
      
      // 폼 초기화
      setAddress('');
      setAddressData(null);
      setAddressName('');
      setAddressDetail('');

    } catch (err) {
      alert(`저장 실패: ${err}`);
    }
  };

  // ★ Step 4 진입 시 카카오 지도 초기화 및 GPS 호출 로직
  useEffect(() => {
    if (step !== 4 || !mapContainerRef.current) return;

    const { kakao } = window as any;
    if (!kakao || !kakao.maps) {
      alert("카카오 맵 라이브러리가 로드되지 않았습니다.");
      return;
    }

    // 기본 좌표 (GPS 차단 시 사용할 기본값: 미금역)
    let defaultLat = 37.3500951835995;
    let defaultLng = 127.108932846326;

    const initMap = (latitude: number, longitude: number, myLevel: number) => {
      const options = { center: new kakao.maps.LatLng(latitude, longitude), level: myLevel }; //지도의 중심점, 확대/축소 수준
      const map = new kakao.maps.Map(mapContainerRef.current, options); //그려질 div, 옵션 전달
      const marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(latitude, longitude) }); // 마커 생성 및 표시

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
    if (navigator.geolocation) { //위치정보 API 존재 여부
      navigator.geolocation.getCurrentPosition( //위치권한 허용 || 위치가 받아진 경우
        (position) => initMap(position.coords.latitude, position.coords.longitude, 3),
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

    geocoder.coord2Address(tempCoords.lng, tempCoords.lat, (result: any, status: any) => { //요청값, (응답값) 
      if (status === kakao.maps.services.Status.OK) {

        // 1. 필요한 데이터 추출
        const addrInfo = result[0];
        const roadAddress = addrInfo.road_address ? addrInfo.road_address.address_name : '';
        const jibunAddress = addrInfo.address ? addrInfo.address.address_name : '';
        const zonecode = addrInfo.road_address ? addrInfo.road_address.zone_no : '';
        const buildingName = addrInfo.road_address ? addrInfo.road_address.building_name : '';
        const bname = addrInfo.address ? addrInfo.address.region_3depth_name : '';

        // 2. UI 표시용 전체 주소 문자열 (도로명 우선, 없으면 지번)
        const displayAddress = roadAddress || jibunAddress;

        // 3. 상태 업데이트 
        setAddress(displayAddress);

        // 4. Address 타입 객체 구조 모방
        setAddressData({
          zonecode: zonecode || '00000',
          roadAddress: roadAddress || jibunAddress,
          jibunAddress: jibunAddress,
          address: displayAddress,
          buildingName: buildingName || '',
          bname: bname || '',
          addressType: addrInfo.road_address ? 'R' : 'J'
        } as Address);

        setAddressName(buildingName || '현재 위치'); // 별칭 설정
        setStep(2);
      } else {
        alert("선택하신 지점의 주소를 변환할 수 없습니다.");
      }
    });
  };

  return {
    step, setStep, address, addressData, addressName, setAddressName,
    addressDetail, setAddressDetail, mapContainerRef,
    handleClose, handleComplete, sendToServer, handleConfirmCurrentLocation
    , addressList, isLoading
  };
};