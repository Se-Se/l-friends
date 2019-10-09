<template>
  <footer class="footer">
    <p class="btn_top" v-if="show">
      <a href="#" @click="scrollToTop">TOP</a>
    </p>
    <div class="footer_top">
      <nav class="foot_nav">
        <ul>
          <li>
            <router-link to="/m/policy">利用規約</router-link>
          </li>
          <li>
            <a href="#">プライバシーポリシー</a>
          </li>
          <li>
            <a href="#">特定商取引法に基づく表示</a>
          </li>
          <li>
            <a href="#">ご利用ガイド</a>
          </li>
          <li>
            <router-link to="/m/etc/faq">サポート</router-link>
          </li>
          <li>
            <a @click.prevent="toPC">PC版表示</a>
          </li>
        </ul>
      </nav>
      <div class="link_area">
        <ul class="link_con">
          <li>
            <div class="link_name">LINE FRIENDS</div>
            <div class="link_img_area">
              <a href="https://line.me/R/ti/p/%40linecharacter">
                <img alt="" src="@/assets/img/icon/footer_line.png">
              </a>
              <a class="ml-12" href="https://twitter.com/JP_LINEFRIENDS">
                <img alt="" src="@/assets/img/icon/footer_twitter.png">
              </a>
              <a class="ml-12" href="https://www.facebook.com/linefriendsjp/">
                <img alt="" src="@/assets/img/icon/footer_facebook.png">
              </a>
              <a class="ml-12" href="https://www.instagram.com/linefriends_jp/">
                <img alt="" src="@/assets/img/icon/footer_insta.png">
              </a>
            </div>
          </li>
          <li>
            <div class="link_name">BT21</div>
            <div class="link_img_area">
              <a href="https://line.me/R/ti/p/%40bt21_jp">
                <img alt="" src="@/assets/img/icon/footer_line.png">
              </a>
              <a class="ml-12" href="https://twitter.com/BT21_Japan">
                <img alt="" src="@/assets/img/icon/footer_twitter.png">
              </a>
              <a class="ml-12" href="https://www.youtube.com/channel/UCINr5W7cwW06ADtsszAToAw">
                <img alt="" src="@/assets/img/icon/footer_youtube.png">
              </a>
            </div>
          </li>
        </ul>
      </div>
      <div class="copyright">
        <p>&copy; LINE FRIENDS</p>
        <p><a href=" https://www.linefriends.com/?lang=jp" target="_blank">LINE Friends Japan株式会社</a></p>
      </div>
    </div>
  </footer>
</template>
<script>
import * as $ from 'jquery'
import { setCookie } from '@/utils/utils'
export default {
  name: 'Footer',
  data () {
    return {
      show: false
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
    toPC () {
      let PCRouterPath = '/'
      switch (this.$route.name) {
        case 'Home':
          break
        case 'JoinPage':
          PCRouterPath = '/member/join'
          break
        case 'EditAddress':
          PCRouterPath = '/mypage/orderdetail/' + this.$route.params.orderNo
          break
        case 'OrderCancelDetail':
        case 'OrderReturnDetail':
          PCRouterPath = '/mypage/cancellist'
          break
        case 'AddReview':
          PCRouterPath = '/mypage/myreview'
          break
        case 'EditReview':
          PCRouterPath = '/mypage/myreview/reviewed'
          break
        case 'Package':
        case 'GoodsInquiryDetail':
          PCRouterPath = '/product/detail/' + this.$route.params.goodsNo
          break
        case 'Result':
          PCRouterPath = '/search?keyword=' + this.$route.query.keyword
          break
        default:
          PCRouterPath = this.$route.fullPath.replace('/m/', '/')
          break
      }
      setCookie('view_mode', 'PC')
      window.location.href = process.env.VUE_APP_PC_URL + PCRouterPath
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  }
}
</script>

<style>
</style>
