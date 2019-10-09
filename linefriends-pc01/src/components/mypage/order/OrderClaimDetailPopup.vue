<template>
  <div class="popup-layer" v-if="active">
    <div class="popup_common cancel_popup">
      <div class="roller_area" style="overflow-y: scroll;">
        <h1>{{txt.title}}</h1>
        <div class="con mt-32">
          <table class="table_info cancel-table">
            <colgroup>
              <col style="width: 48%">
              <col>
              <col>
            </colgroup>
            <tbody>
              <tr>
                <th>商品情報</th>
                <th>個数</th>
                <th>ステータス</th>
              </tr>
              <template v-if="showClaimResult.claimedOptions">
                <tr v-for="(claimedOption, item) in showClaimResult.claimedOptions" :key="item">
                  <td>
                    <p class="good_name">{{(showBrandName(claimedOption.brandName) + claimedOption.productName) | wordsFormat(44)}}</p>
                    <p v-if="claimedOption.optionType !== 'PRODUCT_ONLY'" class="option_value">{{ claimedOption.optionName }}: {{ claimedOption.optionValue }}</p>
                  </td>
                  <td class="center"><span class="num">{{claimedOption.orderCnt}} </span><span class="ft-14">件</span></td>
                  <td class="center"><span class="green">{{{claimType: claimedOption.claimStatusType} | showStatus}}</span></td>
                </tr>
              </template>
            </tbody>
          </table>
          <div class="detail_info">
            <p class="min-title">{{txt.titleReason}}</p>
            <table class="table_info table_sub1">
              <colgroup>
                <col>
                <col>
                <col>
              </colgroup>
              <tbody>
                <tr>
                  <th>{{txt.reasonType}}</th>
                  <template v-for="claimReasonType in claimReasonTypes">
                    <td :key="claimReasonType.value" v-if="claimReasonType.value === showClaimResult.claimReasonType">
                      {{claimReasonType.label}}
                    </td>
                  </template>
                </tr>
                <tr>
                  <th>{{txt.reasonDetail}}</th>
                  <td>{{showClaimResult.claimReasonDetail}}</td>
                </tr>
                <tr class="photo_tr cf" v-if="showClaimResult.claimImageUrls && showClaimResult.claimImageUrls.length > 0">
                  <th>添付ファイル</th>
                  <td>
                    <ul>
                      <li v-for="(key, index) in showClaimResult.claimImageUrls" :key="index">
                        <div class="thumbnail">
                          <img class="item_img" :src="key">
                        </div>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="detail_info">
            <p class="min-title">返金情報</p>
            <table class="table_info table_sub2" v-if="showClaimType === 'CANCEL'">
              <colgroup>
                <col>
                <col>
                <col>
              </colgroup>
              <tbody>
                <tr>
                  <th class="symbol plus">
                    <p>小計(税込)</p>
                    <p class="money">￥{{refundAmt | formatCurrency}}</p>
                  </th>
                  <th>
                    <div>
                      <span>送料</span>
                      <!-- <div class="tip">
                        <div class="tip_popup size_1">
                          <dl class="opt_pb_4">
                            <dt>送料</dt>
                            <dd><i class="uom2">￥</i><span class="num">{{deliveryAmt | formatCurrency}}</span></dd>
                          </dl>
                          <dl class="opt_pb_4">
                            <dt class="warm-grey">ㄴ 基本送料</dt>
                            <dd class="warm-grey">
                              <i class="uom2">-￥</i><span class="num">{{deliveryAmt- refundRemoteDeliveryAmt | formatCurrency}}</span>
                            </dd>
                          </dl>
                          <dl class="opt_pb_4">
                            <dt class="warm-grey">ㄴ 地域別追加送料</dt>
                            <dd class="warm-grey"><i class="uom2">-￥</i><span class="num">{{refundRemoteDeliveryAmt | formatCurrency}}</span>
                            </dd>
                          </dl>
                        </div>
                      </div> -->
                    </div>
                    <p class="money">￥{{deliveryAmt | formatCurrency}}</p>
                  </th>
                  <th class="symbol equal">
                    <p>返金額</p>
                    <p class="money green">￥{{showRefundPayAmt}}</p>
                  </th>
                </tr>
              </tbody>
            </table>
            <table class="table_info table_sub1" :class="showClaimType === 'CANCEL' ? 'no-top' : ''">
              <tbody>
                <tr v-if="showClaimType === 'RETURN'">
                  <th class="no-top">返金額</th>
                  <td class="no-top">￥<span class="f-16">{{showRefundPayAmt}}</span></td>
                </tr>
                <tr>
                  <th class="no-top">返金方法</th>
                  <td class="no-top">{{showClaimResult.claimPriceInfo.refundTypeLabel}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ul class="btn_list btn_list-margin">
          <li>
            <button class="btn btn_green" @click.prevent="closeOrderClaimDetailPopup">確認</button>
          </li>
        </ul>
      </div>
      <button class="btn_close" @click.prevent="closeOrderClaimDetailPopup">close</button>
    </div>
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
  props: {
    showClaimType: {
      type: String,
      required: false
    }
  },
  mounted () {
    if (this.showClaimType === 'CANCEL') {
      this.txt.title = 'キャンセルの詳細'
      this.txt.titleInfo = 'キャンセルの詳細'
      this.txt.titleReason = 'キャンセルの理由'
      this.txt.reasonType = 'キャンセルの分類'
      this.txt.reasonDetail = 'キャンセルの詳しい理由'
    } else if (this.showClaimType === 'RETURN') {
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
    }
  },
  methods: {
    openOrderReturnDetailPopup (claimNo, nonMember) {
      this.getOrderReturnResult(claimNo, nonMember)
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      document.body.style.overflow = 'hidden'
    },
    openOrderClaimDetailPopup (orderOptionNo, nonMember) {
      this.getOrderClaimResult(orderOptionNo, nonMember)
      this.active = true
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      document.body.style.overflow = 'hidden'
    },
    closeOrderClaimDetailPopup () {
      this.active = false
      document.body.style.overflow = ''
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
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
  }
}
</script>
