<template>
  <div id="container" class="order">
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
              <router-link :to="`/mypage/orderdetail/${orderNo}`">{{orderNo}}</router-link>
              <!--<a href="#" class="order_a">201905211138308682</a>-->
            </div>
            <img alt="" src="@/assets/img/order/order-complete.png">
          </div>
          <!-- ↓↓↓↓↓ table_wrap ↓↓↓↓↓ -->
          <div class="width-335">
            <div class="table_wrap">
              <!--<div class="new-no_table cf">-->
              <!--<dl class="h-76">-->
              <!--<dt>注文者</dt>-->
              <!--<dd class="t-right" v-if="this.data">{{this.data.orderer.ordererName}} </dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="pb-10 lh-1_43">お届け先情報</dt>-->
              <!--<dd class="t-right pb-10 lh-1_43" v-if="this.data">{{this.data.shippingAddress.receiverName}}</dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt></dt>-->
              <!--<dd class="t-right pb-10 lh-1_43" v-if="this.data">{{this.data.orderer.ordererContact1}}</dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt></dt>-->
              <!--<dd class="t-right pb-30 lh-1_5" v-if="this.data">-->
              <!--({{this.data.shippingAddress.receiverZipCd}}) {{this.data.shippingAddress.receiverAddress}}<br> {{this.data.shippingAddress.receiverDetailAddress}}-->
              <!--</dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="pb-28">ご希望のお届け日</dt>-->
              <!--<dd class="t-right pb-28">{{this.data.deliveryWishYmdt}}({{this.dayOfWeeks}})</dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="pb-28">ご希望のお届け時間帯</dt>-->
              <!--<dd class="t-right pb-28">{{this.data.deliveryTimeText}}</dd>-->
              <!--</dl>-->
              <!--<dl class="white-underline">-->
              <!--<dt class="pb-28">配送コメント</dt>-->
              <!--<dd class="t-right pb-28" v-if="this.data">{{this.data.deliveryMemo}}</dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="pt-29 pb-8 lh-1_43">総注文金額</dt>-->
              <!--<dd class="t-right pt-29 pb-8 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.standardAmt + this.data.lastOrderAmount.deliveryAmt + this.data.lastOrderAmount.remoteDeliveryAmt - this.data.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-10 lh-1_43">総合計</dt>-->
              <!--<dd class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.standardAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-30 lh-1_43">送料</dt>-->
              <!--<dd v-if="this.data.lastOrderAmount.deliveryAmt > 0" class="t-right warm-grey pb-30 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.deliveryAmt + this.data.lastOrderAmount.remoteDeliveryAmt - this.data.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></dd>-->
              <!--<dd class="t-right warm-grey pb-30 lh-1_25"><span class="wrapper-pc-font_family_c">送料無料</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="pb-10 lh-1_43">総割引金額</dt>-->
              <!--<dd class="t-right pb-10 lh-1_25">-<i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.immediateDiscountAmt + this.data.lastOrderAmount.additionalDiscountAmt + this.data.lastOrderAmount.productCouponDiscountAmt + this.data.lastOrderAmount.cartCouponDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-8 lh-1_43">割引</dt>-->
              <!--<dd class="t-right warm-grey pb-8 lh-1_25">-<i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.immediateDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-10 lh-1_43">特別割引</dt>-->
              <!--<dd class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.additionalDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-10 lh-1_43">商品クーポン</dt>-->
              <!--<dd class="t-right warm-grey pb-10 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.productCouponDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl>-->
              <!--<dt class="warm-grey pb-20 lh-1_43">カートクーポン</dt>-->
              <!--<dd class="t-right warm-grey pb-20 lh-1_25"><i class="size-14">￥</i><span class="wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.cartCouponDiscountAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--<dl class="white-underline">-->
              <!--<dt class="pb-20 lh-34">お支払金額</dt>-->
              <!--<dd class="t-right pb-20 red lh-34 tb-special"><span class="red_word"><i class="size-22">￥</i></span><span class="red_number wrapper-pc-font_family_c" v-if="this.data">{{MyMiliForma(this.data.lastOrderAmount.chargeAmt)}}</span></dd>-->
              <!--</dl>-->
              <!--</div>-->
            </div>
            <!-- ↑↑↑↑↑ table_wrap ↑↑↑↑↑ -->
            <div class="ordercom_info_area pt-21">
              <img alt="" src="@/assets/img/icon/ico_note.png">
              <div class="grey lh-1_43">マイページで注文履歴及び配送状況を確認することができます。</div>
            </div>
            <ul class="list_button pt-29">
              <li class="w-164">
                <button class="btn" @click.prevent="goToPage('MYPAGE')">マイページへ</button>
              </li>
              <li class="ml-7 w-164">
                <button class="btn btn_green btn_pd_0" @click.prevent="goToPage('HOME')">トップページへ戻る</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import PaymentConfirmNew from '@/components/mixins/order/PaymentConfirmNew'
import cookies from 'js-cookie'
import $ from 'jquery'

export default {
  name: 'PaymentConfirm',
  mixins: [PaymentConfirmNew],
  data () {
    return {
      data: '',
      dayOfWeeks: ''
    }
  },
  created () {
    // let url = process.env.VUE_APP_NCP_API_BASE_URL + 'profile/orders/' + this.orderNo
    // fetch(url, {
    //   headers: new Headers({
    //     'accessToken': cookies.get('ACCESS_TOKEN') || '',
    //     'clientId': process.env.VUE_APP_NCP_CLIENTID,
    //     'Version': '1.0',
    //     'platform': 'PC',
    //     'guestToken': cookies.get('guestToken') || ''
    //   })
    // }).then(response => {
    //   return response.json()
    // }).then(res => {
    //   this.data = res
    //   this.deliveryYmt()
    //   // console.log(this.data)
    // }).catch(function (error) {
    // })

    setTimeout(function () {
      let nextUrl = document.location.href
      if (opener) {
        opener.location.href = nextUrl.replace('paymentConfirm', 'paymentConfirm?orderNo=' + this.orderNo)
        self.close()
      } else {
      }
    }, 100)
  },
  methods: {
    goToPage (path) {
      if (path === 'HOME') {
        window.location.replace('/')
      } else {
        window.location.replace('/mypage')
      }
    },
    deliveryYmt: function () {
      if (this.data.deliveryWishYmdt) {
        let date = new Date(this.data.deliveryWishYmdt)
        let dayOfWeek = date.getDay()
        this.dayOfWeeks = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
      }
    }
  }
}
</script>
