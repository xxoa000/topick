import { useFormContext } from "react-hook-form";
import type { JoinFormDTO } from "../types/joinDTO";
import styles from "@member/components/_join-form.module.scss";
import { useCustomJoin } from "../hooks/useCustomJoin";

export default function JoinInfoForm() {
  // 전역 단계 관리
  const { setStep } = useCustomJoin();
  
  //react-hook-form
  const {
    register,
    formState : { errors },
  } = useFormContext<JoinFormDTO>();

  const nameRegister = register(
    "memberName", {
      required: "이름을 입력해주세요.",
      minLength: {
        value: 2,
        message: "이름은 최소 2글자 이상이어야 합니다."
      },
      maxLength: {
        value: 30,
        message: "이름은 최대 30글자를 초과할 수 없습니다."
      },
      pattern: {
        value: /^[A-Za-z가-힣]+$/,
        message: "이름은 영문 또는 한글만 사용 가능합니다."
      }
  });

  const emailRegister = register(
    "memberEmail", {
      required: "이메일을 입력해주세요.",
      pattern: {
        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "이메일 형식이 올바르지 않습니다."
      }
    });

  const phoneRegister = register(
    "memberPhone",{
      //required: "ex) 000-0000-0000 형식으로 입력해주세요.",
      pattern: {
        value: /^01[016789]-\d{3,4}-\d{4}$/,
        message: "휴대폰 번호 형식이 올바르지 않습니다."
      }
    });


  

  return (
  <>
  <div className={styles.formBox}>

    {/* 2. 이름 */}
    <section className={styles.formRow}>
      <label htmlFor="memberName">이름</label>
      <div className={styles.inputBox}>
        <input id="memberName" type="text" {...nameRegister}></input>
      </div>
      <span className={styles.message}>{errors.memberName?.message}</span>
    </section>

    {/* 3. 이메일 인증 */}
    <section className={styles.formRow}>
      <label htmlFor="memberEmail">이메일</label>
      <div className={styles.inputBox}>
        <input id="memberEmail" type="email" {...emailRegister}></input>
      </div>
      <span className={styles.message}>{errors.memberEmail?.message}</span>
    </section><br/>

    <h3>선택 입력사항</h3><hr/><br/>
    {/* 4. 폰 번호 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberPhone">폰 번호</label>
      <div className={styles.inputBox}>
        <input id="memberPhone" type="tel" {...phoneRegister}></input>
      </div>
      <span className={styles.message}>{errors.memberPhone?.message}</span>
    </section>

    {/* 5. 성별 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberGender">성별</label>
      <label htmlFor="male">
        <input type="radio" id="male" value="male" {...register("memberGender")}/> 남성
      </label>
      <label htmlFor="female">
        <input type="radio" id="female" value="female" {...register("memberGender")}/> 여성
      </label>
      <label htmlFor="none">
        <input type="radio" id="none" value="none" {...register("memberGender")}/> 선택 안함
      </label>
    </section>

    {/* 6. 생일 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberBirthday">생년월일</label>
      <div className={styles.inputBox}>
        <input id="memberBirthday" type="date" {...register("memberBirthday")}></input>
      </div>
      <span className={styles.message}>{errors.memberBirthday?.message}</span>
    </section>
  </div>

  {/* submit 버튼 */}
  <div className={styles.buttonBox}>
    <button type="button" className={styles.prevButton} onClick={()=>setStep(1)}>이전 단계로</button>
    <button type="submit" className={styles.nextButton}>회원가입</button>
  </div>

  </>
  );
}