<template>
  <div class="email-send-password-success">
    <eamil-header-wrap />
    <div 
      v-if="result"    
      class="email-send-password__title"
    >
      <member-title :title="$t('member.resetPasswordSuccess.subject')" />
    </div>
    <div
      v-if="!result" 
      class="email-send-password__title"
    >
      <member-title :title="$t('member.resetPasswordSuccess.description.timeEnd')" />
    </div>
    <div>
      <member-layout>
        <figure
          v-if="result"
          class="email-send-password-success__fig"
        >
          <img
            src="~@/assets/images/pc/icons/ic-join-char.png" 
            alt="Line Friends"
            title="Line Friends"
            style="width:100%;"
          >
        </figure>
        <figure
          v-if="!result"
          class="email-send-password-success__figure"
        >
          <img
            src="~@/assets/images/pc/icons/ic-join-retry.png" 
            alt="Line Friends"
            title="Line Friends"
            style="width:100%;"
          >
        </figure>
        <p
          v-if="result"
          class="email-send-password-success__info"
          v-html="$t('member.resetPasswordSuccess.description.content')"
        >
        </p>
        <p
          v-if="!result"
          class="email-send-password-success__info"
          v-html="$t('member.resetPasswordSuccess.description.restart')"
        >
        </p>
        <div class="email-send-password-success__btn">
          <button
            type="button"
            class="join-btn"
            @click="goLogin"
          >
            {{ result ? $t('button.login') : $t('button.reSend') }}
          </button>
        </div>
      </member-layout>
      <member-footer />
    </div>
  </div>
</template>
<script>
import MemberFooter from '../../member/MemberFooter'
import EamilHeaderWrap from '../../layout/header/EmailHeader'
import MemberTitle from '../../member/MemberTitle'
import MemberLayout from '../../member/MemberLayout'

export default {
  name: 'ResetPasswordSuccess',
  components: {
    EamilHeaderWrap,
    MemberTitle,
    MemberLayout,
    MemberFooter
  },
  data () {
    return {
      result: true
    }
  },
  methods: {
    goLogin () {
      this.$router.push({ path: '/member/login' })
    }
  },
  beforeMount () {
    window.addEventListener('popstate', () => {
      window.location.href = '/'
    }, false)
    var state = {url: '#'}
    window.history.pushState(state, null, '#')
  }
}
</script>
