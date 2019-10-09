<template>
  <div class="reset-password">
    <logo-header />

    <div id="container">
      <h3
        v-if="result"
        class="reset-password-title"
      >
        {{ $t('member.resetPasswordSuccess.subject') }}
      </h3>
      <h3
        v-if="!result"
        class="reset-password-title"
      >
        {{ $t('member.resetPasswordSuccess.description.timeEnd') }}
      </h3>
      <img
        v-if="result"
        src="~@/assets/images/mobile/ic-join-char.png"
        class="progress-image"
      >
      <img
        v-if="!result"
        src="~@/assets/images/mobile/ic-join-retry.png"
        class="progress-img"
      >
      <p
        v-if="result"
        class="reset-password-message"
        v-html="$t('member.resetPasswordSuccess.description.content')"
      >
      </p>
      <p
        v-if="!result"
        class="reset-password-message"
        v-html="$t('member.resetPasswordSuccess.description.restart')"
      >
      </p>
      <div class="bottom-button">
        <app-button
          type="success"
          @click="goLogin"
          bold
        >
          {{ result ? $t('button.login') : $t('button.reSend') }}
        </app-button>
      </div>
    </div>

    <copyright-footer />
  </div>
</template>

<script>
import LogoHeader from '@/components/mobile/layout/header/LogoHeader'
import CopyrightFooter from '@/components/mobile/layout/footer/CopyrightFooter'
import AppButton from '@/components/mobile/common/button/Button'

export default {
  name: 'ResetPasswordSuccess',
  components: {
    LogoHeader,
    CopyrightFooter,
    AppButton
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
  }
}
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  padding: 3.2rem 2rem 0;
  text-align: center;
  min-height: calc(100vh - 10.8rem);
}

.input-row {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.input-error {
  margin-top: 0.8rem;
  color: #ff414e;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
}
.progress-image {
  width: 13.4rem;
}

.progress-img {
  width: 15.4rem;
}

.reset-password {
  &-title {
    text-align: center;
    font-size: 1.8rem;
    font-family: 'Noto Sans KR';
    font-weight: bold;
    letter-spacing: -0.01rem;
    margin-bottom: 3.6rem;
  }

  &-message {
    margin-top: 2.4rem;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    line-height: 1.5;
    color: #333;
  }

  &-button {
    margin-top: 3.8rem;
  }

  .bottom-button {
    position: absolute;
    left: 2rem;
    bottom: 2rem;
    width: calc(100% - 4rem);
  }
}
</style>
