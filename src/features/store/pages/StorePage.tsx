import { ReviewPage } from "@/features/review/pages/ReviewPage";
import { useLocation } from 'react-router-dom';

interface StoreData {
	addressName: string;
	categoryName: string;
	id: string;
	placeName: string;
	placeUrl: string;
	storeNo: number;
	x: string;
	y: string;
	phone: string;
}

export default function StorePage() {
	const location = useLocation();

	// location.state 안에 우리가 보낸 store가 들어있습니다.
	// TypeScript를 사용 중이시라면 아래와 같이 타입을 지정해 줄 수 있습니다.
	const state = location.state as { store: StoreData } | null;
	const store = state?.store;

	// 사용자가 URL을 직접 입력해서 들어오는 등 state가 없을 때의 예외 처리가 필요합니다.
	if (!store) {
		return <div>가게 정보 데이터가 없습니다. (직접 접근 혹은 새로고침)</div>;
	}
	return (
		<div style={{ maxWidth: '850px', margin: '20px auto', fontFamily: 'sans-serif', color: '#333' }}>

			{/* 1. 상단 상세정보 카드 영역 */}
			<div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', marginBottom: '20px' }}>

				{/* 상단 탭 메뉴 */}
				<div style={{ display: 'flex', backgroundColor: '#e6e1da' }}>
					<button style={{ flex: 1, padding: '15px', border: 'none', backgroundColor: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>홈</button>
					<button style={{ flex: 1, padding: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#666', cursor: 'pointer' }}>메뉴</button>
					<button style={{ flex: 1, padding: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#666', cursor: 'pointer' }}>리뷰</button>
					<button style={{ flex: 1, padding: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#666', cursor: 'pointer' }}>사진</button>
					<button style={{ flex: 1, padding: '15px', border: 'none', backgroundColor: 'transparent', fontSize: '16px', color: '#666', cursor: 'pointer' }}>정보</button>
				</div>

				{/* 대표 이미지 배너 (반반 분할) */}
				<div style={{ display: 'flex', height: '220px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
					<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #fff' }}>
						{/* <img src="떡볶이_이미지_주소" alt="메인메뉴1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
						<span style={{ color: '#999' }}>[메인 이미지 1]</span>
					</div>
					<div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						{/* <img src="감자튀김_이미지_주소" alt="메인메뉴2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
						<span style={{ color: '#999' }}>[메인 이미지 2]</span>
					</div>
				</div>

				{/* 텍스트 정보 영역 */}
				<div style={{ padding: '25px' }}>

					{/* 타이틀 이름 / 별점 / 버튼 */}
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{store.placeName}</h1>
							<span style={{ color: '#ff9800', fontSize: '18px' }}>★★★★☆</span> {/*별점*/}
							<span style={{ color: '#aaa', fontSize: '14px' }}>(2,309)</span> {/*리뷰 갯수*/}
						</div>
						<div style={{ display: 'flex', gap: '8px' }}>
							<button style={{ padding: '6px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>북마크</button>
							<button style={{ padding: '6px 16px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' }}>공유</button>
						</div>
					</div>

					{/* 태그 리스트 */}
					<div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
						{['떡볶이', '매콤', '점심식사', '저녁식사'].map((tag) => ( //태그
							<span key={tag} style={{ backgroundColor: '#ff9800', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '13px' }}>
								{tag}
							</span> 
						))}
					</div>

					{/* 상세 안내 정보 & 우측 지도 */}
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px' }}>

						{/* 왼쪽 안내문구 */}
						<div style={{ flex: 1, fontSize: '14px', lineHeight: '1.7' }}>
							<div style={{ marginBottom: '12px' }}>
								<strong>주소</strong> <span style={{ marginLeft: '10px' }}>경기도 성남시 분당구 성남대로 151 분당엠코헤리츠 2층 211호 청년다방 미금역점 {}</span> //store.addressName
								<div style={{ color: '#999', marginLeft: '42px', fontSize: '13px' }}>미금역 5,6번 출구 도보 5분</div>
							</div>

							<div style={{ display: 'flex', marginBottom: '12px' }}>
								<strong style={{ width: '42px', flexShrink: 0 }}>영업 시간</strong>
								<div style={{ marginLeft: '10px' }}>
									<div>월 휴무</div>
									<div>화 16:00 ~ 22:00</div>
									<div>수 목 금 10:00 ~ 22:00</div>
									<div>주말 9:00 ~ 20:00</div>
								</div>
							</div>

							<div>
								<strong>전화번호</strong> <span style={{ marginLeft: '10px' }}>{store.phone}</span>
							</div>
						</div>

						{/* 오른쪽 미니 지도 미포함 플레이스홀더 */}
						<div style={{ width: '24px', minWidth: '220px', height: '130px', backgroundColor: '#eef2f5', border: '1px solid #e0e0e0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#888' }}>
							[지도 미리보기 영역]
						</div>

					</div>

				</div>
			</div>

			{/* 2. 하단 인기메뉴 카드 영역 */}
			<div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '25px', backgroundColor: '#fff' }}>
				<h2 style={{ fontSize: '18px', color: '#ff9800', margin: '0 0 15px 0', fontWeight: 'bold' }}>인기메뉴</h2>

				{/* 가로 아이템 리스트 */}
				<div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
					{[1, 2, 3, 4, 5].map((item) => (
						<div key={item} style={{ flex: '0 0 150px', height: '110px', backgroundColor: '#f0f0f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#999' }}>
							{/* <img src="메뉴_이미지_주소" alt="인기메뉴" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> */}
							[메뉴 이미지 {item}]
						</div>
					))}
				</div>
			</div>
			<div>
				<ReviewPage storeNo={5} />
			</div>
		</div>
	);
}