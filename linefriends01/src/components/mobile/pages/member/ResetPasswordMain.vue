<template>
  <div class="reset-password-main">
    <logo-header />

    <div id="container">
      <h3 class="reset-password-title">
        비밀번호 재설정
      </h3>
      <img
        src="~@/assets/images/mobile/progress.jpg"
        class="progress-image"
      >
      <p class="reset-password-message">
        <strong>abcabc@linefriends.com</strong> 님<br>
        비밀번호를 재설정이 요청되었습니다.<br>
        아래 링크에서 새 비밀번호를 등록하세요.
      </p>
      <div class="reset-password-button">
        <app-button
          type="success"
          bold
        >
          비밀번호 재설정 하기
        </app-button>
      </div>
      <p class="reset-password-description">
        링크는 24시간 동안 비밀번호 재설정까지만 유효합니다.<br>
        비밀번호 재설정 요청을 하지 않은 경우<br>
        본 이메일을 무시해주세요.<br>
        어떠한 변경 사항도 적용되지 않습니다.
      </p>
    </div>

    <mail-footer />
  </div>
</template>

<script>
import LogoHeader from '@/components/mobile/layout/header/LogoHeader'
import MailFooter from '@/components/mobile/layout/footer/MailFooter'
import AppButton from '@/components/mobile/common/button/Button'

export default {
  name: 'ResetPasswordMain',
  components: {
    LogoHeader,
    MailFooter,
    AppButton
  }
}
</script>

<style lang="scss" scoped>
#container {
  min-height: calc(100vh - 23.2rem);
  padding: 4.1rem 2rem 8rem;
  text-align: center;
}

.progress-image {
  width: 17.2rem;
}

.reset-password {
  &-title {
    font-size: 1.8rem;
    font-family: 'Noto Sans KR';
    font-weight: bold;
    letter-spacing: -0.01rem;
    margin-bottom: 3.233rem;
  }

  &-message {
    width: 28rem;
    margin: 2.4rem auto 0;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    line-height: 1.5;
    color: #333;

    strong {
      word-break: break-all;
      font-family: Volte, sans-serif;
      font-size: 2rem;
      font-weight: 600;
      color: #00d664;
      line-height: 1.1;
    }
  }

  &-description {
    margin-top: 2rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #999;
  }

  &-button {
    margin-top: 4rem;
  }
}
</style>
