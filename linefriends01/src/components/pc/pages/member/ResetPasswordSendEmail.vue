<template>
  <div>
    <main-wrapper>
      <layout-width>
        <min-height-layout>
          <bread-crumbs />
          <white-space>
            <member-title :title="$t('member.resetPasswordSendEmail.subject')"/>
            <member-item />
            <member-layout>
              <div class="email-send-success">
                <figure class="email-send-success__fig">
                  <img src="~@/assets/images/pc/icons/ic-join-setting.jpg">
                </figure>
                <div class="email-send-success__content">
                  <p class="email-send-success__content-title">
                    <strong>{{ $route.query.email }}</strong>{{ $t('member.resetPasswordSendEmail.description.to') }}
                  </p>
                  <p class="email-send-success__content-description">
                    {{ $t('member.resetPasswordSendEmail.description.send') }}
                  </p>
                  <p class="email-send-success__content-subtitle">
                    {{ $t('member.resetPasswordSendEmail.description.content1') }}<br>
                    {{ $t('member.resetPasswordSendEmail.description.content2') }}<br>
                  </p>
                </div>
                <div class="email-send-success__footer">
                  <default-button :data="form.ok" @click="$router.push({ path: '/' })"/>
                </div>
              </div>
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
import DefaultButton from '../../assets/buttons/DefaultButton'
import MinHeightLayout from '../../layout/common/MinHeightContent'
import WhiteSpace from '../../layout/common/WhiteSpace'

import MemberTitle from '../../member/MemberTitle'
import MemberItem from '../../member/MemberItem'
import MemberLayout from '../../member/MemberLayout'

export default {
  name: 'ResetPasswordSendEmail',
  components: {
    FooterWrap,
    HeaderWrap,
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MemberItem,
    MemberTitle,
    MemberLayout,
    DefaultButton,
    MinHeightLayout,
    WhiteSpace
  },
  data () {
    return {
      form: {
        ok: {
          action: 'button',
          to: '',
          title: this.$t('button.goHome'),
          type: 'free',
          size: 360
        }
      }
    }
  }
}
</script>
