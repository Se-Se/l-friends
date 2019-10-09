<template>
  <div class="email-send-password">
    <eamil-header-wrap />
    <div class="email-send-password__title">
      <member-title :title="$t('page.member.resetPassword')" />
    </div>
    <div>
      <member-layout>
        <div class="email-send-password__input">
          <input-item :data="input.password" v-model="password" :error="error.password" @blur="validationCheck" />
        </div>
        <div class="email-send-password__input">
          <input-item :data="input.passwordRechk" v-model="passwordConfirm" :error="error.passwordConfirm" @blur="validationCheck" />
        </div>
        <p
          v-if="error.password"
          class="join-error"
        >
          {{ error.password }}
        </p>
        <p
          v-if="error.passwordConfirm"
          class="join-error"
        >
          {{ error.passwordConfirm }}
        </p>
        <div class="join-interval">
          <button
            type="button"
            class="join-btn"
            @click="editPasswordAction"
          >
            {{ $t('button.next') }}
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
import InputItem from '../../assets/Input'
import MemberLayout from '../../member/MemberLayout'
import MemberFooter from '../../member/MemberFooter'

import ResetPasswordResult from '@/components/mixins/member/ResetPasswordResult'

export default {
  name: 'ResetPasswordResult',
  mixins: [ResetPasswordResult],
  components: {
    EamilHeaderWrap,
    MemberTitle,
    InputItem,
    MemberLayout,
    MemberFooter
  },
  data () {
    return {
      email: '',
      input: {
        password: {
          model: '',
          type: 'password',
          placeholder: this.$t('member.resetPassword.placeholder.password'),
          interval: false,
          reChk: true,
          max: 20
        },
        passwordRechk: {
          model: '',
          type: 'password',
          placeholder: this.$t('member.resetPassword.placeholder.passwordConfirm'),
          interval: false,
          reChk: true,
          max: 20
        }
      }
    }
  }
}
</script>
