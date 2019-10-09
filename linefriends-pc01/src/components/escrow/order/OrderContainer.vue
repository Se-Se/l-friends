<template>
  <div class="ordercom_wrap" style="display:block;">
    <div>
      <div class="wrap_category">
        <ul class="wrap_category_list">
          <li><a href="#">カート</a></li>
          <li>カート</li>
        </ul>
      </div>
      <div class="ordercom_wrap_2">
        <div class="center_wrap">
          <h2 class="ordercom_title">注文を完了いたしました。</h2>
          <div class="orderid_area">
            <!--<a href="#" class="order_a">201905211138308682</a>-->
            <router-link :to="`/mypage/orderdetail/${orderNo}`">{{orderNo}}</router-link>
          </div>
          <!--<img alt="" src="../img/order/order-complete.png">-->
        </div>
        <!-- ↓↓↓↓↓ table_wrap ↓↓↓↓↓ -->
        <div class="width-335">
          <div class="table_wrap">
            <table class="orderer_info">
              <colgroup>
                <col style="width: 35%;">
                <col style="width: 65%;">
              </colgroup>
              <tbody>
                <tr class="h-76">
                  <td>注文者</td>
                  <td class="t-right">{{this.order.orderer.ordererName}}</td>
                </tr>
                <tr>
                  <td class="pb-10 lh-1_43">お届け先情報</td>
                  <td class="t-right pb-10 lh-1_43">{{this.order.shippingAddress.receiverName}}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="t-right pb-10 lh-1_43">{{this.order.orderer.ordererContact1}}</td>
                </tr>
                <tr>
                  <td></td>
                  <td class="t-right pb-30 lh-1_5">
                    ({{this.order.shippingAddress.receiverZipCd}}) {{this.order.shippingAddress.receiverAddress}}<br>
                    {{this.order.shippingAddress.receiverDetailAddress}}
                  </td>
                </tr>
                <tr class="white-underline">
                  <td class="pb-28">決済情報</td>
                  <td class="t-right pb-28">{{this.order.payTypeLabel}}</td>
                </tr>
                <tr>
                  <td class="pt-29 pb-8 lh-1_43">総注文金額</td>
                  <td class="t-right pt-29 pb-8 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.standardAmt + this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></td>
                </tr>
                <tr>
                  <td class="warm-grey pb-10 lh-1_43">総合計</td>
                  <td class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.standardAmt)}}</span></td>
                </tr>
                <tr>
                  <td class="warm-grey pb-30 lh-1_43">送料</td>
                  <td class="t-right warm-grey pb-30 lh-1_25" v-if="this.order.lastOrderAmount.deliveryAmt > 0"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></td>
                  <td class="t-right warm-grey pb-30 lh-1_25" v-else><i class="size-14">無料配送</i></td>
                </tr>
                <tr v-if="this.totalDiscountAmt !== 0">
                  <td class="pb-10 lh-1_43">総割引金額</td>
                  <td class="t-right pb-10 lh-1_25">-<i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.totalDiscountAmt)}}</span></td>
                </tr>
                <tr v-if="this.order.lastOrderAmount.immediateDiscountAmt !== 0">
                  <td class="warm-grey pb-8 lh-1_43">割引</td>
                  <td class="t-right warm-grey pb-8 lh-1_25">-<i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.immediateDiscountAmt)}}</span></td>
                </tr>
                <tr>
                  <td class="warm-grey pb-10 lh-1_43">特別割引</td>
                  <td class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.additionalDiscountAmt)}}</span></td>
                </tr>
                <tr v-if="this.order.lastOrderAmount.productCouponDiscountAmt !== 0">
                  <td class="warm-grey pb-10 lh-1_43">商品クーポン</td>
                  <td class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.productCouponDiscountAmt)}}</span></td>
                </tr>
                <tr v-if="this.order.lastOrderAmount.cartCouponDiscountAmt !== 0">
                  <td class="warm-grey pb-32 lh-1_43">カートクーポン</td>
                  <td class="t-right warm-grey pb-32 lh-1_25"><span class="wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.cartCouponDiscountAmt)}}</span>원</td>
                </tr>
                <!-- <tr>
                  <td class="pb-30 lh-1_43">임직원 포인트 결제</td>
                  <td class="t-right pb-30 lh-1_25">-1,500원</td>
              </tr> -->
                <tr class="white-underline">
                  <td class="pb-27 lh-1_43">決済金額</td>
                  <td class="t-right pb-27 red lh-0_77 tb-special"><span class="red_word"><i class="size-22">￥</i></span><span class="red_number wrapper-pc-font_family_c">{{MyMiliForma(this.order.lastOrderAmount.chargeAmt)}}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- ↑↑↑↑↑ table_wrap ↑↑↑↑↑ -->
          <div class="ordercom_info_area pt-21">
            <!--<img alt="" src="../img/icon/ico_note.png">-->
            <div class="grey lh-1_43">マイページで注文履歴及び配送状況を確認することができます。</div>
          </div>
          <ul class="list_button pt-29">
            <li class="w-164">
              <button class="btn">マイページへ</button>
            </li>
            <li class="ml-7 w-164">
              <button class="btn btn_green">トップページへ戻る</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PaymentConfirmNew from '@/components/mixins/order/PaymentConfirmNew'

export default {
  name: 'OrderContainer',
  components: {
  },
  mixins: [PaymentConfirmNew]
}
</script>
