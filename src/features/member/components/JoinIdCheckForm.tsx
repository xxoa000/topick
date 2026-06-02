import { useForm } from "react-hook-form";
import type { JoinRequestDTO } from "../types/joinDTO";
import memberApi from "../services/memberApi";
import { useJoinStepStore } from "../hooks/joinStepStore";
import styles from "@member/components/_join-form.module.scss";

export default function JoinIdCheckForm() {
  // 전역 단계 관리
  const setStep = useJoinStepStore((state) => state.setStep);

  const {
    register,
    handleSubmit,
    formState : { errors },
  } = useForm<JoinRequestDTO>();

  // Id 무결성 검사
  const idCheckRegister = register(
    "memberId", {
      required: "아이디를 입력해주세요.",
      minLength: {
        value: 4,
        message: "아이디는 최소 4글자 이상이어야 합니다."
      },
      maxLength: {
        value: 15, 
        message: "아이디는 최대 15글자를 초과할 수 없습니다."
      },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "아이디는 영문, 숫자, 언더바만 사용할 수 있습니다."
      }
    });

  // Id 중복 확인 form
  const handleIdCheck = async (data:JoinRequestDTO) => {
    try {
      const isAvailable = await memberApi.idCheck(data.memberId);
      if (!isAvailable) {
        alert ("이미 존재하는 아이디 입니다.");
        return;
      }
      alert ("사용가능한 아이디 입니다.");
      setStep(3);

    } catch (error) {
      console.error(error);
    }
  }; //handleIdCheck


  return (
  <form onSubmit={handleSubmit(handleIdCheck)}>

  {/* Id 중복 확인 */}
  <div className={styles.formBox}>

    <section className={styles.formRow}>
      <div className={styles.inputBox}>
        <label htmlFor="memberId">아이디
          <input id="memberId" type="text" {...idCheckRegister}/>
        </label>
      </div>
      <button type="submit" className={styles.idCheckBtn}>중복확인</button>
      <span className={styles.message}>{errors.memberId?.message}</span>
    </section>

  </div>
  </form>
  );

} //JoinIdCheckForm()