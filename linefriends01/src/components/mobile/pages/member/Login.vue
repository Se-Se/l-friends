<template>
  <div class="login">
    <sub-page-header :title="$t('auth.login')" />

    <div id="container">
      <div class="login-inputs">
        <div class="input-row">
          <app-input
            v-model="login.email.value"
            type="text"
            :placeholder="login.email.placeholder"
            size="large"
          />
        </div>
        <div class="input-row">
          <app-input
            v-model="login.password.value"
            type="password"
            :placeholder="login.password.placeholder"
            :max="20"
            no-hint
            size="large"
          />
        </div>
      </div>
      <div class="login-util">
        <app-checkbox v-model="saveId">
          <span class="save-id__label">{{ $t('member.login.saveId') }}</span>
        </app-checkbox>
        <router-link
          class="forgot-password"
          to="/member/find/password"
        >{{ $t('member.login.forgotPassword') }}</router-link>
      </div>
      <app-button
        type="success"
        @click="loginAction"
        bold
      >
        {{ $t('auth.login') }}
      </app-button>

      <sns-login
        @connect="snsConnect"
        :connect="getConnectSns"
      />

      <div class="join-guide">
        {{ $t('member.login.useFirst') }}
        <router-link
          to="/member/join/terms"
          class="join-guide__link"
        >{{ $t('member.login.join' )}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppInput from '@/components/mobile/common/input/Input'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import SnsLogin from '@/components/mobile/auth/SNSLogin'
import { Alert } from '@/utils/event-bus.js'

import Login from '@/components/mixins/member/Login'

export default {
  name: 'Login',
  components: {
    SubPageHeader,
    AppInput,
    AppCheckbox,
    AppButton,
    SnsLogin
  },
  mixins: [Login],
  data () {
    return {
      bus: new Vue()
    }
  },
  computed: {
    ...mapGetters('profile', ['getConnectSns'])
  },
  methods: {
    Error (msg) {
      Alert({
        title: this.$t('auth.login'),
        message: msg
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 2rem 2rem 0;
}

.input-row:not(:last-child) {
  margin-bottom: 1rem;
}

.login-util {
  margin: 1.2rem 0 3rem;
  display: flex;
  justify-content: space-between;

  .save-id__label {
    margin-left: 0.8rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.2rem;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #666;
  }

  .forgot-password {
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #4ba4d9;
  }
}

.join-guide {
  margin-top: 2rem;
  padding-bottom: 8rem;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  font-size: 1.4rem;
  text-align: center;
  line-height: 1.5;
  color: #999;
  letter-spacing: -0.01rem;

  &__link {
    color: #4ba4d9;
    font-weight: 500;
  }
}
</style>
