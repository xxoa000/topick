import memberApi from "@/features/member/services/memberApi";
import useCustomLogin from "@/hooks/useCustomLogin";
import axios from "axios";
import s from "@/features/myInfo/pages/_my-resign-page.module.scss";

export default function MyResignPage() {
  const { member, resign } = useCustomLogin();
  

  const handleResign = async() => {
    if (!member) return;

    try {
      if (!confirm("회원 탈퇴 시 모든 정보가 삭제됩니다.\n정말 탈퇴하시겠습니까?")) return;
      await memberApi.resign();

      //방문기록을 없애고 홈으로 돌아감
      alert("회원탈퇴 성공! 홈으로 돌아갑니다.");
      resign();

    } catch(error) {
      // axios 에러가 아니라면 여기서 return
      if (axios.isAxiosError(error)) {
        console.log(error.response?.status);
        console.log(error.response?.data);
      } else {
        console.error(error);
      }
    }
  }


	return (
  <section className={s.page}>
    <h3>회원 탈퇴</h3>

    <p className={s.desc}>
    회원 탈퇴 시 계정 정보와 서비스 이용 내역이 삭제되며,
    삭제된 정보는 복구할 수 없습니다.
    </p>

    <ul className={s.notice}>
      <li>주문 내역 조회가 불가능해집니다.</li>
      <li>보유 중인 포인트는 모두 소멸됩니다.</li>
      <li>탈퇴 후 동일 아이디로 재가입할 수 없습니다.</li>
    </ul>

    <div className={s.warning}>
      위 내용을 모두 확인했으며 회원 탈퇴를 진행합니다.
    </div>
    <button type="button" onClick={handleResign} className={s.btn}>탈퇴 하기</button>
  </section>
  );
}