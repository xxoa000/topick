import { useFormContext } from "react-hook-form";
import type { JoinFormDTO } from "../types/joinDTO";
import memberApi from "../services/memberApi";
import styles from "@member/components/_join-form.module.scss";

export default function JoinIdCheckForm() {

  const {
    register,
    getValues,
    trigger,
    setError,
    clearErrors,
    formState : { errors },
  } = useFormContext<JoinFormDTO>();

  // Id 무결성 검사
  const idCheckRegister = register(
    "memberId", {
      required: "아이디를 입력해주세요.",
      minLength: {
        value: 4,
        message: "아이디는 최소 4글자 이상이어야 합니다."
      },
      maxLength: {
        value: 30, 
        message: "아이디는 최대 30글자를 초과할 수 없습니다."
      },
      pattern: {
        value: /^[a-zA-Z0-9_]+$/,
        message: "아이디는 영문, 숫자, 언더바만 사용할 수 있습니다."
      }
    });

  // Id 중복 확인 form
  const handleIdCheck = async() => {
    // 아이디 무결성 검사
    const validate = await trigger("memberId");
    if (!validate) return;
    // 현재 입력된 아이디 꺼내기
    const memberId = getValues("memberId");

    // 서버에 중복 확인 요청
    try {
      const isAvailable = await memberApi.idCheck(memberId);
      if (!isAvailable) {
        setError("memberId", {
          type: "server",
          message: "이미 존재하는 아이디 입니다."
        })
        return;
      }
      clearErrors("memberId");
      alert ("사용가능한 아이디 입니다.");
    } catch(error) {
      console.error(error);
      setError("memberId", {
        type: "server",
        message: "아이디 중복확인 중 오류가 발생했습니다"
      })
    }
  }

  return (
  <section>
    <br/><h3>필수 입력사항</h3><hr/><br/>

    {/* Id 중복 확인 */}
    <section className={styles.formRow}>
      <label htmlFor="memberId">아이디</label>
      <div className={styles.inputBox}>
        <input id="memberId" type="text" {...idCheckRegister}/>
      </div>
      <button type="button" className={styles.idCheckBtn}
        onClick={handleIdCheck}>중복확인</button>
      <span className={styles.message}>{errors.memberId?.message}</span>
    </section>

  </section>
  );

} //JoinIdCheckForm()