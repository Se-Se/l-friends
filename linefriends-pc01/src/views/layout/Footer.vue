<template>
  <footer class="footer" ref="footer">
    <p class="btn_top" v-if="show">
      <a href="#" @click="scrollToTop">TOP</a>
    </p>
    <div class="footer_inner">
      <div class="footer_top">
        <nav class="foot_nav">
          <ul>
            <li>
              <router-link to="/policy">利用規約</router-link>
            </li>
            <li>
              <router-link to="#">プライバシーポリシー</router-link>
            </li>
            <li>
              <a href="#">特定商取引法に基づく表示</a>
            </li>
            <li>
              <a href="#">ご利用ガイド</a>
            </li>
            <li>
              <router-link to="/etc/faq">サポート</router-link>
            </li>
            <li v-if="!isPCDevice">
              <a @click.prevent="toSP">mobile版表示</a>
            </li>
          </ul>
        </nav>
        <div class="sns cf">
          <dl>
            <dt>LINE FRIENDS</dt>
            <dd>
              <a target="_blank" class="ic-line" href="https://line.me/R/ti/p/%40linecharacter">
                <img src="@/assets/img/icon/sns-line.png" alt="">
              </a>
            </dd>
            <dd>
              <a target="_blank" class="ic-twiiter" href="https://twitter.com/JP_LINEFRIENDS">
                <img src="@/assets/img/icon/sns_twitter.png" alt="">
              </a>
            </dd>
            <dd>
              <a target="_blank" class="ic-facebook" href="https://www.facebook.com/linefriendsjp/">
                <img src="@/assets/img/icon/sns_facebook.png" alt="">
              </a>
            </dd>
            <dd>
              <a target="_blank" class="ic-instagram" href="https://www.instagram.com/linefriends_jp/">
                <img src="@/assets/img/icon/sns_instagram.png" alt="">
              </a>
            </dd>
          </dl>
          <dl>
            <dt>BT21</dt>
            <dd>
              <a target="_blank" class="ic-line" href="https://line.me/R/ti/p/%40bt21_jp">
                <img src="@/assets/img/icon/sns-line.png" alt="">
              </a>
            </dd>
            <dd>
              <a target="_blank" class="ic-twiiter" href="https://twitter.com/BT21_Japan">
                <img src="@/assets/img/icon/sns_twitter.png" alt="">
              </a>
            </dd>
            <dd>
              <a target="_blank" class="ic-youtube" href="https://www.youtube.com/channel/UCINr5W7cwW06ADtsszAToAw">
                <img src="@/assets/img/icon/sns_youtube.png" alt="">
              </a>
            </dd>
          </dl>
        </div>
        <div class="copyright">
          <p><a href=" https://www.linefriends.com/?lang=jp" target="_blank">LINE Friends Japan株式会社</a></p>
          <p>&copy; LINE FRIENDS</p>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import * as $ from 'jquery'
import { isPCDevice, setCookie } from '@/utils/utils'
export default {
  name: 'Footer',
  data () {
    return {
      show: false,
      isPCDevice: isPCDevice()
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollToTop () {
      $('html, body').animate({ scrollTop: 0 })
    },
    scrollHandler () {
      this.show = window.pageYOffset || document.documentElement.scrollTop > 0
    },
    toSP () {
      setCookie('view_mode', 'SP')
      window.location.href = process.env.VUE_APP_SP_URL + this.$route.fullPath
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
}
</script>

<style>
</style>
