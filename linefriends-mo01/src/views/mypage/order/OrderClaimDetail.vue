<template>
  <div id="container" class="cart-order">
    <!-- ↓↓↓↓↓ candr_wrapper ↓↓↓↓↓ -->
    <div class="candr_wrapper popup">
      <div class="wrap_category">
        <h2>{{txt.title}}</h2>
        <div class="category_right">
          <a href="#" class="btn_close" @click.prevent="closeOrderClaimDetailPopup">Close</a>
        </div>
      </div>

      <div class="candr_content" v-if="showClaimResult.claimedOptions">
        <div class="candr_info" v-for="(claimedOption, item) in showClaimResult.claimedOptions" :key="item">
          <dl>
            <dt>商品情報</dt>
            <dd class="product_name">{{(showBrandName(claimedOption.brandName) + claimedOption.productName) | wordsFormat(44)}}
            </dd>
          </dl>
          <dl v-if="claimedOption.optionType !== 'PRODUCT_ONLY'">
            <dt></dt>
            <dd class="color_grey option_value">{{ claimedOption.optionName }}: {{ claimedOption.optionValue }}</dd>
          </dl>
          <dl class="mt-10">
            <dt>個数</dt>
            <dd><span class="mn mn_1">{{claimedOption.orderCnt}}</span> 件</dd>
          </dl>
          <dl class="mt-10">
            <dt>ステータス</dt>
            <dd>{{{claimType: claimedOption.claimStatusType} | showStatus}}</dd>
          </dl>
        </div>
        <div class="candr_info return_reason_area">
          <div class="candr_info_ttl">
            <p class="ttl">{{txt.titleReason}}</p>
          </div>
          <dl>
            <dt>{{txt.reasonType}}</dt>
            <template v-for="claimReasonType in claimReasonTypes">
              <dd :key="claimReasonType.value" v-if="claimReasonType.value === showClaimResult.claimReasonType">
                {{claimReasonType.label}}
              </dd>
            </template>
          </dl>
          <dl class="mt-10">
            <dt>{{txt.reasonDetail}}</dt>
            <dd>{{showClaimResult.claimReasonDetail}}</dd>
          </dl>
          <ul class="return_img_area cf" v-if="showClaimResult.claimImageUrls && showClaimResult.claimImageUrls.length > 0">
            <li class="ml_none" v-for="(key, index) in showClaimResult.claimImageUrls" :key="index">
              <a href="javascript:void(0)">
                <div class="thumbnail"><img :src="key" alt=""></div>
              </a>
            </li>
          </ul>
        </div>
        <div class="candr_info refund_area">
          <div class="candr_info_ttl">
            <p class="ttl">返金情報</p>
          </div>
          <dl v-if="isCancel">
            <dt>小計(税込)</dt>
            <dd><span class="ms">￥</span><span class="mn">{{refundAmt | formatCurrency}}</span></dd>
          </dl>
          <dl class="product_detail_list mt-10" v-if="isCancel">
            <dt>送料</dt>
            <dd><span class="ms">￥</span><span class="mn">{{deliveryAmt | formatCurrency}}</span></dd>
          </dl>
          <!-- <dl class="product_detail_list f-6-area mt-2">
            <dt>- 基本送料</dt>
            <dd>
              <div>
                <p class="bold">-￥<span class="common-V V-7">{{deliveryAmt - refundRemoteDeliveryAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list f-6-area mt-2">
            <dt>- 地域別追加送料</dt>
            <dd>
              <div>
                <p class="bold">-￥<span class="common-V V-7">{{refundRemoteDeliveryAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl> -->
          <dl class="pt-20" v-if="isCancel">
            <dt>返金額 </dt>
            <dd><span class="ms ms_1">￥</span><span class="mn mn_2">{{showRefundPayAmt}}</span></dd>
          </dl>
          <dl v-else>
            <dt>返金額 </dt>
            <dd><span class="ms">￥</span><span class="mn">{{showRefundPayAmt}}</span></dd>
          </dl>
          <dl class="mt-10" :class="isCancel? 'color_grey' : ''">
            <dt>返金方法</dt>
            <dd>{{showClaimResult.claimPriceInfo.refundTypeLabel}}</dd>
          </dl>
        </div>
      </div>
      <div class="popup_btn_area">
        <button class="btn btn_green" @click.prevent="closeOrderClaimDetailPopup">確認</button>
      </div>
    </div>
    <!-- ↑↑↑↑↑ candr_wrapper ↑↑↑↑↑ -->
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'

export default {
  data () {
    return {
      active: false,
      showClaimResult: {
        claimNo: 0,
        claimPriceInfo: {},
        claimReasonDetail: '',
        claimReasonType: '',
        claimType: '',
        claimedOption: {},
        orderProductOptionNo: 0,
        refundType: '',
        returnAddress: {}
      },
      txt: {
        title: '',
        titleInfo: '',
        titleReason: '',
        reasonType: '',
        reasonDetail: ''
      },
      bodyScrollTop: 0
    }
  },
  mounted () {
    if (this.isCancel) {
      this.txt.title = 'キャンセルの詳細'
      this.txt.titleInfo = 'キャンセルの詳細'
      this.txt.titleReason = 'キャンセルの理由'
      this.txt.reasonType = 'キャンセルの分類'
      this.txt.reasonDetail = 'キャンセルの詳しい理由'
    } else {
      this.txt.title = '返品の詳細'
      this.txt.titleInfo = '返品の詳細'
      this.txt.titleReason = '返品する理由'
      this.txt.reasonType = '返品理由の分類'
      this.txt.reasonDetail = '返品の詳しい理由'
    }
  },
  computed: {
    ...mapState('myorder', ['claimResult']),
    ...mapState('guestorder', ['claimResult']),
    ...mapGetters('common', ['claimReasonTypes']),
    refundAmt () {
      let producrAmt = this.showClaimResult.claimPriceInfo.productAmtInfo ? this.showClaimResult.claimPriceInfo.productAmtInfo.totalAmt : 0
      let cartCouponAmt = this.showClaimResult.claimPriceInfo.subtractionAmtInfo ? this.showClaimResult.claimPriceInfo.subtractionAmtInfo.cartCouponAmt : 0
      return producrAmt - cartCouponAmt
    },
    refundRemoteDeliveryAmt () {
      const refundRemoteDeliveryAmt = this.showClaimResult.claimPriceInfo.deliveryAmtInfo ? this.showClaimResult.claimPriceInfo.deliveryAmtInfo.refundRemoteDeliveryAmt : 0
      return refundRemoteDeliveryAmt
    },
    deliveryAmt () {
      const deliveryAmt = this.showClaimResult.claimPriceInfo.deliveryAmtInfo ? this.showClaimResult.claimPriceInfo.deliveryAmtInfo.totalAmt : 0
      return deliveryAmt
    },
    deductionAmt () {
      const tempClaimInfo = this.showClaimResult.claimPriceInfo
      let deductionAmt = 0
      if (tempClaimInfo && tempClaimInfo.subtractionAmtInfo && tempClaimInfo.productAmtInfo) {
        deductionAmt += tempClaimInfo.subtractionAmtInfo.cartCouponAmt
        deductionAmt += tempClaimInfo.subtractionAmtInfo.deliveryCouponAmt
        deductionAmt += tempClaimInfo.productAmtInfo.immediateDiscountAmt
        deductionAmt += tempClaimInfo.productAmtInfo.additionalDiscountAmt
        deductionAmt += tempClaimInfo.productAmtInfo.productCouponDiscountAmt
        deductionAmt += tempClaimInfo.subtractionAmtInfo.refundAdjustAmt
        return deductionAmt * -1
      } else {
        return deductionAmt
      }
    },
    showRefundSubtractionAmt () {
      return this.showClaimResult.claimPriceInfo.subtractionAmtInfo ? formatCurrency(this.showClaimResult.claimPriceInfo.subtractionAmtInfo.totalAmt) : 0
    },
    showRefundPayAmt () {
      return this.showClaimResult.claimPriceInfo ? formatCurrency(this.showClaimResult.claimPriceInfo.refundPayAmt) : 0
    },
    isCancel () {
      return this.$route.name === 'OrderCancelDetail'
    }
  },
  methods: {
    closeOrderClaimDetailPopup () {
      this.$router.go(-1)
    },
    getOrderClaimResult (orderOptionNo, nonMember) {
      if (nonMember) {
        this.$store.dispatch('guestorder/getGuestClaimResult', {
          claimParams: {
            orderOptionNo: orderOptionNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.guestorder.claimResult
        })
      } else {
        this.$store.dispatch('myorder/getClaimResult', {
          claimParams: {
            orderOptionNo: orderOptionNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.myorder.claimResult
        })
      }
    },
    getOrderReturnResult (claimNo, nonMember) {
      if (nonMember) {
        this.$store.dispatch('guestorder/getMultiClaimResult', {
          claimParams: {
            claimNo: claimNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.guestorder.multiClaimResult
        })
      } else {
        this.$store.dispatch('myorder/getMultiClaimResult', {
          claimParams: {
            claimNo: claimNo
          }
        }).then(() => {
          this.showClaimResult = this.$store.state.myorder.multiClaimResult
        })
      }
    },
    showBrandName (brandName) {
      if (brandName !== '') {
        brandName = '[' + brandName + ']'
      }
      return brandName
    }
  },
  created () {
    if (this.isCancel) {
      this.getOrderClaimResult(this.$route.params.optionNo, false)
    } else {
      this.getOrderReturnResult(this.$route.params.claimNo, false)
    }
  }
}
</script>
