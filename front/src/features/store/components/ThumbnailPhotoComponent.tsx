import styles from './_thumbnail-photo-component.module.scss';

export const ThumbnailPhoto: React.FC<any> = ({ storeData }) => {
  const allPhotos = storeData?.storeDetails?.photos?.photos?.filter(Boolean) || [];

  const getPhoto = (index: number) => {
    return {
      url: allPhotos[index]?.url ?? "/no-image.png",
      title: allPhotos[index]?.title ?? "가게 사진",
    };
  };

  return (
    <div className={styles.banner}>
      <div className={styles.mainPhoto}>
        <img
          src={getPhoto(0).url}
          alt={getPhoto(0).title}
          referrerPolicy="no-referrer"
        />
      </div>

      <div className={styles.subPhotoGroup}>
        <div className={styles.imgWrapper}>
          <img
            src={getPhoto(1).url}
            alt={getPhoto(1).title}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={styles.imgWrapper}>
          <img
            src={getPhoto(2).url}
            alt={getPhoto(2).title}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className={styles.subPhotoGroup}>
        <div className={styles.imgWrapper}>
          <img
            src={getPhoto(3).url}
            alt={getPhoto(3).title}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={`${styles.imgWrapper} ${styles.lastPhotoWrapper}`}>
          <img
            src={getPhoto(4).url}
            alt={getPhoto(4).title}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 전체 사진이 5개보다 많을 때만 오버레이 표시 */} 
        {/* {allPhotos.length > 5 && ( 
            <div className={styles.photoOverlay}> 사진 갤러리 아이콘 (SVG) 
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > 
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2">
                </rect> 
                <circle cx="8.5" cy="8.5" r="1.5"></circle> 
                <polyline points="21 15 16 10 5 21"></polyline> </svg> 남은 사진 개수 계산 
                <span className={styles.moreCount} > {allPhotos.length - 4}+ </span> 
            </div> 
            )} 
        */}
      </div>
    </div>
  );
};

