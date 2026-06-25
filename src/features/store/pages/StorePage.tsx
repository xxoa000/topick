import { useStore, useStoreTab } from "../hooks/useStore.ts";
import MenuListPage from "@/features/menu/pages/MenuListPage";
import { ReviewPage } from "@/features/review/pages/ReviewPage";
import { useReview } from '../../review/hooks/useReview';
import { ThumbnailPhoto } from '../components/ThumbnailPhotoComponent.tsx'
import { StoreTab } from '../components/StoreTabComponent.tsx'
import { Fragment, useEffect } from "react";
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
	const state = location.state as { store: StoreData } | null;
	const store = state?.store;
	const { storeData, getStoreData } = useStore();
	const { activeTab, setActiveTab } = useStoreTab();
	const { reviewTotal, getStoreReviewTotal } = useReview();

	useEffect(() => {
		if (!store?.storeNo) return;
		getStoreData(store.storeNo, store.id, store.y, store.x);
		getStoreReviewTotal(store.storeNo);

	}, [store?.storeNo, store?.id, store?.y, store?.x, getStoreReviewTotal]);

	// 사용자가 URL을 직접 입력해서 들어오는 등 state가 없을 때의 예외 처리가 필요합니다.
	if (!store || !storeData) {
		return <div>가게 정보 데이터가 없습니다. (직접 접근 혹은 새로고침)</div>;
	}

	console.log(storeData);

	const photos = storeData.storeDetails.menu?.menus?.photos || [];
	const storeRunTime = storeData.storeDetails.open_hours?.week_from_today?.week_periods || [];
	// 기존 배열과 새 값을 합쳐 중복 없는 배열 생성
	const existingTags = storeData.storeDetails.place_add_info?.tags || [];
	const newTag = store?.categoryName.split('>')[1]?.trim();
	const storeTag = newTag ? [...new Set([...existingTags, newTag])] : existingTags;

	return (
		<div className={styles.container}>
			{/* <a href={store.placeUrl} className={styles.placeLink}>placeUrl: {store.placeUrl}</a><br /><br /> */}

			{/* 1. 상단 상세정보 카드 영역 */}
			<div className={styles.card}>

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

					{/* 대표 이미지 배너 */}
					<ThumbnailPhoto storeData={storeData} />

					{/*  탭 컴포넌트 */}
					<StoreTab activeTab={activeTab} setActiveTab={setActiveTab} />

					{/* 탭 홈 일떄만, 메뉴, 리뷰일떄는 안보이게 */}

					{/* 상세 안내 정보 & 우측 지도 */}
					{activeTab === "home" &&
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
					}

				</div>

				{/* 탭 메뉴 일떄만 */}
				{/* 메뉴 리스트 */}
				{activeTab === "menu" &&
					<MenuListPage photos={photos} />
				}

			</div>

			{activeTab === "review" &&
				<div>
					<ReviewPage storeNo={store.storeNo} />
				</div>
			}
		</div>
	);
}