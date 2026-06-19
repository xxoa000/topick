import MenuListPage from "@/features/menu/pages/MenuListPage";
import { ReviewPage } from "@/features/review/pages/ReviewPage";
import { useReview } from '../../review/hooks/useReview';
import { Fragment, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import styles from './_store-page.module.scss';

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
	const state = location.state as { store: StoreData } | null;
	const store = state?.store;
	const { reviewTotal, getStoreReviewTotal } = useReview();




	useEffect(() => {
		// 스프링 부트 API 호출
		fetch(`http://localhost:8080/api/store/${store?.storeNo}/kakaoId/${store?.id}/lat/${store?.y}/lng/${store?.y}`)
			.then(res => res.json())
			.then(data => setStoreData(data));

		if (store?.storeNo) {
			getStoreReviewTotal(store.storeNo);
		}
	}, [store?.storeNo, getStoreReviewTotal]);

	

	// 사용자가 URL을 직접 입력해서 들어오는 등 state가 없을 때의 예외 처리가 필요합니다.
	if (!store || !storeData) {
		return <div>가게 정보 데이터가 없습니다. (직접 접근 혹은 새로고침)</div>;
	}

	console.log(storeData);

	const photos = storeData.storeDetails.menu?.menus?.photos || [];
	const allPhotos = storeData.storeDetails.photos?.photos || [];
	const storeRunTime = storeData.storeDetails.open_hours?.week_from_today?.week_periods || [];
	const storeTag = storeData.storeDetails.place_add_info?.tags || [];
	storeTag.push(store?.categoryName.split('>')[1]?.trim());

	return (
		<div className={styles.container}>
			{/* <a href={store.placeUrl} className={styles.placeLink}>placeUrl: {store.placeUrl}</a><br /><br /> */}

			{/* 1. 상단 상세정보 카드 영역 */}
			<div className={styles.card}>

				{/* 대표 이미지 배너 */}
				<div className={styles.banner}>
					{/* 왼쪽: 큰 메인 사진 */}
					<div className={styles.mainPhoto}>
						<img src={allPhotos[0].url} alt={allPhotos[0].title} referrerPolicy="no-referrer" />
					</div>

					{/* 중앙: 위아래 중간 사진 2개 */}
					<div className={styles.subPhotoGroup}>
						<div className={styles.imgWrapper}>
							<img src={allPhotos[1].url} alt={allPhotos[1].title} referrerPolicy="no-referrer" />
						</div>
						<div className={styles.imgWrapper}>
							<img src={allPhotos[2].url} alt={allPhotos[2].title} referrerPolicy="no-referrer" />
						</div>
					</div>

					{/* 오른쪽: 위아래 작은 사진 2개 */}
					<div className={styles.subPhotoGroup}>
						<div className={styles.imgWrapper}>
							<img src={allPhotos[3].url} alt={allPhotos[3].title} referrerPolicy="no-referrer" />
						</div>
						<div className={styles.imgWrapper}>
							<img src={allPhotos[4].url} alt={allPhotos[4].title} referrerPolicy="no-referrer" />
						</div>
					</div>
				</div>

				{/* 텍스트 정보 영역 */}
				<div className={styles.infoSection}>

					{/* 타이틀 이름 / 별점 / 버튼 */}
					<div className={styles.titleRow}>
						<div className={styles.titleLeft}>
							<h1>{store.placeName}</h1>
							{/* 별점 컨테이너 */}
							<div className={styles.starRating}>
								{/* 1. 채워진 별 (노란색) - 평점 퍼센트만큼만 보여짐 */}
								<div
									className={styles.starsFill}
									style={{ width: `${(reviewTotal.avg / 5) * 100}%` }}
								>
									<span>★★★★★</span>
								</div>

								{/* 2. 기본 별 (회색) - 배경에 항상 깔려있음 */}
								<div className={styles.starsBase}>
									<span>★★★★★</span>
								</div>
							</div>
							<span className={styles.reviewCount}>({reviewTotal.total})</span>
						</div>
						<div className={styles.btnGroup}>
							<button>북마크</button>
							<button>공유</button>
						</div>
					</div>

					{/* 태그 리스트 */}
					<div className={styles.tagList}>
						{storeTag.map((tag: string) => (
							<span key={tag} className={styles.tag}>
								{tag}
							</span>
						))}
					</div>

					{/* 상세 안내 정보 & 우측 지도 */}
					<div className={styles.detailsRow}>

						{/* 왼쪽 안내문구 */}
						<div className={styles.detailsLeft}>
							<div className={styles.addressBlock}>
								<strong>주소</strong> <span>{storeData.storeDetails.summary.address.road}</span>
								<span className={styles.distance}>현재 위치에서 {store.distance}m</span>
							</div>

							<div className={styles.timeBlock}>
								<strong>영업 시간</strong>
								<div className={styles.timeDetails}>
									{storeRunTime.map((i: any, index: number) => (
										i.days.map((day: any, dayIndex: number) => (
											<Fragment key={`${index}-${dayIndex}`}>
												<span>{day.day_of_the_week_desc} {day.on_days ? day.on_days.start_end_time_desc : day.off_days_desc}</span>
												{
													day.on_days?.break_times_desc &&
													<>
														<br />
														<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{day.on_days.break_times_desc[0]}</span>
													</>
												}
												<br />
												{
													day.on_days?.last_order_times_desc &&
													<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{day.on_days.last_order_times_desc[0]}</span>
												}
											</Fragment>
										))
									))}
								</div>
							</div>

							<div>
								<strong>전화번호</strong> <span>{store.phone}</span>
							</div>
						</div>

						{/* 우측 미니 지도 미포함 플레이스홀더 */}
						<div className={styles.mapPlaceholder}>
							[지도 미리보기 영역]
						</div>

					</div>

				</div>
			</div>

			{/* 메뉴 리스트 */}
			<MenuListPage photos={photos} />

			<div>
				<ReviewPage storeNo={store.storeNo} />
			</div>
		</div>
	);
}