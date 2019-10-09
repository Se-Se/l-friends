<template>
  <div class="coupon" v-if="compare && compare.length > 0">
    <template v-if="compare[0] && compare[0].discountInfo.fixedAmt !== true">
      <button type="button" class="btn_coupon" @click="toggleCouponPopup">
        <span class="txt">クーポンダウンロード</span>
        <span class="ico_arrow"></span>
      </button>
      <p class="coupon_price">クーポン適用後の割引価格<strong class="number"><span class="txt">￥</span>{{afterCouponPrice()}}</strong></p>
    </template>
    <template v-else>
      <button type="button" class="btn_coupon" @click="toggleCouponPopup">
        <span class="txt">クーポンダウンロード</span>
        <span class="ico_arrow"></span>
      </button>
      <p class="coupon_price">クーポン適用後の割引価格<strong class="number"><span class="txt">￥</span>{{afterCouponPrice()}}</strong></p>
    </template>
    <div class="layer_coupon_down" v-if="isCouponPopup">
      <div class="coupon_tit">
        <span class="tit">クーポンダウンロード</span>
      </div>
      <!-- ↓↓↓↓↓ download ticket popup ↓↓↓↓↓ -->
      <div class="layer_coupon_inner">
        <div class="bx_coupon_con size_m" v-for="(coupon,index) in compare" :key="index">
          <template v-if="coupon.discountInfo.fixedAmt !== true">
            <a href="#" :class="{percent:coupon.discountInfo.fixedAmt === false}" @click="downloadCoupon(coupon.couponNo)">
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
              <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} まで発行可能</span>
            </div>
          </template>
          <template v-else>
            <a href="#" @click="downloadCoupon(coupon.couponNo)">
              <strong class="tit">{{coupon.couponName }}</strong>
              <div class="bx_price">
                <p><strong class="number">{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt">円</span></strong></p>
              </div>
              <span class="ico_download">Download coupon</span>
            </a>
            <div class="dsc_info">
              <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}円以下割引する</span>
              </template>
              <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以上でお使いいただけます</span>
              </template>
              <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}円以下で使用可能</span>
              </template>
              <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }}まで発行可能</span>
            </div>
          </template>
        </div>

      </div>
      <button type="button" class="btn_close" @click="toggleCouponPopup">X</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert } from '@/components/common/modal'
import $ from 'jquery'
import { isLogin } from '@/utils/utils'
export default {
  props: ['price'],
  data () {
    return {
      isCouponPopup: false,
      flag: false
    }
  },
  components: {},
  computed: {
    ...mapGetters('coupon', ['compare'])
  },
  methods: {
    handleClose () {
      this.isCouponPopup = false
      const $elem = $('html, body')
      $('html,body').css({
        'overflow-x': '',
        'overflow-y': ''
      })
      $elem.css({ overflow: '' })
    },
    toggleCouponPopup () {
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
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
              $('html,body').css({
                'overflow-x': 'scroll',
                'overflow-y': 'hidden'
              })
            } else {
              this.handleClose()
            }
          })
        }
      }
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    afterCouponPrice () {
      return (this.price.salePrice - this.price.couponDiscountAmt).toLocaleString()
    },
    downloadCoupon (couponNo) {
      if (!isLogin()) {
        this.$router.push('/member/login')
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
.wrapper-pc .itemview .layer_coupon_down {
  display: block;
}
</style>
