import { PickComponent } from "@/features/pick/components/PickComponent";
import { CategoryComponent } from "@/features/category/components/CategoryComponent";
import styles from "./_home.module.scss";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      {/* 왼쪽: 설문 영역 */}
      <div className={styles.leftSection}>
        <PickComponent />
      </div>

      {/* 오른쪽: 카테고리 영역 */}
      <div className={styles.rightSection}>
        <CategoryComponent />
      </div>
    </div>
  );
}