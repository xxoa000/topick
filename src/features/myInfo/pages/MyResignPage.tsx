import memberApi from "@/features/member/services/memberApi";
import useCustomLogin from "@/hooks/useCustomLogin";
import axios from "axios";

export default function MyResignPage() {
  const { member, resign } = useCustomLogin();
  

  const handleResign = async() => {
    if (!member) return;

    try {
      if (!confirm("정말로 탈퇴하시겠습니까?")) return;
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
  <section>
    회원 탈퇴

      <button type="button" onClick={handleResign}>탈퇴 하기</button>
  </section>
  );
}