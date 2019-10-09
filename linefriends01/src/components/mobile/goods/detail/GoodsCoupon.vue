<template>
  <div class="itemview">
    <div class="bx_discount_coupon" v-if="compare && compare.length > 0">
      <div class="coupon">
        <template v-if="compare[0] && compare[0].discountInfo.fixedAmt !== true">
          <!--&lt;!&ndash; [D] 할인쿠폰(정률) &ndash;&gt;-->
          <button class="coupon-wrapper" @click="toggleCouponPopup">
            <span class="coupon-title">쿠폰 다운로드</span>
            <p class="coupon-ico__download"></p>
          </button>
        </template>
        <template v-else>
          <!--&lt;!&ndash; [D] 할인쿠폰(정액) &ndash;&gt;-->
          <button class="coupon-wrapper" @click="toggleCouponPopup">
            <span class="coupon-title">쿠폰 다운로드</span>
            <p class="coupon-ico__download"></p>
          </button>
        </template>

        <!-- [D] 할인쿠폰 다운로드 팝업 -->
        <page-popup :show.sync="isCouponPopup">
          <div>
            <div class="bx_tit">
              <sub-page-header title="쿠폰 다운로드" :close="true" :onClose="handleClose" class="gogd" />
            </div>
            <div class="layer_inner">
              <div class="bx_coupon_big" style="overflow-y:auto" v-if="compare">
                <div class="bx_coupon_con" v-for="coupon in compare">
                  <template v-if="coupon.discountInfo.fixedAmt !== true">
                    <a href="javascript:" @click="downloadCoupon(coupon.couponNo)" :class="{disabled: coupon.downloadable === false, percent: coupon.discountInfo.fixedAmt === false}">
                      <strong class="tit">{{ coupon.couponName | wordsFormat(14) }}</strong>
                      <span class="bx_price">
                        <strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span>
                        </strong>
                      </span>
                      <span class="ico_download">
                        <span class="sp">쿠폰 다운로드</span>
                      </span>
                    </a>
                    <div class="dsc_info">
                      <span class="dsccount">최대 {{ priceFormat(coupon.discountInfo.maxDiscountAmt) }}원 할인</span> <br>
                      <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
                      </template>
                      <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 사용 가능</span>
                      </template>
                      <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
                      </template>
                      <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} 까지 발급 가능</span>
                    </div>
                  </template>
                  <template v-else>
                    <a href="javascript:" @click="downloadCoupon(coupon.couponNo)" :class="{disabled: coupon.downloadable === false}">
                      <strong class="tit">{{ coupon.couponName | wordsFormat(14) }}</strong>
                      <span class="bx_price">
                        <strong class="number">{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt money">원</span>
                        </strong>
                      </span>
                      <span class="ico_download">
                        <span class="sp">쿠폰 다운로드</span>
                      </span>
                    </a>
                    <div class="dsc_info">
                      <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
                      </template>
                      <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}원 이상 사용 가능</span>
                      </template>
                      <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                        <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}원 이하 사용 가능</span>
                      </template>
                      <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} 까지 발급 가능</span>
                    </div>
                  </template>
                </div>
                <!-- <div style="width:100%;height:200px;background:red"></div>
                <div style="width:100%;height:200px;background:blue"></div>
                <div style="width:100%;height:200px;background:red"></div> -->
              </div>
            </div>
          </div>
        </page-popup>
      </div>
      <!-- // [D] 할인쿠폰 다운로드 팝업 -->
    </div>
  </div>
</template>

<script>
import { Alert } from '@/utils/event-bus'
import DetailCoupon from '@/components/mixins/goods/detail/DetailCoupon'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import PagePopup from '@/components/mobile/common/PagePopup'

export default {
  mixins: [DetailCoupon],
  components: {
    SubPageHeader,
    PagePopup
  },
  methods: {
    toggleCouponPopup () {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
      } else {
        if (this.compare.length === 1) {
          this.$store.dispatch('coupon/downLoadCoupons', this.compare[0].couponNo).then(() => {
            Alert({
              message: '할인쿠폰이 발급되었습니다.'
            })
          })
        } else {
          this.isCouponPopup = !this.isCouponPopup
        }
      }
    }
  }
}
</script>

<style scoped>
.gogd {
  background-color: #ffff;
  position: fixed;
  width: 100%;
  left: 0;
  z-index: 1000;
}
.layer_inner {
  padding-top: 50px;
}
</style>
