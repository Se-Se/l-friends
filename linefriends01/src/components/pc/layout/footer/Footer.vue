<template>
  <footer class="footer" v-scroll="scrollHandler">
    <a href="#" class="footer-up" v-if="show">{{ $t('footer.up') }}</a>
    <layout-width>
      <div class="footer-content">
        <div class="footer-left">
          <ul class="footer-left__list">
            <li class="footer-left__item">
              <router-link to="/policy/terms">{{ $t('menu.terms') }}</router-link>
            </li>
            <li class="footer-left__item bold">
              <router-link to="/policy/privacy">{{ $t('menu.privacyPolicy') }}</router-link>
            </li>
            <li class="footer-left__item">
              <a href="https://www.linefriends.com/" target="_blanck">{{ $t('menu.intro') }}</a>
            </li>
            <li class="footer-left__item">
              <a href="https://www.linefriends.com/partnership.do?lang=ko" target="_blanck">{{ $t('menu.contact') }}</a>
            </li>
            <li class="footer-left__item">
              <router-link to="/notice/list">{{ $t('menu.notice') }}</router-link>
            </li>
            <li v-if="!isPCDevice" class="footer-left__item">
              <a href="#" @click.prevent.stop="SET_DEVICE_MODE('mobile')">{{ $t('device.mobileVersion') }}</a>
            </li>
          </ul>
        </div>
        <div class="footer-right">
          <div class="footer-right__info">
            <p>
              {{ $t('mall.companyName') }} {{ mallInfo.companyName }} | {{ $t('mall.businessRegistrationNo') }} {{ businessRegistrationNo }}<br />
              {{ $t('mall.onlineMarketingBusinessDeclarationNo') }} {{ mallInfo.onlineMarketingBusinessDeclarationNo }} | {{ $t('mall.ceo') }} {{ mallInfo.representativeName }}<br />
              {{ $t('mall.address') }} {{ mallInfo.address + ' ' + mallInfo.addressDetail }} | {{ $t('mall.hosting') }} {{ mallInfo.companyName }}<br />
              {{ $t('mall.email') }} {{ mallInfo.representEmail }} | {{ $t('mall.contact') }} {{ mallInfo.representPhoneNo }}
            </p>
          </div>

          <ul class="footer-right__sns">
            <li class="footer-right__sns--item">
              <a href="https://www.instagram.com/linefriends_kr/" target="_blank" class="ic-instagram">
                <img src="~@/assets/images/common/sns/instagram.svg" alt="인스타그램">
              </a>
            </li>
            <li class="footer-right__sns--item">
              <a href="https://twitter.com/_LINEFRIENDS" target="_blank" class="ic-twiiter">
                <img src="~@/assets/images/common/sns/twitter.svg" alt="트위터">
              </a>
            </li>
            <li class="footer-right__sns--item">
              <a href="https://www.facebook.com/linefriendskr/" target="_blank" class="ic-facebook">
                <img src="~@/assets/images/common/sns/facebook.svg" alt="페이스북">
              </a>
            </li>
            <li class="footer-right__sns--item">
              <a href="https://www.youtube.com/channel/UCI5adX4NHKtAk4P_Cofxtcw" target="_blank" class="ic-youtube">
                <img src="~@/assets/images/common/sns/youtube.svg" alt="유튜브">
              </a>
            </li>
          </ul>
          <div class="footer-right__copy">
            <p>ⓒ LINE FRIENDS</p>
          </div>
        </div>
      </div>
    </layout-width>
    <popConnectUs v-if="popConnectUs" @closePop="closePop" />
  </footer>
</template>

<script>
import * as $ from 'jquery'
import { addClass, removeClass, isPCDevice } from '@/utils/utils'
import LayoutWidth from '../common/LayoutWidth'
import { mapState, mapMutations } from 'vuex'
import popConnectUs from '@/components/pc/pages/etc/ConnectUs'

export default {
  name: 'Footer',
  components: {
    LayoutWidth,
    popConnectUs
  },
  data () {
    return {
      show: false,
      popConnectUs: false,
      bodyScrollTop: 0,
      isPCDevice: isPCDevice()
    }
  },
  methods: {
    ...mapMutations('common', ['SET_DEVICE_MODE']),
    scrollToTop () {
      $('html, body').animate({ scrollTop: 0 })
    },
    scrollHandler () {
      this.show = $(window).scrollTop() > 0
    },
    openPop () {
      this.popConnectUs = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
    },
    closePop () {
      this.popConnectUs = false
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
    }
  },
  computed: {
    ...mapState('common', ['malls']),
    mallInfo () {
      return this.malls ? this.malls.serviceBasicInfo : {}
    },
    businessRegistrationNo () {
      if (!this.mallInfo.businessRegistrationNo) {
        return ''
      }

      return this.mallInfo.businessRegistrationNo.substr(0, 3) + '-' +
        this.mallInfo.businessRegistrationNo.substr(3, 2) + '-' +
        this.mallInfo.businessRegistrationNo.substr(5)
    }
  }
}
</script>
