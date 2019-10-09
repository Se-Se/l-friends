<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <member-title :title="$t('auth.login')" />
        <member-item />
        <div class="login-input">
          <input-item :data="login.email" v-model="login.email.value" @keyup.enter.native="loginAction" />
        </div>
        <div class="login-input">
          <input-item :data="login.password" v-model="login.password.value" @keyup.enter.native="loginAction"/>
        </div>
        <div class="member-chk">
          <member-layout>
            <switch-item
              type="checkbox"
              name="idSave"
              :title="$t('member.login.saveId')"
              :value="saveId"
              @input="setSaveId"
            />
            <router-link
              class="member-link"
              to="/member/find/password"
            >
              {{ $t('member.login.forgotPassword') }}
            </router-link>
          </member-layout>
        </div>
        <member-layout>
          <div class="member-interval">
            <default-button
              :data="form.login"
              event="login"
              @click="loginAction"
            />
          </div>
        </member-layout>
        <member-layout>
          <div class="member-sns">
            <sns-login @connect="snsConnect"/>
          </div>
        </member-layout>
        <member-layout>
          <div class="member-join">
            <p class="member-join__title">
              {{ $t('member.login.useFirst') }}
            </p>
            <router-link
              to="/member/join"
              class="member-join__action"
            >
              {{ $t('member.login.join' )}}
            </router-link>
          </div>
        </member-layout>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import InputItem from '../../assets/Input'
import SwitchItem from '../../assets/Switch'
import DefaultButton from '../../assets/buttons/DefaultButton'
import LayerPopup from '../../layout/common/LayerPopup'

import MemberTitle from '../../member/MemberTitle'
import MemberItem from '../../member/MemberItem'
import MemberLayout from '../../member/MemberLayout'
import SnsLogin from '../../auth/SNSLogin'

import Login from '@/components/mixins/member/Login'

export default {
  name: 'Login',
  mixins: [Login],
  components: {
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MemberItem,
    MemberTitle,
    InputItem,
    SwitchItem,
    DefaultButton,
    SnsLogin,
    LayerPopup,
    MemberLayout
  },
  methods: {
    setSaveId (checked) {
      this.saveId = checked
    }
  }
}
</script>
