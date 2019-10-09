<template>
  <div class="password-confirm">
    <sub-page-header :title="$t('mypage.profile.subjectPasswordConfirm')" />

    <div id="container">
      <div>
        <div class="input-row">
          <app-label :style="{ fontSize: '1.4rem' }">
            {{ $t('mypage.profile.title.email') }}
          </app-label>
          <span class="user-email">
            {{ memberId }}
          </span>
        </div>
        <div class="input-row">
          <app-label
            :style="{ fontSize: '1.4rem' }"
            target="password"
          >
            {{ $t('mypage.profile.title.passwordPasswordConfirm') }}
          </app-label>
          <app-input
            id="password"
            size="large"
            type="password"
            v-model="password"
            :max="20"
            no-hint
          />
          <p
            v-if="error"
            class="input-error"
          >
            {{ error }}
          </p>
        </div>
      </div>
      <div class="button-list">
        <app-button
          @click="goHome"
        >
          {{ $t('button.cancel') }}
        </app-button>
        <app-button
          type="success"
          @click="action"
        >
          {{ $t('button.ok') }}
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppFooter from '@/components/mobile/layout/footer/Footer'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import AppLabel from '@/components/mobile/common/form/Label'

import PasswordConfirm from '@/components/mixins/mypage/PasswordConfirm'

export default {
  name: 'PasswordConfirm',
  mixins: [PasswordConfirm],
  components: {
    SubPageHeader,
    AppFooter,
    AppInput,
    AppButton,
    AppLabel
  },
  data () {
    return {
      password: '',
      error: ''
    }
  },
  methods: {
    action () {
      this.authProfile(this.password)
    },
    submit () {
      this.error = this.$t('member.passwordConfirm.error.password')
    },
    goHome () {
      this.$router.push({ path: '/mypage' })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  padding: 3.2rem 2rem 0;
}

.input-row {
  &:not(:last-child) {
    margin-bottom: 3.2rem;
  }
}

.user-email {
  display: inline-block;
  margin-top: 0.4rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #333;
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

.button-list {
  position: absolute;
  bottom: 4rem;
  left: 2rem;
  right: 2rem;
  display: flex;
  justify-content: space-between;

  > * {
    width: 48.959%;
  }
}
</style>
