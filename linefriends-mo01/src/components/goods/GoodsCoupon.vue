<template>
  <div class="btn_dow_area" v-if="compare && compare.length > 0">
    <div class="btn_dow" v-if="compare[0] && compare[0].discountInfo.fixedAmt !== true">
      <button class="btn btn_primary ico_dow size_xs" @click="toggleCouponPopup">クーポンダウンロード</button>
    </div>
    <div class="btn_dow" v-else>
      <button class="btn btn_primary ico_dow size_xs" @click="toggleCouponPopup">クーポンダウンロード</button>
    </div>
    <p class="coupon_price" v-if="compare && compare.length > 0">クーポン適用後の割引価格<span>￥{{afterCouponPrice}}</span></p>
    <div id="container" class="detail coupon_show coupon_page" ref="couponPopup" v-if="isCouponPopup">
      <template v-if="scrolled">
        <Header ref="theHeader" />
      </template>
      <sub-product-header :showClose="true" :title="'クーポンダウンロード'" @close="handleClose" />
      <div class="detail_wrapper">
        <div class="coupon_area_bg">
          <div class="coupon_area" v-if="compare">
            <div class="bx_coupon_con size_m" v-for="(coupon,index) in compare" :key="index">
              <template v-if="coupon.discountInfo.fixedAmt !== true">
                <a href="#" @click="downloadCoupon(coupon.couponNo)">
                  <strong class="tit">{{ coupon.couponName }}</strong>
                  <div class="bx_price">
                    <p><strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span></strong></p>
                  </div>
                  <span class="ico_download">Download coupon</span>
                </a>
                <div class="dsc_info">
                  <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}円以下で使用可能</span>
                  </template>
                  <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上でお使いいただけます</span>
                  </template>
                  <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}円以下で使用可能</span>
                  </template>
                  <span class="limit">{{ coupon.dateInfo.issueEndYmdt | dateFormatStr('yyyy.MM.dd') }} まで発行可能</span>
                </div>
              </template>
              <template v-else>
                <a href="#" @click="downloadCoupon(coupon.couponNo)">
                  <strong class="tit">{{ coupon.couponName }}</strong>
                  <div class="bx_price">
                    <p><strong class="number">{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt">円</span></strong></p>
                  </div>
                  <span class="ico_download">Download coupon</span>
                </a>
                <div class="dsc_info">
                  <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}円以下で使用可能</span>
                  </template>
                  <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上でお使いいただけます</span>
                  </template>
                  <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                    <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}円以下で使用可能</span>
                  </template>
                  <span class="limit">{{ coupon.dateInfo.issueEndYmdt | dateFormatStr('yyyy.MM.dd') }} まで発行可能</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../views/layout/Header.vue'
import { mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert } from '@/components/common/modal'
import { enablePageScroll } from 'scroll-lock'
import $ from 'jquery'
import { isLogin } from '@/utils/utils'
import { getStrDate } from '@/utils/dateUtils'
import SubProductHeader from '@/components/header/SubProductHeader'
export default {
  name: 'GoodsCoupon',
  props: ['goods'],
  data () {
    return {
      isCouponPopup: false,
      flag: false,
      lastPosition: 0,
      scrolled: true
    }
  },
  components: {
    SubProductHeader,
    Header
  },
  mounted () {

  },
  distoryed () {
    $('html,body').css({
      'overflow-x': '',
      'overflow-y': ''
    })
  },
  computed: {
    ...mapGetters('coupon', ['compare']),
    price () {
      if (this.goods) {
        return this.goods.price
      } else {
        return ''
      }
    },
    afterCouponPrice () {
      return (this.price.salePrice - this.price.couponDiscountAmt).toLocaleString()
    }
  },
  methods: {
    getStrDate,
    scrollHandler () {
      let st = $('.coupon_area_bg').scrollTop()
      if (st > this.lastPosition) {
        this.scrolled = false
      } else {
        this.scrolled = true
      }
      this.lastPosition = st <= 0 ? 0 : st
    },
    showHeader () {
      $('.coupon_area_bg')[0].addEventListener('scroll', () => {
        this.scrollHandler()
      })
      $('html,body').animate({ scrollTop: 0 }, 0)
      $('html,body').css({
        'overflow-x': 'scroll',
        'overflow-y': 'hidden'
      })
    },
    handleClose () {
      this.isCouponPopup = false
      const couponPopup = this.$refs.couponPopup
      const $elem = $('html, body')
      $('html,body').css({
        'overflow-x': '',
        'overflow-y': ''
      })
      enablePageScroll(couponPopup)
      $elem.css({ overflow: '' })
    },
    toggleCouponPopup () {
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      } else {
        if (this.compare.length === 1) {
          this.$store.dispatch('coupon/downLoadCoupons', this.compare[0].couponNo).then(() => {
            Alert({
              message: '割引クーポンが発行されました。'
            })
          })
        } else {
          this.isCouponPopup = !this.isCouponPopup
          this.$nextTick(() => {
            if (this.isCouponPopup) {
              this.showHeader()
            }
          })
        }
      }
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    downloadCoupon (couponNo) {
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
      } else {
        this.$store.dispatch('coupon/downLoadCoupons', couponNo).then(() => {
          Alert({
            message: '割引クーポンが発行されました。'
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.coupon_page {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  margin-bottom: 60px;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  z-index: 1050;
  overflow: scroll;
}
.coupon_area_bg {
  overflow: scroll;
}
</style>
