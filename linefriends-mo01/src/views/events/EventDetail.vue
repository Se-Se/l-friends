<template>
  <div id="container" class="event">
    <!-- category nav -->
    <Breadcrumb :title="'プロモーション'"></Breadcrumb>
    <!--img banner -->
    <div class="event_wrap" v-if="event">
      <div class="event_banner">
        <div class="area_event_banner" v-if="event.top.mobile.type === 'HTML'" v-html="event.top.mobile.url">
        </div>
        <div class="area_event_banner" v-else>
          <img :src="event.top.mobile.url" alt="">
        </div>
      </div>
      <!--coupon banner -->
      <div class="event_coupon" id="event_coupon" v-if="event && event.coupon && event.coupon.coupons.length > 0">
        <h2 class="ev_ttl">クーポン特典</h2>
        <a href="#" class="ev_info" @click.prevent="popShow=true">クーポン案内</a>
        <ul class="coupon_list">
          <li class="list_contents" v-for="(coupon, index) in event.coupon.coupons" :key="index" :style="coupon.downloadable ? '' : 'pointer-events: none;'">
            <div class="bx_coupon_con size_m" :class="{'disabled': !coupon.downloadable}">
              <a href="#" @click.prevent="downloadCoupon(coupon.couponNo)">
                <strong class="tit">{{ coupon.couponName | wordsFormat(14) }}</strong>
                <div class="bx_price">
                  <p v-if="coupon.discountInfo.fixedAmt"><strong class="number"><span class="txt_mark">￥</span>{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt percent">OFF</span></strong></p>
                  <p v-else><strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span><span class="txt off">OFF</span></strong></p>
                </div>
                <span class="ico_download">Download coupon</span>
              </a>
              <div class="dsc_info">
                <template v-if="!coupon.discountInfo.fixedAmt">
                  <span :class="{ discount: coupon.useConstraint.minSalePrice, ticket: !coupon.useConstraint.minSalePrice }">
                    <template v-if="coupon.couponType === 'CART'">カート </template>最大 ￥{{ priceFormat(coupon.discountInfo.maxDiscountAmt) }}割引</span>
                </template>
                <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                  <span class="ticket">￥{{ priceFormat(coupon.useConstraint.minSalePrice) }}以上〜￥{{ priceFormat(coupon.useConstraint.maxSalePrice) }}以下の使用可能</span>
                </template>
                <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                  <span class="ticket">￥{{ priceFormat(coupon.useConstraint.minSalePrice) }}以上の使用可能</span>
                </template>
                <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                  <span class="ticket">￥{{ priceFormat(coupon.useConstraint.maxSalePrice) }}以下の使用可能</span>
                </template>
                <span class="limit">{{coupon.dateInfo.issueEndYmdt | dateFormatStr('yyyy.MM.dd')}} まで発行可能</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--goods list -->
      <div class="goods_wrap" v-if="event && event.section.length">
        <div class="nav_wrap" v-if="event && event.sectionMenu && event.sectionMenu.length > 1">
          <nav class="goods_nav">
            <ul class="nav_list">
              <li class="nav_contents" :class="{'label_active': active===index }" v-for="(section, index) in event.sectionMenu" :key="index"><a href="#" @click.prevent="tabMove(index)">{{ section.label }}</a></li>
            </ul>
          </nav>
        </div>
        <div class="goods_contents">
          <div class="goods_classify" v-for="(section, index) in event.sectionMenu" :key="index" :id="`event-${index}`">
            <h2>{{ section.label }}</h2>
            <ul class="good_list column-2">
              <li v-for="(product,label) in section.products" :key="label">
                <ProductItem :item="product" :area="'event'"></ProductItem>
              </li>
            </ul>
          </div><!-- goods_classify -->
        </div>
      </div>
    </div>
    <!-- pop -->
    <div class="popup_wrap" v-if="popShow">
      <div class="pop_common ev_pop_siz">
        <div class="ev_contents" >
          <div class="ev_con_head">
            <div class="wrap_category">
              <h2>クーポンダウンロード</h2>
              <div class="category_right">
                <a href="#" class="btn_close" @click.prevent="popShow=false"></a>
              </div>
            </div>
          </div>
          <div ref="popupScroll" class="ev_con_body" v-if="event && event.coupon && event.coupon.guideImageUrl" v-html="event.coupon.guideImageUrl">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { Alert } from '@/components/common/modal'
import { isLogin, formatCurrency, productPrice } from '@/utils/utils'
import Breadcrumb from '@/components/common/Breadcrumb'
import ProductItem from '@/components/common/ProductItem'
import { getStrDate } from '@/utils/dateUtils'
import $ from 'jquery'
import { lock, unlock } from 'tua-body-scroll-lock'
const $window = $(window)

export default {
  name: 'EventDetail',
  data () {
    return {
      active: 0,
      popShow: false,
      lastPosition: -1,
      navPadding: 48
    }
  },
  components: {
    Breadcrumb,
    ProductItem
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    ...mapActions('event', ['fetchEventDetail']),
    getStrDate,
    isPreOrderPeriod (product) {
      if (product && product.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(product.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(product.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    downloadCoupon (couponNo) {
      let now = new Date()
      let startDate = new Date(this.event.startYmdt.replace(' ', 'T'))
      let endDate = new Date(this.event.endYmdt.replace(' ', 'T'))
      if (startDate > now) {
        Alert('クーポンのダウンロード期間はありません。')
        return
      }
      if (endDate < now) {
        Alert('終了したプロモーションです。')
        return
      }
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: `${location.protocol}//${location.host}/m/event/${this.$route.params.eventNo}/#event_coupon`
          }
        })
      } else {
        this.$store.dispatch('coupon/downLoadCoupons', couponNo).then(() => {
          Alert({
            message: '割引クーポンが発行されました。'
          })
          this.$store.dispatch('event/fetchEventDetail', { eventNo: this.$route.params.eventNo, isMain: true })
        })
      }
    },
    tabMove (index) {
      this.active = index
      $window.scrollTop($(`#event-${index}`).offset().top - 100)
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    priceCalculate (product) {
      return productPrice(product.salePrice,
        product.additionDiscountAmt,
        product.immediateDiscountAmt)
    },
    handleScrollChangeNane () {
      for (let i = 0; i < this.event.sectionMenu.length; i++) {
        if ($(window).scrollTop() >= $(`#event-${i}`).offset().top - 101) {
          this.active = i
        }
      }

      this.scrollHandler()
    },
    scrollHandler () {
      let st = window.pageYOffset || document.documentElement.scrollTop
      if (st >= this.goodsArea.offset().top - this.navPadding) {
        this.navArea.addClass('fixed')
      } else {
        this.navArea.removeClass('fixed')
      }

      const li = this.navArea.find('li').eq(this.active)
      const liOffsetLeft = li.get(0).offsetLeft

      if (st <= this.lastPosition) {
        if (st + this.header.height() > this.goodsArea.offset().top - this.navPadding) {
          this.header.css('position', 'relative')
        } else {
          this.header.removeAttr('style')
        }
        if (this.navBar.scrollLeft() > liOffsetLeft + li.width()) {
          this.navBar.scrollLeft(liOffsetLeft - 24)
        }
      } else {
        if (this.navBar.scrollLeft() + $window.width() < liOffsetLeft + li.width()) {
          this.navBar.scrollLeft(liOffsetLeft - 24)
        }
      }
      this.lastPosition = st <= 0 ? 0 : st
    },
    getDataAndBindEvent () {
      this.fetchEventDetail({ eventNo: this.$route.params.eventNo, isMain: true }).then(() => {
        this.header = $('.header')
        this.goodsArea = $('.goods_wrap')
        this.navArea = $('.nav_wrap')
        this.navBar = $('.goods_nav')
        if (this.event && this.event.sectionMenu && this.event.sectionMenu.length > 1) {
          window.addEventListener('scroll', this.handleScrollChangeNane)
        }
      })
    },
    scrollToCoupon () {
      if (this.$route.hash === '#event_coupon') {
        window.addEventListener('load', () => {
          window.scrollTo({
            top: document.getElementById('event_coupon').offsetTop
          })
        })
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollChangeNane)
  },
  mounted () {
    this.getDataAndBindEvent()
    this.scrollToCoupon()
  },
  watch: {
    popShow (next) {
      this.$nextTick(() => {
        if (next) {
          lock(this.$refs.popupScroll)
        } else {
          unlock(this.$refs.popupScroll)
        }
      })
    }
  }
}
</script>
<style scoped>
.area_event_banner >>> img {
  width: 100%;
  max-width: 100% !important;
}
</style>
