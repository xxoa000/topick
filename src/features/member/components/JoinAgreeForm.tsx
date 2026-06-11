import { useFormContext } from "react-hook-form";
import { useCustomJoin } from "../hooks/useCustomJoin";
import styles from "@member/components/_join-form.module.scss"; 
import type { JoinFormDTO } from "../types/joinDTO";

export default function JoinAgreeForm() {
  // 전역 단계 관리
  const { setStep } = useCustomJoin();

  // react-hook-form 설정 (자식 컴포넌트용)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState : { errors },
  } = useFormContext<JoinFormDTO>();

  // 전체 동의
  const watchCheck = watch(["isAgree","isPrivacyAgree","ageCheck"]);
  const allCheck = watchCheck.every(Boolean);
  const handleAllCheck = (e:React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("isAgree", checked);
    setValue("isPrivacyAgree", checked);
    setValue("ageCheck", checked);
  }


  // 이용약관 동의 register
  const isAgreeRegister = register(
      "isAgree", {
        required: "이용약관에 동의해야 가입이 가능합니다."
    });
  const isPrivacyAgreeRegister = register(
      "isPrivacyAgree", {
        required: "개인정보 수집 및 이용에 동의해야 가입이 가능합니다."
    });
  const ageCheckRegister = register(
    "ageCheck", {
      required: "만 14세 이상만 가입 가능합니다."
  });

  // 약관 동의사항 & 만 14세 이상 확인
	const handleAgreeCheck = () => {
    alert ("약관 동의 확인");
    setStep(2);
	}


  return (
  <section>

  {/* form 전체 box */}
  <div className={styles.formBox}>

    {/* 필수약관 전체 동의 */}
    <div className={styles.formRow}>
      <label htmlFor="allCheck">
        <h3>
          <input type="checkbox" id="allCheck" 
            checked={allCheck} onChange={handleAllCheck} /> 모두 동의합니다.
        </h3>
      </label>
    </div>

    {/* 약관 동의(필수) */}
    <section className={styles.formRow}>
      <h3>이용약관 동의 (필수)</h3>
      <div className={styles.isAgreeContent}>
        <dl>
          <dt>제1조 (목적)</dt> 
          <dd>
            본 약관은 TOPICK(이하 "서비스")이 제공하는 음식점 추천, 검색, 주문 및 기타 관련 서비스의 이용과 관련하여 서비스와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </dd>
          <dt>제2조 (용어의 정의)</dt> 
          <dd>
            1. 회원 : 본 약관에 동의하고 회원가입을 완료한 자
            2. 비회원 : 회원가입 없이 서비스를 이용하는 자
            3. 서비스 : TOPICK이 제공하는 음식점 추천, 검색, 주문 및 부가 기능
            4. 아이디 : 회원 식별 및 서비스 이용을 위하여 회원이 설정한 값
            5. 비밀번호 : 회원 본인 확인을 위하여 설정한 값
          </dd>
          <dt>제3조 (회원가입)</dt>
          <dd>
            1. 회원가입은 이용자가 본 약관에 동의하고 가입 신청을 완료한 후 서비스가 이를 승인함으로써 성립합니다.
            2. 이용자는 정확한 정보를 제공하여야 하며 타인의 정보를 도용하여 가입할 수 없습니다.
          </dd>
          <dt>제4조 (서비스 이용)</dt>
          <dd>
            1. 회원은 서비스가 제공하는 음식점 검색, 추천, 주문 기능 등을 이용할 수 있습니다.
            2. 서비스는 운영상 또는 기술상 필요에 따라 일부 기능을 변경하거나 중단할 수 있습니다.
          </dd>
          <dt>제5조 (회원의 의무)</dt>
          <dd>
            1. 회원은 아이디와 비밀번호를 안전하게 관리하여야 합니다.
            2. 회원은 관계 법령 및 본 약관을 준수하여야 합니다.
            3. 회원은 타인의 권리를 침해하거나 서비스 운영을 방해하는 행위를 하여서는 안 됩니다.
          </dd>
          <dt>제6조 (서비스 이용 제한)</dt>
          <dd>
            서비스는 다음의 경우 회원의 이용을 제한할 수 있습니다.
  
            1. 타인의 정보를 도용한 경우
            2. 서비스 운영을 방해한 경우
            3. 관계 법령 또는 본 약관을 위반한 경우
          </dd>
          <dt>제7조 (회원탈퇴)</dt>
          <dd>
            회원은 언제든지 회원탈퇴를 요청할 수 있으며 서비스는 관련 법령에 따라 회원 정보를 처리합니다.
          </dd>
          <dt>제8조 (면책)</dt>
          <dd>
            1. 서비스는 천재지변, 시스템 장애 등 불가항력으로 발생한 손해에 대하여 책임을 지지 않습니다.
            2. 회원의 귀책사유로 발생한 손해에 대해서는 책임을 지지 않습니다.
          </dd>
          <dt>제9조 (준거법)</dt>
          <dd>
            본 약관은 대한민국 법령에 따르며 서비스 이용과 관련한 분쟁은 관련 법령에 따른 관할 법원에서 해결합니다.
            본 약관은 2026년 6월 1일부터 적용됩니다.
          </dd>
        </dl>
      </div>
      <label htmlFor="isAgree">
        <input type="checkbox" id="isAgree" {...isAgreeRegister} /> 이용약관에 동의합니다.
      </label>
      <span className={styles.message}>{errors.isAgree?.message}</span>
    </section>

    {/* 개인정보 수집 및 이용 동의(필수) */}
    <section className={styles.formRow}>
      <h3>개인정보 수집 및 이용 동의(필수)</h3>
      <div className={styles.isAgreeContent}>
        <dl>
          <dd>TOPICK은 회원가입 및 서비스 제공을 위하여 아래와 같이 개인정보를 수집 및 이용합니다.</dd>
          <dt>1. 수집 항목</dt>
          <dd>
            필수항목
            * 아이디
            * 비밀번호(암호화 저장)
            * 이름
            * 이메일
            
            선택항목
            * 휴대전화번호
            * 성별
            * 생년월일
          </dd>
          <dt>2. 수집 목적</dt>
          <dd>
            * 회원 식별 및 본인 확인
            * 회원관리
            * 주문 및 서비스 제공
            * 고객 문의 대응
            * 서비스 개선
          </dd>
          <dt>3. 보유 및 이용기간</dt>
          <dd>
            회원 탈퇴 시까지 보관합니다.
            단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
          </dd>
          <dt>4. 동의 거부 권리</dt>
          <dd>
            이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
            단, 필수항목 수집에 동의하지 않을 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.
          </dd>
        </dl>
      </div>
      <label htmlFor="isPrivacyAgree">
        <input type="checkbox" id="isPrivacyAgree" {...isPrivacyAgreeRegister} /> 개인정보 수집 및 이용에 동의합니다.
      </label>
      <span className={styles.message}>{errors.isPrivacyAgree?.message}</span>
    </section>
  
    {/* 나이 체크(필수) */}
    <section className={styles.formRow}>
      <h3>만 14세 이상 확인 (필수)</h3>
      <div className={styles.isAgreeContent}>
        <dl>
          <dd>[오늘의 식당] 사이트는 만 14세 이상부터 가입할 수 있습니다.</dd>
        </dl>
      </div>
      <label htmlFor="ageCheck">
        <input type="checkbox" id="ageCheck" {...ageCheckRegister} /> 만 14세 이상입니다.
      </label>
      <span className={styles.message}>{errors.ageCheck?.message}</span>
    </section>

  </div>

  {/* submit 버튼 */}
  <div className={styles.buttonBox}>
    <button type="button" className={styles.nextButton}
      onClick={handleAgreeCheck}>다음</button>
  </div>

	</section>
  );

} //JoinAgreeForm()