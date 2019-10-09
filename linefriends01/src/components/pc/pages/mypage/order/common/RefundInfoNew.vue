<template>
  <div class="old-css">
    <div class="bill">
      <slot name="title"></slot>
      <div class="bill_con">
        <div class="column_3">
          <table class="table_bill">
            <thead>
              <tr>
                <th>
                  <span class="ttl">환불 상품금액</span>
                </th>
                <th>
                  <strong class="amount">{{productAmtInfo.standardPrice + deliveryAmtInfo.totalAmt | formatCurrency}}원</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="newline">총 상품금액</span>
                </td>
                <td><span class="num">{{productAmtInfo.standardPrice | formatCurrency}}원</span></td>
              </tr>
              <tr>
                <td>
                  <span class="newline">환불 배송비</span>
                </td>
                <td><span class="num">{{deliveryAmtInfo.totalAmt | formatCurrency}}원</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column_3 equal">
          <table class="table_bill">
            <thead>
              <tr>
                <th>
                  <span class="ttl">차감금액</span>
                </th>
                <th>
                  <strong class="amount">{{subtractionAmtInfo.totalAmt + subtractionAmtInfo.refundAdjustAmt | formatCurrency}}원</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="newline">총 할인금액</span>
                  <div class="tip" v-if="subtractionAmtInfo.totalAmt > 0">
                    <div class="tip_popup size_2">
                      <dl v-if="productAmtInfo.additionalDiscountAmt > 0">
                        <dt>추가 할인</dt>
                        <dd><span class="num">{{productAmtInfo.additionalDiscountAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl v-if="productAmtInfo.immediateDiscountAmt > 0">
                        <dt>즉시 할인</dt>
                        <dd><span class="num">{{productAmtInfo.immediateDiscountAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl v-if="productAmtInfo.productCouponDiscountAmt > 0">
                        <dt>상품 쿠폰</dt>
                        <dd><span class="num">{{productAmtInfo.productCouponDiscountAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl v-if="subtractionAmtInfo.cartCouponAmt > 0">
                        <dt>장바구니 쿠폰</dt>
                        <dd><span class="num">{{subtractionAmtInfo.cartCouponAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl v-if="subtractionAmtInfo.deliveryCouponAmt > 0">
                        <dt>배송비 쿠폰</dt>
                        <dd><span class="num">{{subtractionAmtInfo.deliveryCouponAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <div class="total_pop">
                        <dl>
                          <dt>총 할인금액</dt>
                          <dd><span class="num">{{subtractionAmtInfo.totalAmt | formatCurrency}}</span>원</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </td>
                <td><span class="num">{{subtractionAmtInfo.totalAmt | formatCurrency}}</span>원</td>
              </tr>
              <tr>
                <td>
                  <span class="newline">환불 차감금액</span>
                  <div class="tip" v-if="subtractionAmtInfo.refundAdjustReason.length === 1">
                    <div class="tip_popup size_3">
                      <dl>
                        <dt>차감 사유</dt>
                        <dd>{{subtractionAmtInfo.refundAdjustReason[0]}}</dd>
                      </dl>
                    </div>
                  </div>
                </td>
                <td><span class="num">{{subtractionAmtInfo.refundAdjustAmt | formatCurrency}}원</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column_3">
          <table class="table_bill">
            <thead>
              <tr>
                <th>
                  <span class="ttl">환불 금액</span>
                </th>
                <th>
                  <strong class="amount">{{refundPayAmt | formatCurrency}}원</strong>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="newline">결제 취소금액</span>
                </td>
                <td><span class="num">{{refundMainPayAmt | formatCurrency}}원</span></td>
              </tr>
              <tr v-if="isExec">
                <td>
                  <span class="newline">임직원 포인트</span>
                </td>
                <td><span class="num">{{refundSubPayAmt | formatCurrency}}원</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: ['refundInfos'],
  data () {
    return {
      productAmtInfo: {
        totalAmt: 0,
        standardPrice: 0,
        immediateDiscountAmt: 0,
        additionalDiscountAmt: 0,
        productCouponDiscountAmt: 0
      },
      subtractionAmtInfo: {
        refundAdjustReason: [],
        refundAdjustAmt: 0,
        deliveryCouponAmt: 0,
        cartCouponAmt: 0,
        totalAmt: 0
      },
      deliveryAmtInfo: {
        totalAmt: 0
      },
      refundPayAmt: 0,
      refundMainPayAmt: 0,
      refundSubPayAmt: 0
    }
  },
  computed: {
    ...mapState('myorder', ['pointName']),
    ...mapGetters('profile', ['isExec'])
  },
  methods: {
    setAmt () {
      this.refundInfos.forEach(data => {
        this.productAmtInfo.totalAmt += data.productAmtInfo.totalAmt
        this.productAmtInfo.standardPrice += data.productAmtInfo.standardPrice
        this.productAmtInfo.immediateDiscountAmt += data.productAmtInfo.immediateDiscountAmt
        this.productAmtInfo.additionalDiscountAmt += data.productAmtInfo.additionalDiscountAmt
        this.productAmtInfo.productCouponDiscountAmt += data.productAmtInfo.productCouponDiscountAmt
        this.deliveryAmtInfo.totalAmt += data.deliveryAmtInfo.totalAmt
        let totalAmt = data.subtractionAmtInfo.cartCouponAmt + data.subtractionAmtInfo.deliveryCouponAmt + data.productAmtInfo.immediateDiscountAmt + data.productAmtInfo.additionalDiscountAmt + data.productAmtInfo.productCouponDiscountAmt
        this.subtractionAmtInfo.totalAmt += totalAmt
        if (data.subtractionAmtInfo.refundAdjustReason) {
          this.subtractionAmtInfo.refundAdjustReason.push(data.subtractionAmtInfo.refundAdjustReason)
        }
        this.subtractionAmtInfo.refundAdjustAmt += data.subtractionAmtInfo.refundAdjustAmt
        this.subtractionAmtInfo.deliveryCouponAmt += data.subtractionAmtInfo.deliveryCouponAmt
        this.subtractionAmtInfo.cartCouponAmt += data.subtractionAmtInfo.cartCouponAmt
        this.refundPayAmt += data.refundPayAmt
        this.refundMainPayAmt += data.refundMainPayAmt
        this.refundSubPayAmt += data.refundSubPayAmt
      })
    }
  },
  watch: {
    refundInfos () {
      this.productAmtInfo.totalAmt = 0
      this.productAmtInfo.standardPrice = 0
      this.productAmtInfo.immediateDiscountAmt = 0
      this.productAmtInfo.additionalDiscountAmt = 0
      this.productAmtInfo.productCouponDiscountAmt = 0
      this.deliveryAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.refundAdjustReason = []
      this.subtractionAmtInfo.refundAdjustAmt = 0
      this.subtractionAmtInfo.deliveryCouponAmt = 0
      this.subtractionAmtInfo.cartCouponAmt = 0
      this.refundPayAmt = 0
      this.refundMainPayAmt = 0
      this.refundSubPayAmt = 0
      this.setAmt()
    }
  },
  created () {
    this.setAmt()
  }
}
</script>
