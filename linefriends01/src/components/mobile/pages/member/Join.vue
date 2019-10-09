<template>
  <div class="join-page">
    <sub-page-header :title="$t('auth.join')" />
    <div id="container">
      <div class="input-row">
        <app-label target="id">
          {{ $t('member.join.title.email') }}
        </app-label>
        <app-input
          id="id"
          v-model="email"
          type="text"
          size="large"
          :placeholder="$t('member.join.placeholder.email')"
          :error="error.email"
          @blur="mobileJoinFlow"
        />
        <p
          v-if="error.email"
          class="input-error"
        >
          {{ error.email }}
        </p>
        <p v-else class="input-error">&nbsp;</p>
      </div>
      <div class="input-row">
        <app-label target="password">
          {{ $t('member.join.title.password') }}
        </app-label>
        <app-input
          id="password"
          v-model="password"
          type="password"
          size="large"
          :max="20"
          :placeholder="$t('member.join.placeholder.password')"
          :error="error.password"
          no-hint
          @blur="mobileJoinFlow"
        />
        <p
          v-if="error.password"
          class="input-error"
        >
          {{ error.password }}
        </p>
        <p v-else class="input-error">&nbsp;</p>
      </div>
      <div class="input-row">
        <app-label target="password-confirm">
          {{ $t('member.join.title.passwordConfirm') }}
        </app-label>
        <app-input
          id="password-confirm"
          v-model="passwordConfirm"
          type="password"
          size="large"
          :max="20"
          :placeholder="$t('member.join.placeholder.passwordConfirm')"
          :error="error.passwordConfirm"
          no-hint
          @blur="mobileJoinFlow"
        />
        <p
          v-if="error.passwordConfirm"
          class="input-error"
        >
          {{ error.passwordConfirm }}
        </p>
        <p v-else class="input-error">&nbsp;</p>
      </div>
    </div>

    <bottom-fixed>
      <app-button
        type="success"
        @click="signUp"
        bold
      >{{ $t('button.next') }}</app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AppLabel from '@/components/mobile/common/form/Label'

import Join from '@/components/mixins/member/Join'

export default {
  name: 'Join',
  components: {
    SubPageHeader,
    BottomFixed,
    AppButton,
    AppInput,
    AppLabel
  },
  mixins: [Join],
  methods: {
    mobileJoinFlow () {
      this.validationCheck().then(() => {
        this.marketing = this.$route.query.marketing
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 2rem 2rem 0;
}

.input-row {
  margin-bottom: 1rem;
}

.input-error {
  margin-top: 0.8rem;
  color: #ff414e;
  font-family: 'Noto Sans KR';
  font-weight: 500;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
}
</style>
