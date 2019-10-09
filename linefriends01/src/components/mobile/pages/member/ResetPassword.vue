<template>
  <div class="join-sended-email">
    <sub-page-header :title="$t('member.resetPassword.subject')" />

    <div id="container">
      <div class="input-row">
        <app-label target="id">
          {{ $t('member.resetPassword.title.email') }}
        </app-label>
        <app-input
          id="id"
          v-model="email"
          type="text"
          size="large"
          :placeholder="$t('member.resetPassword.placeholder.email')"
        />
        <p
          v-if="error.email"
          class="input-error"
        >
          {{ error.email }}
        </p>
      </div>
    </div>

    <bottom-fixed>
      <app-button
        type="success"
        @click="validationCheck"
        bold
      >
        {{ $t('button.next') }}
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AppLabel from '@/components/mobile/common/form/Label'

import ResetPassword from '@/components/mixins/member/ResetPassword'

export default {
  name: 'ResetPasswordRequest',
  mixins: [ResetPassword],
  components: {
    SubPageHeader,
    BottomFixed,
    AppButton,
    AppInput,
    AppLabel
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
