<template>
  <div class="coupon_area" id="coupon_area" v-if="event && event.coupon && event.coupon.coupons.length > 0">
    <div class="wrap">
      <!-- ↓↓↓↓↓ event_contents ↓↓↓↓↓ -->
      <div class="event_contents">
        <p class="title coupon_tit">クーポン特典</p>
        <p class="coupon_guide">
          <span>クーポン案内</span>
        </p>
        <div class="coupon_guide_info" v-if="event && event.coupon && event.coupon.guideImageUrl" v-html="_xssFilter(event.coupon.guideImageUrl)"></div>
        <p></p>
        <div class="coupon_list_contents">
          <ul class="coupon_list">
            <li v-for="(coupon, idx) in event.coupon.coupons" :key="idx">
              <div class="bx_coupon_con">
                <a href="#" @click.prevent="downloadCoupon(coupon.couponNo)" :class="{ disabled: coupon.downloadable === false, percent: coupon.discountInfo.fixedAmt === false}">
                  <strong class="tit">
                    {{ coupon.couponName | wordsFormat(14) }}
                  </strong>
                  <div class="bx_price">
                    <p>
                      <template v-if="coupon.discountInfo.fixedAmt">
                        <strong class="number"><i class="uom">￥</i>{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt off">OFF</span></strong>
                      </template>
                      <template v-else>
                        <strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span><span class="txt off">OFF</span></strong>
                      </template>
                    </p>
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
                  <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} まで発行可能</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- ↑↑↑↑↑ event_contents ↑↑↑↑↑ -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { isLogin, xssFilter } from '@/utils/utils'
import { Alert } from '@/components/common/modal'

export default {
  data () {
    return {}
  },
  filters: {
    wordsFormat (content, num) {
      if (content) {
        if (navigator.userAgent.indexOf('Trident') === -1 && navigator.userAgent.indexOf('Edge') === -1) {
          return content
        }
        if (content.length <= num) {
          return content
        }
        return content.substring(0, num) + '...'
      }
    }
  },
  props: {
    product: {
      type: [Object, Array]
    }
  },
  components: {},
  computed: {
    ...mapState('event', ['event']),
    replaceImageUrl () {
      let r = this.event.coupon.guideImageUrl
      r = r.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      return r
    }
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    },
    priceFormat (price) {
      return formatCurrency(price)
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
          path: '/member/login',
          query: {
            redirect: `${location.protocol}//${location.host}/event/${this.$route.params.eventNo}/#coupon_area`
          }
        })
        console.log(this.$router)
      } else {
        this.$store.dispatch('coupon/downLoadCoupons', couponNo).then(() => {
          Alert({
            message: '割引クーポンが発行されました。'
          })
          this.$store.dispatch('event/fetchEventDetail', { eventNo: this.$route.params.eventNo, isMain: true })
        })
      }
    }
  },
  mounted () {
    if (this.$route.hash === '#coupon_area') {
      window.addEventListener('load', () => {
        window.scrollTo({
          top: document.getElementById('coupon_area').offsetTop,
          behavior: 'smooth'
        })
      })
    }
  }
}
</script>
