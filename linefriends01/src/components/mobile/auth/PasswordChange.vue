<template>
  <div>
    <div
      v-if="!change"
      class="input-group"
    >
      <app-input
        id="password"
        size="large"
        type="password"
        v-model="oldPassword"
        :readonly="true"
      />
      <app-button
        class="password-change-btn"
        type="secondary"
        @click="editPassword(true)"
      >
        {{ $t('button.edit') }}
      </app-button>
    </div>
    <div
      v-else
      class="password-change"
    >
      <div class="input-rows">
        <div class="input-row">
          <app-label>
            {{ $t('mypage.profile.title.oldPassword') }}
          </app-label>
          <app-input
            v-model="oldPassword"
            type="password"
            size="large"
            :max="20"
            no-hint
            @blur="validationCheck"
          />
          <p
            v-if="error.oldPassword"
            class="input-error"
          >
            {{ error.oldPassword }}
          </p>
        </div>
        <div class="input-row">
          <app-label>
            {{ $t('mypage.profile.title.newPassword') }}
          </app-label>
          <app-input
            v-model="password"
            type="password"
            size="large"
            no-hint
            :max="20"
            :placeholder="$t('mypage.profile.placeholder.password')"
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
          <app-label>
            {{ $t('mypage.profile.title.newPasswordConfirm') }}
          </app-label>
          <app-input
            v-model="passwordConfirm"
            type="password"
            size="large"
            no-hint
            :max="20"
            :placeholder="$t('mypage.profile.placeholder.password')"
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
      <div class="input-buttons">
        <app-button
          type="secondary"
          @click="editPassword(false)"
        >
          {{ $t('mypage.profile.button.cancel') }}
        </app-button>
        <app-button
          type="success"
          @click="editPasswordAction"
        >
          {{ $t('mypage.profile.button.passwordEdit') }}
        </app-button>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import AppLabel from '@/components/mobile/common/form/Label'

import PasswordChange from '@/components/mixins/mypage/PasswordChange'

export default {
  name: 'PasswordChange',
  components: {
    AppInput,
    AppButton,
    AppLabel
  },
  mixins: [PasswordChange],
  data () {
    return {
      change: false,
    }
  },
  methods: {
    editPassword (action) {
      if (action === false) {
        this.error = {}
        this.oldPassword = ''
        this.password = ''
        this.passwordConfirm = ''
      }
      this.change = action
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  display: flex;

  #password {
    width: calc(100% - 11.4rem);
  }

  .password-change-btn {
    width: 10.7rem;
    margin-left: 0.7rem;
  }
}

.input-rows {
  padding: 0.2rem 0 0;
}

.input-row {
  &:not(:last-child) {
    margin-bottom: 3.2rem;
  }
}

.input-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;

  > * {
    width: 48.9%;
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
</style>
