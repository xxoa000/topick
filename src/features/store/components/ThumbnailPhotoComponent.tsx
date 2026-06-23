import styles from './_thumbnail-photo-component.module.scss';

export const ThumbnailPhoto: React.FC<any> = ({storeData}) => {
    const allPhotos = storeData.storeDetails.photos?.photos || [];

    return (
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
                <div
                    className={`${styles.imgWrapper} ${styles.lastPhotoWrapper}`}
                //onClick={() => handleTabChange('photo')} // 클릭 시 사진 탭으로 이동
                >
                    <img src={allPhotos[4].url} alt={allPhotos[4].title} referrerPolicy="no-referrer" />

                    {/* 전체 사진이 5개보다 많을 때만 오버레이 표시 */}
                    {allPhotos.length > 5 && (
                        <div className={styles.photoOverlay}>
                            {/* 사진 갤러리 아이콘 (SVG) */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>

                            {/* 남은 사진 개수 계산 */}
                            <span className={styles.moreCount}>
                                {allPhotos.length - 4}+
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};