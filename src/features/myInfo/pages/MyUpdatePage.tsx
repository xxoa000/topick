import { useState } from "react";
import { useForm } from "react-hook-form";
import s from "@/features/myInfo/pages/_my-update-page.module.scss";
import type { JoinFormDTO } from "@/features/member/types/joinDTO";

export default function MyUpdatePage() {
  const [emailDomain, setEmailDomain] = useState("");

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<JoinFormDTO>();

  const nameRegister = register("memberName", {
    required: "이름을 입력해주세요.",
    minLength: {
      value: 2,
      message: "이름은 최소 2글자 이상이어야 합니다.",
    },
    maxLength: {
      value: 30,
      message: "이름은 최대 30글자를 초과할 수 없습니다.",
    },
    pattern: {
      value: /^[A-Za-z가-힣]+$/,
      message: "이름은 영문 또는 한글만 사용 가능합니다.",
    },
  });

  const emailFirstRegister = register("emailFirst", {
    required: "이메일을 입력해주세요.",
    pattern: {
      value: /^[A-Za-z0-9._+-]+$/,
      message: "이메일 형식이 올바르지 않습니다.",
    },
  });

  const emailLastRegister = register("emailLast", {
    required: "이메일을 선택해주세요.",
    pattern: {
      value: /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      message: "이메일 형식이 올바르지 않습니다.",
    },
  });

  const phoneRegister = register("memberPhone", {
    pattern: {
      value: /^01[016789]-\d{3,4}-\d{4}$/,
      message: "휴대폰 번호 형식이 올바르지 않습니다.",
    },
  });

  const handleEmailDomain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEmailDomain(value);

    if (value === "custom") {
      setValue("emailLast", "", { shouldValidate: true });
    } else {
      setValue("emailLast", value, { shouldValidate: true });
    }
  };

  return (
    <section className={s.page}>
      <header className={s.header}>
        <h3>내 정보 수정</h3>
        <p>아이디와 비밀번호를 제외한 회원 정보를 수정할 수 있습니다.</p>
      </header>

      <div className={s.formBox}>
        <section className={s.formRow}>
          <label htmlFor="memberName">이름 <span className={s.required}>*</span></label>
          <div className={s.inputBox}>
            <input id="memberName" type="text" {...nameRegister} />
          </div>
          <span className={s.message}>{errors.memberName?.message}</span>
        </section>

        <section className={s.formRow}>
          <label htmlFor="emailFirst">이메일 <span className={s.required}>*</span></label>

          <div className={s.emailBox}>
            <input id="emailFirst" type="text" {...emailFirstRegister} />
            <span>@</span>
            <input type="text" id="emailLast" {...emailLastRegister} readOnly={emailDomain !== "custom"}/>
            <select value={emailDomain} onChange={handleEmailDomain}>
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
        </section>

        <div className={s.divider}>
        </div>

        <section className={s.formRow}>
          <label htmlFor="memberPhone">휴대폰 번호</label>
          <div className={s.inputBox}>
            <input type="tel" id="memberPhone" placeholder="010-0000-0000" {...phoneRegister}/>
          </div>
          <span className={s.message}>{errors.memberPhone?.message}</span>
        </section>

        <section className={s.formRow}>
          <label>성별</label>
          <div className={s.radioGroup}>
            <label>
              <input type="radio" value="male" {...register("memberGender")} /> 남성
            </label>
            <label>
              <input type="radio" value="female" {...register("memberGender")} /> 여성
            </label>
            <label>
              <input type="radio" value="none" {...register("memberGender")} /> 선택 안함
            </label>
          </div>
        </section>

        <section className={s.formRow}>
          <label htmlFor="memberBirthday">생년월일</label>
          <div className={s.inputBox}>
            <input id="memberBirthday" type="date" {...register("memberBirthday")} />
          </div>
          <span className={s.message}>{errors.memberBirthday?.message}</span>
        </section>
      </div>

      <button type="submit" className={s.btn}>정보 수정</button>
    </section>
  );
}