<template>
  <footer
    v-show="!$route.meta.hideFooter"
    class="footer"
  >
    <scroll-top />
    <nav>
      <ul class="footer-nav">
        <li class="footer-nav__item">
          <router-link to="/policy/terms">{{ $t('menu.terms') }}</router-link>
        </li>
        <li class="footer-nav__item">
          <router-link to="/policy/privacy">{{ $t('menu.privacyPolicy') }}</router-link>
        </li>
        <li class="footer-nav__item">
          <a
            href="https://www.linefriends.com/"
            target="_blank"
          >
            {{ $t('menu.intro') }}
          </a>
        </li>
        <li class="footer-nav__item">
          <a
            href="https://www.linefriends.com/partnership.do?lang=ko"
            target="_blank"
          >
            {{ $t('menu.contact') }}
          </a>
        </li>
        <li class="footer-nav__item">
          <router-link to="/notice/list">{{ $t('menu.notice') }}</router-link>
        </li>
        <li class="footer-nav__item">
          <a href="#" @click.prevent.stop="SET_DEVICE_MODE('pc')">{{ $t('device.pcVersion') }}</a>
        </li>
      </ul>
    </nav>
    <!--<p class="footer-pc">
      <a href="#" @click.prevent.stop="SET_DEVICE_MODE('pc')">{{ $t('device.pcVersion') }}</a>
    </p>-->
    <p class="footer-info">
      <span class="footer-info__company">{{ $t('mall.companyName') }} : {{ mallInfo.companyName }}</span><br>
      <span class="footer-info__company-no">{{ $t('mall.businessRegistrationNo') }} : {{ businessRegistrationNo }}</span><br>
      <span class="footer-info__mailorder-no">{{ $t('mall.onlineMarketingBusinessDeclarationNo') }} : {{ mallInfo.onlineMarketingBusinessDeclarationNo }}</span><br>
      <span class="footer-info__ceo">{{ $t('mall.ceo') }} : {{ mallInfo.representativeName }}</span><br>
      <span class="footer-info__address"><address>{{ $t('mall.address') }} : {{ mallInfo.address + ' ' + mallInfo.addressDetail }}</address></span><br>
      <span class="footer-info__hosting">{{ $t('mall.hosting') }} : {{ mallInfo.companyName }}</span><br>
      <span class="footer-info__email">{{ $t('mall.email') }} : {{ mallInfo.representEmail }}</span><br>
      <span class="footer-info__contact">{{ $t('mall.contact') }} : {{ mallInfo.representPhoneNo }}</span>
    </p>
    <ul class="footer-sns">
      <li class="footer-sns__item">
        <a
          href="https://www.instagram.com/linefriends_kr/"
          target="_blank"
          class="ic-instagram"
        >
          <img
            src="~@/assets/images/common/sns/instagram.svg"
            alt="instagram"
          >
        </a>
      </li>
      <li class="footer-sns__item">
        <a
          href="https://twitter.com/_LINEFRIENDS"
          target="_blank"
          class="ic-twitter"
        >
          <img
            src="~@/assets/images/common/sns/twitter.svg"
            alt="twitter"
          >
        </a>
      </li>
      <li class="footer-sns__item">
        <a
          href="https://www.facebook.com/linefriendskr/"
          target="_blank"
          class="ic-facebook"
        >
          <img
            src="~@/assets/images/common/sns/facebook.svg"
            alt="facebook"
          >
        </a>
      </li>
      <li class="footer-sns__item">
        <a
          href="https://www.youtube.com/channel/UCI5adX4NHKtAk4P_Cofxtcw"
          target="_blank"
          class="ic-youtube"
        >
          <img
            src="~@/assets/images/common/sns/youtube.svg"
            alt="youtube"
          >
        </a>
      </li>
    </ul>
    <p class="footer-copyright">
      ⓒ LINE FRIENDS
    </p>
  </footer>
</template>

<script>
import ScrollTop from './ScrollTop'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Footer',
  components: { ScrollTop },
  computed: {
    ...mapMutations('common', ['SET_DEVICE_MODE']),
    ...mapState('common', ['malls']),
    mallInfo () {
      return this.malls ? this.malls.serviceBasicInfo : {}
    },
    businessRegistrationNo () {
      if (!this.mallInfo.businessRegistrationNo) {
        return ''
      }
      return this.mallInfo.businessRegistrationNo.substr(0, 3) + '-' + this.mallInfo.businessRegistrationNo.substr(3, 2) + '-' + this.mallInfo.businessRegistrationNo.substr(5)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  height: 37.1rem;
  padding: 2.4rem 0 2.7rem 1.9rem;
  background: #3d485e;

  &-nav {
    display: flex;
    flex-flow: wrap;

    &__item {
      color: rgba(255,255,255,0.4);
      font-family: 'Noto Sans KR';
      font-weight: normal;
      font-size: 1.2rem;
      line-height: 1.8rem;
      letter-spacing: -0.005rem;

      &:not(:last-child)::after {
        content: '';
        display: inline-block;
        width: 0.1rem;
        height: 1rem;
        background: rgba(255,255,255,0.1);
        margin: 0.4rem 0.716rem;
        vertical-align: top;
      }
    }
  }

  &-pc {
    margin-top: 0.8rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.2rem;
    line-height: 1.8rem;
    color: rgba(255,255,255,0.4)
  }

  &-info {
    width: 33.5rem;
    box-sizing: content-box;
    margin-top: 2.4rem;
    padding-bottom: 2.9rem;
    border-bottom: 0.1rem solid rgba(255,255,255,0.08);
    height: 16.2rem;
    font-size: 1.2rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: 1.85rem;
    letter-spacing: -0.01rem;
    color: rgba(255,255,255,0.4);

    address {
      display: inline;
    }
  }

  &-sns {
    margin-left: -0.2rem;
    margin-top: 1.2rem;
    display: flex;

    &__item {
      width: 2.4rem;
      height: 2.4rem;
      margin-right: 1.6rem;

      img {
        width: 100%;
        opacity: 0.4;
      }
    }
  }

  &-copyright {
    margin-top: 1.3rem;
    font-size: 1.3rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: 1.8rem;
    letter-spacing: -0.06rem;
    color: rgba(255,255,255,0.4);
  }
}
</style>
