<template>
  <div>
    <header-wrap />
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <member-title :title="$t('member.joinSendEmail.subject')" />
        <member-item />
        <member-layout>
          <div class="email-send-success">
            <figure class="email-send-success__fig">
              <img src="~@/assets/images/pc/icons/ic-join-setting.jpg">
            </figure>
            <div class="email-send-success__content">
              <p class="email-send-success__content-title">
                <strong>{{ $route.query.email }}</strong> {{ $t('member.joinSendEmail.description.to') }}
              </p>
              <p class="email-send-success__content-description">
                {{ $t('member.joinSendEmail.description.send') }}
              </p>
              <p class="email-send-success__content-subtitle">
                {{ $t('member.joinSendEmail.description.content1') }}
              </p>
            </div>
            <div class="email-send-success__footer">
              <default-button :data="form.home" style="width:100%" />
            </div>
          </div>
        </member-layout>
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

  import MemberTitle from '../../member/MemberTitle'
  import MemberItem from '../../member/MemberItem'
  import MemberLayout from '../../member/MemberLayout'

  export default {
    name: 'JoinSendEmail',
    components: {
      FooterWrap,
      HeaderWrap,
      LayoutWidth,
      MainWrapper,
      BreadCrumbs,
      MemberItem,
      MemberTitle,
      MemberLayout,
      DefaultButton
    },
    data () {
      return {
        basicCrumbs: '홈',
        form: {
          home: {
            action: 'link',
            to: '/',
            title: this.$t('button.goHome'),
            type: 'half',
            active: true
          }
        }
      }
    }
  }
</script>
