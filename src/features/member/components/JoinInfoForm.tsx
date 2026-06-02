import { useForm } from "react-hook-form";
import type { JoinRequestDTO } from "../types/joinDTO";
import styles from "@member/components/_join-form.module.scss";
import JoinIdCheckForm from "./JoinIdCheckForm";
import JoinPwCheckForm from "./JoinPwCheckForm";

export default function JoinInfoForm() {

  //react-hook-form
  const {
    register,
    watch,
    formState : { errors },
  } = useForm<JoinRequestDTO>({
    mode: "onChange"
  });
  
  return (
  <div className={styles.formBox}>
    <JoinIdCheckForm />
    <JoinPwCheckForm />


    {/* 이메일 인증 */}
    <section className={styles.formRow}>
      <label htmlFor="memberEmail"></label>
      <div className={styles.inputBox}>
        <input id="memberEmail" type=""></input>
      </div>
      <span className={styles.message}>{errors.memberEmail?.message}</span>
    </section>

    {/* 폰 번호 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberPhone"></label>
      <div className={styles.inputBox}>
        <input id="memberPhone" type=""></input>
      </div>
      <span className={styles.message}>{errors.memberPhone?.message}</span>
    </section>

    {/* 성별 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberGender"></label>
      <div className={styles.inputBox}>
        <input id="memberGender" type=""></input>
      </div>
      <span className={styles.message}>{errors.memberGender?.message}</span>
    </section>

    {/* 생일 (선택) */}
    <section className={styles.formRow}>
      <label htmlFor="memberBirthday"></label>
      <div className={styles.inputBox}>
        <input id="memberBirthday" type=""></input>
      </div>
      <span className={styles.message}>{errors.memberBirthday?.message}</span>
    </section>


  </div>
  );
}