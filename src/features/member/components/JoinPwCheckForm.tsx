import { useFormContext } from "react-hook-form";
import type { JoinFormDTO } from "../types/joinDTO";
import styles from "@member/components/_join-form.module.scss";

export default function JoinPwCheckForm() {
  
  //react-hook-form
  const {
    register,
    watch,
    formState : { errors },
  } = useFormContext<JoinFormDTO>();

  // react-hook-form 라이브러리에서 watch() 사용시 종종 뜨는 경고, 무시 가능
  // 이후 확장성 -> useWatch 를 써서 경고메세지를 없앨 수도 있음
  const pw = watch("memberPw");

  // Pw 무결성 검사
  const pwRegister = register(
    "memberPw", {
      required: "비밀번호를 입력해주세요.",
      minLength: {
        value: 6,
        message: "비밀번호는 최소 6글자 이상이어야 합니다."
      },
      maxLength: {
        value: 30, 
        message: "비밀번호는 최대 30글자를 초과할 수 없습니다."
      },
      pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{6,30}$/,
        message: "비밀번호는 영문, 숫자, 특수문자가 모두 포함된 6글자 이상 30글자 이하여야 합니다."
      }
    });

  // pw 확인 무결성 검사
  const pwCheckRegister = register(
    "pwCheck", {
      validate: (value) => value===pw || "비밀번호가 일치하지 않습니다."
    });



  return (
  <>
    {/* 비밀번호 */}
    <section className={styles.formRow}>
      <label htmlFor="memberPw">비밀번호</label>
      <div className={styles.inputBox}>
        <input id="memberPw" type="password" {...pwRegister}></input>
      </div>
      <span className={styles.message}>{errors.memberPw?.message}</span>
    </section>

    {/* 비밀번호 확인 */}
    <section className={styles.formRow}>
      <label htmlFor="memberPwCheck">비밀번호 확인</label>
      <div className={styles.inputBox}>
        <input id="memberPwCheck" type="password" {...pwCheckRegister}></input>
      </div>
      <span className={styles.message}>{errors.pwCheck?.message}</span>
    </section>

  </>
  );
}