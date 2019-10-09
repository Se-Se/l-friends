<template>
  <div class="reset-password">
    <logo-header />

    <div id="container">
      <h3 class="reset-password-title">
        {{ $t('page.member.resetPassword') }}
      </h3>
      <div class="reset-password-inputs">
        <div class="input-row">
          <app-input
            id="password"
            v-model="password"
            type="password"
            size="large"
            :placeholder="$t('member.resetPassword.placeholder.password')"
            :error="error.password"
            :max="20"
            @blur="validationCheck"
          />
          <p
            v-if="error.password"
            class="input-error"
          >
            {{ error.password }}
          </p>
        </div>
        <div class="input-row">
          <app-input
            id="password-confirm"
            v-model="passwordConfirm"
            type="password"
            size="large"
            :placeholder="$t('member.resetPassword.placeholder.passwordConfirm')"
            :error="error.passwordConfirm"
            :max="20"
            @blur="validationCheck"
          />
          <p
            v-if="error.passwordConfirm"
            class="input-error"
          >
            {{ error.passwordConfirm }}
          </p>
        </div>
      </div>
      <div class="bottom-button">
        <app-button
          type="success"
          @click="editPasswordAction"
          bold
        >
          {{ $t('button.next') }}
        </app-button>
      </div>
    </div>

    <copyright-footer />
  </div>
</template>

<script>
import LogoHeader from '@/components/mobile/layout/header/LogoHeader'
import CopyrightFooter from '@/components/mobile/layout/footer/CopyrightFooter'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'

import ResetPasswordResult from '@/components/mixins/member/ResetPasswordResult'

export default {
  name: 'ResetPasswordResult',
  mixins: [ResetPasswordResult],
  components: {
    LogoHeader,
    CopyrightFooter,
    AppInput,
    AppButton
  }
}
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  padding: 2rem 2rem 0;
  min-height: calc(100vh - 10.8rem);
}

.input-row {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.input-error {
  margin-top: 0.8rem;
  margin-bottom: 3.2rem;
  color: #ff414e;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
}

.reset-password {
  &-title {
    text-align: center;
    font-size: 1.8rem;
    font-family: 'Noto Sans KR';
    font-weight: bold;
    letter-spacing: -0.01rem;
    margin-bottom: 3.2rem;
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
