import MenuListPage from "@/features/menu/pages/MenuListPage";
import { ReviewPage } from "@/features/review/pages/ReviewPage";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

interface StoreData {
	addressName: string;
	categoryName: string;
	distance: string;
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

	const [storeData, setStoreData] = useState<any>(null);

	// location.state 안에 우리가 보낸 store가 들어있습니다.
	// TypeScript를 사용 중이시라면 아래와 같이 타입을 지정해 줄 수 있습니다.
	const state = location.state as { store: StoreData } | null;
	const store = state?.store;

	useEffect(() => {
		// 우리가 만든 스프링 부트 API 호출
		fetch(`http://localhost:8080/api/store/${store?.id}`)
			.then(res => res.json())
			.then(data => setStoreData(data));
	}, []);

	console.log(storeData);


	// 사용자가 URL을 직접 입력해서 들어오는 등 state가 없을 때의 예외 처리가 필요합니다.

	if (!store || !storeData) {
		return <div>가게 정보 데이터가 없습니다. (직접 접근 혹은 새로고침)</div>;
	}

	const photos = storeData.menu?.menus?.photos || [];

	// 📸 사진 데이터 안전하게 추출
	const allPhotos = storeData.photos?.photos || [];

	// ⏰ 영업시간 데이터 구조 매핑 (week_periods -> days)
	const storeRunTime = storeData.open_hours?.week_from_today?.week_periods || [];

	// 📋 메뉴 데이터 구조 매핑 (menu -> menus -> items)
	const menuItems = storeData.menu?.menus?.items || [];
	const defaultMenuIcon = storeData.menu?.default_menu_icon_url;

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

				{/* 대표 이미지 배너 (첨부 이미지와 동일한 격자 배치, 5개 사진만 표시) */}
				<div style={{ display: 'flex', height: '250px', backgroundColor: '#f5f5f5', borderRadius: '12px', overflow: 'hidden', gap: '4px' }}>
					{/* 왼쪽: 큰 메인 사진 */}
					<div style={{ flex: 4, display: 'flex', alignItems: 'stretch' }}>
						<img src={allPhotos[0].url} alt={allPhotos[0].title}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							referrerPolicy="no-referrer"
						/>
					</div>

					{/* 중앙: 위아래 중간 사진 2개 */}
					<div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<div style={{ flex: 1, overflow: 'hidden' }}>
							<img src={allPhotos[1].url} alt={allPhotos[1].title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								referrerPolicy="no-referrer"
							/>
						</div>
						<div style={{ flex: 1, overflow: 'hidden' }}>
							<img src={allPhotos[2].url} alt={allPhotos[2].title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								referrerPolicy="no-referrer"
							/>
						</div>
					</div>

					{/* 오른쪽: 위아래 작은 사진 2개 */}
					<div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: '4px' }}>
						<div style={{ flex: 1, overflow: 'hidden' }}>
							<img src={allPhotos[3].url} alt={allPhotos[3].title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								referrerPolicy="no-referrer"
							/>
						</div>
						<div style={{ flex: 1, overflow: 'hidden' }}>
							{/* (더 보기) 오버레이가 제거된 깨끗한 5번째 사진 */}
							<img src={allPhotos[4].url} alt={allPhotos[4].title}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								referrerPolicy="no-referrer"
							/>
						</div>
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
								<strong>주소</strong> <span style={{ marginLeft: '10px' }}>{storeData.summary.address.road}</span>
								<div style={{ color: '#999', marginLeft: '42px', fontSize: '13px' }}>현재 위치에서 {store.distance}m</div>
							</div>
							<div>
								<span>addressName: {store.addressName}</span><br />
								<span>categoryName: {store.categoryName}</span><br />
								<span>distance: {store.distance}</span><br />
								<span>id: {store.id}</span><br />
								<span>placeName: {store.placeName}</span><br />
								<a href={store.placeUrl}>spanplaceUrl: {store.placeUrl}</a><br />
								<span>storeNo: {store.storeNo}</span><br />
								<span>x: {store.x}</span><br />
								<span>y: {store.y}</span><br /><br />

								<strong style={{ width: '44px', flexShrink: 0 }}>영업 시간</strong>
								{storeRunTime.map((i: any) => (
									i.days.map((day: any) => (
										<div style={{ display: 'flex', marginBottom: '12px' }}>
											<div style={{ marginLeft: '10px' }}>
												<span>{day.day_of_the_week_desc} {day.on_days ? day.on_days.start_end_time_desc : day.off_days_desc}</span><br /> {/*요일, 영업시간*/}
												{
													day.on_days?.break_times_desc &&
													<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{day.on_days.break_times_desc[0]}</span> //브레이크 타임
												}
												<br />
												{
													day.on_days?.last_order_times_desc &&
													<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{day.on_days.last_order_times_desc[0]}</span> //브레이크 타임
												}

											</div>
										</div>
									))

								))}

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
			<div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '25px', backgroundColor: '#fff', marginBottom: '20px' }}>
				<h2 style={{ fontSize: '18px', color: '#ff9800', margin: '0 0 15px 0', fontWeight: 'bold' }}>메뉴</h2>

				<div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
					{photos.map((photo: any) => (
						<div key={photo.photo_id} style={{ flex: '0 0 150px', height: '110px', backgroundColor: '#f0f0f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#999' }}>
							<img src={photo.url} alt={photo.title}
								style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
								referrerPolicy="no-referrer" />
						</div>
					))}
				</div>

				{/* 메뉴 리스트 */}
				<MenuListPage />

			</div>

			<div>
				<ReviewPage storeNo={store.storeNo} />
			</div>
		</div>
	);
}