<template>
  <div class="itemview">
    <div class="bx_discount_coupon" v-if="compare && compare.length > 0">
      <div class="coupon">
        <template v-if="compare[0] && compare[0].discountInfo.fixedAmt !== true">
          <!--&lt;!&ndash; [D] 할인쿠폰(정률) &ndash;&gt;-->
            <button
              class="goods-detail__info-coupon__btn"
              @click="toggleCouponPopup"
              >
              <span class="goods-detail__info-coupon-title">{{ $t('goods.detail.header.couponDownload') }}</span>
              <p class="goods-detail__info-coupon__download"></p>
           </button>
        </template>
        <template v-else>
          <!--&lt;!&ndash; [D] 할인쿠폰(정액) &ndash;&gt;-->
            <button
                class="goods-detail__info-coupon__btn"
                @click="toggleCouponPopup"
              >
                <span class="goods-detail__info-coupon-title">{{ $t('goods.detail.header.couponDownload') }}</span>
                <p class="goods-detail__info-coupon__download"></p> 
              </button>
        </template>

        <!-- [D] 할인쿠폰 다운로드 팝업 -->
        <div class="layer_popup layer_coupon_down" v-show="isCouponPopup" style="display:block; font-size:12px;">
          <div class="bx_tit">
            <strong class="tit">{{ $t('goods.detailCoupon.discountCouponDownload') }}</strong>
          </div>
          <div class="layer_inner">
            <div class="bx_coupon_big" v-if="compare">
              <div class="bx_coupon_con" v-for="coupon in compare">
                <template v-if="coupon.discountInfo.fixedAmt !== true">
                  <a href="javascript:" @click="downloadCoupon(coupon.couponNo)" :class="{disabled: coupon.downloadable === false, percent: coupon.discountInfo.fixedAmt === false}">
                    <strong class="tit">{{ coupon.couponName | wordsFormat(14) }}</strong>
                    <span class="bx_price">
                      <strong class="number">{{ coupon.discountInfo.discountRate }}<span class="txt percent">%</span>
                      </strong>
                    </span>
                    <span class="ico_download">
                      <span class="sp">{{ $t('goods.detailCoupon.couponDownload') }}</span>
                    </span>
                  </a>
                  <div class="dsc_info">
                    <span class="dsccount">{{ $t('goods.detailCoupon.max') }} {{ priceFormat(coupon.discountInfo.maxDiscountAmt) }}{{ $t('goods.detailCoupon.currencyDiscount') }}</span> <br>
                    <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}{{ $t('goods.detailCoupon.currencyUp') }} ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}{{ $t('goods.detailCoupon.currencyDown') }} {{ $t('goods.detailCoupon.use') }}</span>
                    </template>
                    <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}{{ $t('goods.detailCoupon.currencyUp') }} {{ $t('goods.detailCoupon.use') }}</span>
                    </template>
                    <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}{{ $t('goods.detailCoupon.currencyDown') }} {{ $t('goods.detailCoupon.use') }}</span>
                    </template>
                    <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} {{ $t('goods.detailCoupon.limitUse') }}</span>
                  </div>
                </template>
                <template v-else>
                  <a href="javascript:" @click="downloadCoupon(coupon.couponNo)" :class="{disabled: coupon.downloadable === false}">
                    <strong class="tit">{{ coupon.couponName | wordsFormat(14)  }}</strong>
                    <span class="bx_price">
                      <strong class="number">{{ priceFormat(coupon.discountInfo.discountAmt) }}<span class="txt money">{{ $t ('currency') }}</span>
                      </strong>
                    </span>
                    <span class="ico_download">
                      <span class="sp">{{ $t('goods.detailCoupon.couponDownload') }}</span>
                    </span>
                  </a>
                  <div class="dsc_info">
                    <template v-if="coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}{{ $t('goods.detailCoupon.currencyUp') }} ~ {{ priceFormat(coupon.useConstraint.maxSalePrice) }}{{ $t('goods.detailCoupon.currencyDown') }} {{ $t('goods.detailCoupon.currencyDiscount') }}</span>
                    </template>
                    <template v-if="coupon.useConstraint.minSalePrice && !coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.minSalePrice) }}{{ $t('goods.detailCoupon.currencyUp') }} {{ $t('goods.detailCoupon.use') }}</span>
                    </template>
                    <template v-if="!coupon.useConstraint.minSalePrice && coupon.useConstraint.maxSalePrice">
                      <span class="ticket">{{ priceFormat(coupon.useConstraint.maxSalePrice) }}{{ $t('goods.detailCoupon.currencyDown') }} {{ $t('goods.detailCoupon.use') }}</span>
                    </template>
                    <span class="limit">{{ coupon.dateInfo.issueEndYmdt.split(' ')[0].replace(/-/gi,'.') }} {{ $t('goods.detailCoupon.limitUse') }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <button type="button" class="btn_close" @click="toggleCouponPopup">
            <span class="sp">{{ $t('goods.detailCoupon.close') }}</span>
          </button>
        </div>
      </div>
      <!-- // [D] 할인쿠폰 다운로드 팝업 -->
    </div>
  </div>
</template>

<script>
import DetailCoupon from '@/components/mixins/goods/detail/DetailCoupon'

export default {
  mixins: [DetailCoupon]
}
</script>

<style>
</style>
