<template>
  <section>
    <div class="table-list__coupon">
      <div class="table-list--header">
        <h2 class="table-list--header__title">{{ $t('mypage.coupon.noValid.title') }}</h2>
      </div>
      <table class="table coupon-table">
        <colgroup>
          <col style="width: 340px">
          <col style="width: 180px">
          <col style="width: 260px">
          <col style="width: 200px">
          <col style="width: 200px">
        </colgroup>
        <thead>
          <tr>
            <th>{{ $t('mypage.coupon.list.name') }}</th>
            <th>{{ $t('mypage.coupon.list.benefits') }}</th>
            <th>{{ $t('mypage.coupon.list.condition') }}</th>
            <th>{{ $t('mypage.coupon.list.validityNoValid') }}</th>
            <th>{{ $t('mypage.coupon.list.kinds') }}</th>
          </tr>
        </thead>
        <tbody v-if="getNoValidCoupons && getNoValidCoupons.totalCount > 0">
          <tr
            v-for="(item,index) in getNoValidCoupons" :key="index"
            class="coupon-tr"
          >
            <td>
              <p class="max_line2">{{ item.couponName }}</p>
            </td>
            <td>
              <span class="row-line red-font">
                <template v-if="item.discountAmt">
                  {{MyMiliFormat(item.discountAmt)}}{{ $t('currency') }}
                </template>
                <template v-if="item.discountRate">
                  {{item.discountRate}}% {{ $t('mypage.coupon.discount') }} <br>
                  ({{ $t('mypage.coupon.max') }} {{MyMiliFormat(item.maxDiscountAmt)}}{{ $t('currency') }})
                </template>
              </span>
            </td>
            <td>
              <span class="txt_color_gray">
                <template v-if="(item.couponType === 'PRODUCT' || item.couponType === 'PRODUCT_PLUS')">
                  <template v-if="!item.maxSalePrice && !item.minSalePrice">
                    {{ $t('mypage.coupon.goodsValidity') }} 
                  </template>
                  <template v-else>
                    <template v-if="item.minSalePrice">
                      {{MyMiliFormat(item.minSalePrice)}}{{ $t('currency') }} {{ $t('mypage.coupon.above') }}
                    </template>
                    <template v-if="item.minSalePrice && item.maxSalePrice">
                      <br>~
                    </template>
                    <template v-if="item.maxSalePrice">
                      {{MyMiliFormat(item.maxSalePrice)}}{{ $t('currency') }} {{ $t('mypage.coupon.below') }}
                    </template>
                  </template>
                </template>
                <template v-if="(item.couponType === 'CART' || item.couponType === 'CART_DELIVERY')">
                  <template v-if="item.couponType === 'CART' && (!item.maxSalePrice && !item.minSalePrice)">
                    {{ $t('mypage.coupon.cartValidity') }}
                  </template>
                  <template v-else>
                    <br v-if="!item.freeDelivery" /> {{ $t('mypage.coupon.cartPrice') }}
                    <template v-if="item.minSalePrice">
                      {{MyMiliFormat(item.minSalePrice)}}{{ $t('currency') }} {{ $t('mypage.coupon.above') }}
                    </template>
                    <template v-if="item.minSalePrice && item.maxSalePrice">
                      <br>~
                    </template>
                    <template v-if="item.maxSalePrice">
                      {{MyMiliFormat(item.maxSalePrice)}}{{ $t('currency') }} {{ $t('mypage.coupon.below') }}
                    </template>
                    <template v-if="(item.minSalePrice && item.minDeliveryAmt) || (item.maxSalePrice && item.minDeliveryAmt)"> / </template>
                    <template v-if="item.minDeliveryAmt">
                      {{ $t('mypage.coupon.delivery') }} {{MyMiliFormat(item.minDeliveryAmt)}}{{ $t('currency') }} {{ $t('mypage.coupon.above') }}
                    </template>
                  </template>
                </template>
              </span>
            </td>
            <template v-if="item.used === true">
              <td class="txt_color_gray num">
                {{manageDate(item.useYmdt)[0]}} {{manageDate(item.useYmdt)[1]}}
                <p>{{ $t('mypage.coupon.noValid.used') }}</p>
              </td>
            </template>
            <template v-if="item.used === false">
              <td class="txt_color_gray num">
                {{manageDate(item.useEndYmdt)[0]}} {{manageDate(item.useEndYmdt)[1]}}
                <p>{{ $t('mypage.coupon.noValid.dateEnd') }}</p>
              </td>
            </template>
            <td>
              <span class="txt_color_gray" v-if="item.couponType === 'PRODUCT'">{{ $t('mypage.coupon.kinds.goodsCoupon') }}</span>
              <span class="txt_color_gray" v-else-if="item.couponType === 'PRODUCT_PLUS'">{{ $t('mypage.coupon.kinds.goodsPlusCoupon') }}</span>
              <span class="txt_color_gray" v-else-if="item.couponType === 'CART'">{{ $t('mypage.coupon.kinds.cartCoupon') }}</span>
              <span class="txt_color_gray" v-else-if="item.couponType === 'CART_DELIVERY'">{{ $t('mypage.coupon.kinds.deliveryCoupon') }}</span>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="none" colspan="6">
              <div
                class="table-nodata"
              >
                <figure
                  class="table-nodata__fig"
                >
                  <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                </figure>
                <div
                  class="table-nodata--info"
                >
                  <h2
                    class="table-nodata--info__title"
                  >
                    {{ $t('mypage.coupon.description') }}
                  </h2>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="pagination-interval">
      <pagination class="mt-3" :page="1" :total_count="totalCount" :page_size="10" :page_term="5" @onPageChange="pageChange" ref="pagination" />
    </div> -->
  </section>
</template>

<script>
import ProductInquiryPopup from '@/components/pc/popup/ProductInquiryPopupNew'
import OrderAddreviewPopup from '@/components/pc/popup/OrderAddreviewPopupNew'
import Order from '@/components/pc/layout/order/OrderNew'
// import Pagination from '@/components/pc/assets/Pagination'

import NoValidCouponNew from '@/components/mixins/mypage/coupon/NoValidCouponNew'
export default {
  name: 'ValidCouponNew',
  mixins: [NoValidCouponNew],
  components: {
    ProductInquiryPopup,
    OrderAddreviewPopup,
    Order
  }
}
</script>
