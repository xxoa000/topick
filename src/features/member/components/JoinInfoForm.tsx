import { useFormContext } from "react-hook-form";
import type { JoinFormDTO } from "../types/joinDTO";
import s from "@member/components/_join-form.module.scss";
import { useCustomJoin } from "../hooks/useCustomJoin";
import { useState } from "react";

export default function JoinInfoForm() {
  // 전역 단계 관리
  const { setStep } = useCustomJoin();
  const [emailDomain, setEmailDomain] = useState("");
  
  //react-hook-form
  const {
    register,
    watch,
    setValue,
    formState : { errors },
  } = useFormContext<JoinFormDTO>();

  // 무결성 검사
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

  const emailFirstRegister = register(
    "emailFirst", {
      required: "이메일을 입력해주세요.",
      pattern: {
        value: /^[A-Za-z0-9._%+-]+$/,
        message: "이메일 형식이 올바르지 않습니다."
      }
    });

  const emailLastRegister = register(
    "emailLast", {
      required: "이메일을 입력해주세요.",
      pattern: {
        value: /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
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

  // 이메일 도메인 선택하기
  const handleEmailDomain = (e) => {
    const value = e.target.value;
    setEmailDomain(value);
    if (value==="custom") {
      setValue("emailLast","");
    } else {
      setValue("emailLast",value, {
        shouldValidate: true
      });
    }
  }
  
  // 가입조건 만족식 버튼 색 바뀌는 용도
  const watchCheck = watch(["memberId", "memberPw", "memberName","memberEmail"]);
  const allCheck = watchCheck.every(Boolean);


  

  return (
  <>
  <div className={s.formBox}>

    {/* 2. 이름 */}
    <section className={s.formRow}>
      <label htmlFor="memberName">이름<span className={s.required}>*</span></label>
      <div className={s.inputBox}>
        <input id="memberName" type="text" {...nameRegister} />
      </div>
      <span className={s.message}>{errors.memberName?.message}</span>
    </section>

    {/* 3. 이메일 인증 */}
    <section className={s.formRow}>
      <label htmlFor="memberEmail">이메일<span className={s.required}>*</span></label>
      <div className={s.inputBox}>
        <input id="emailFirst" type="text" {...emailFirstRegister} />
        <span id="emailMiddle">@</span>
        <input id="emailLast" type="text" {...emailLastRegister} readOnly={emailDomain!=="custom"}/>
        <select id="emailDomainList" value={emailDomain} onChange={handleEmailDomain}>
          <option value="">이메일 선택</option>
          <option value="gmail.com">gmail.com</option>
          <option value="naver.com">naver.com</option>
          <option value="hanmail.net">hanmail.net</option>
          <option value="daum.net">daum.net</option>
          <option value="nate.com">nate.com</option>
          <option value="custom">직접입력</option>
        </select>
      </div>
      <span className={s.message}>{errors.emailFirst?.message || errors.emailLast?.message}</span>
    </section><br/>

    <h3>선택 입력사항</h3>
    {/* 4. 폰 번호 (선택) */}
    <section className={s.formRow}>
      <label htmlFor="memberPhone">폰 번호</label>
      <div className={s.inputBox}>
        <input id="memberPhone" type="tel" {...phoneRegister} />
      </div>
      <span className={s.message}>{errors.memberPhone?.message}</span>
    </section>

    {/* 5. 성별 (선택) */}
    <section className={s.formRow}>
      <label htmlFor="memberGender">성별</label>
      <label htmlFor="male" className={s.radio}>남성
        <input type="radio" id="male" value="male" {...register("memberGender")}/>
      </label>
      <label htmlFor="female" className={s.radio}>여성
        <input type="radio" id="female" value="female" {...register("memberGender")}/> 
      </label>
      <label htmlFor="none" className={s.radio}>선택 안함
        <input type="radio" id="none" value="none" {...register("memberGender")}/> 
      </label>
    </section>

    {/* 6. 생일 (선택) */}
    <section className={s.formRow}>
      <label htmlFor="memberBirthday">생년월일</label>
      <div className={s.inputBox}>
        <input id="memberBirthday" type="date" {...register("memberBirthday")} />
      </div>
      <span className={s.message}>{errors.memberBirthday?.message}</span>
    </section>
  </div>

  {/* submit 버튼 */}
  <div className={s.buttonBox}>
    <button type="button" className={s.prevButton} onClick={()=>setStep(1)}>이전 단계로</button>
    <button type="submit" className={allCheck ? s.activeButton : s.disableButton}>회원가입</button>
  </div>

  </>
  );
}