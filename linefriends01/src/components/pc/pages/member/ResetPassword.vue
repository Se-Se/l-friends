<template>
  <div>
    <header-wrap />
    <main-wrapper>
      <layout-width>
        <min-height-layout>
          <bread-crumbs
            :basic="basicCrumbs"
          />
          <white-space>
            <member-title :title="$t('member.resetPassword.subject')" />
            <member-item />
            <input-item
              class="email"
              :data="login.email"
              v-model="email"
              @keyup.enter.native="validationCheck"
            />
            <member-layout>
              <p
                v-if="error.email"
                class="join-error"
              >
                {{ error.email }}
              </p>
              <button
                type="button"
                class="join-btn join-btn__interval"
                @click="validationCheck"
              >
                {{ $t('button.next') }}
              </button>
            </member-layout>
          </white-space>
        </min-height-layout>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import HeaderWrap from '../../layout/header/Header'
import FooterWrap from '../../layout/footer/Footer'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import InputItem from '../../assets/Input'
import MinHeightLayout from '../../layout/common/MinHeightContent'
import WhiteSpace from '../../layout/common/WhiteSpace'

import MemberTitle from '../../member/MemberTitle'
import MemberItem from '../../member/MemberItem'
import MemberLayout from '../../member/MemberLayout'

import ResetPassword from '@/components/mixins/member/ResetPassword'

export default {
  name: 'PasswordReset',
  mixins: [ResetPassword],
  components: {
    FooterWrap,
    HeaderWrap,
    LayoutWidth,
    BreadCrumbs,
    MainWrapper,
    MemberItem,
    MemberTitle,
    InputItem,
    MemberLayout,
    MinHeightLayout,
    WhiteSpace
  },
  data () {
    return {
      basicCrumbs: this.$t('page.home'),
      login: {
        email: {
          type: 'text',
          placeholder: this.$t('member.resetPassword.placeholder.email'),
          interval: false,
          title: this.$t('member.resetPassword.title.email')
        }
      }
    }
  }
}
</script>
