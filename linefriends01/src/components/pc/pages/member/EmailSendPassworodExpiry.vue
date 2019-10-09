<template>
  <div class="email-send-password-success">
    <eamil-header-wrap />
    <div class="email-send-password__title">
      <member-title title="비밀번호 재설정  링크 만료" />
    </div>
    <div>
      <member-layout>
        <figure class="email-send-password-success__fig">
          <img
            src="~@/assets/images/pc/icons/ic-join-setting.png"
            alt="Line Friends"
            title="Line Friends"
            style="width:100%;"
          >
        </figure>
        <p class="email-send-password-success__info">
          계정 보안을 위해 온라인 스토어에서<br>다시 진행해주세요.
        </p>
        <div class="email-send-password-success__btn">
          <button
            type="button"
            class="join-btn"
          >
            다시 보내기
          </button>
        </div>
      </member-layout>
      <member-footer />
    </div>
  </div>
</template>
<script>
import EamilHeaderWrap from '../../layout/header/EmailHeader'
import MemberTitle from '../../member/MemberTitle'
import MemberLayout from '../../member/MemberLayout'
import MemberFooter from '../../member/MemberFooter'

export default {
  name: 'EmailSendPasswordExpiry',
  components: {
    EamilHeaderWrap,
    MemberTitle,
    MemberLayout,
    MemberFooter
  }
}
</script>
