<template>
  <div class="pay-info">
    <div class="pay-info__header">
      <h2 class="pay-info__header--title">{{ $t('payInfo.title') }}</h2>
    </div>
    <div class="bill_con">
      <div class="column_3">
        <table class="pay-info__table">
          <colgroup>
            <col span="4" style="width:25%">
          </colgroup>
            <tbody>
              <tr>
                <td>
                  <div class="pay-info__wrap">
                    <div class="pay-info__item">
                      <p class="pay-info__item--title">{{ $t('payInfo.totalOrderPrice') }}</p>
                      <p class="pay-info__item--price">
                        <span>{{order.showPriceInfo.payAmt | formatCurrency}}</span>{{ $t('currency') }}
                      </p>
                    </div>
                    <div class="pay-info__bottom">
                      <ul class="pay-info__bottom--list">
                        <li class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.totalGoodsPrice') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.standardAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                        </li>
                        <li class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.totalDeliveryPrice') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.deliveryAmt+order.showPriceInfo.remoteDeliveryAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                          <div class="tip">
                            <div class="tip_popup size_1">
                              <dl>
                                <dt>{{ $t('payInfo.deliveryPrice') }}</dt>
                                <dd><span class="num">{{order.showPriceInfo.deliveryAmt | formatCurrency}}</span>{{ $t('currency') }}</dd>
                              </dl>
                              <dl>
                                <dt>{{ $t('payInfo.deliveryDiscountCouponPrice') }}</dt>
                                <dd><span class="num">(-){{order.showPriceInfo.deliveryCouponDiscountAmt | formatCurrency}}</span>{{ $t('currency') }}</dd>
                              </dl>
                              <dl>
                                <dt>{{ $t('payInfo.deliveryLocationPrice') }}</dt>
                                <dd><span class="num">{{order.showPriceInfo.remoteDeliveryAmt | formatCurrency}}</span>{{ $t('currency') }}</dd>
                              </dl>
                              <div class="total_pop">
                                <dl>
                                  <dt>{{ $t('payInfo.totalDeliveryPrice') }}</dt>
                                  <dd><span class="num">{{order.showPriceInfo.totalDeliveryAmt | formatCurrency}}</span>{{ $t('currency') }}</dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="pay-info__wrap equal">
                    <div class="pay-info__item">
                      <p class="pay-info__item--title">{{ $t('payInfo.totalDiscountPrice') }}</p>
                      <p class="pay-info__item--price">
                        <span>{{order.showPriceInfo.totalDisAmt | formatCurrency}}</span>{{ $t('currency') }}
                      </p>
                    </div>
                    <div class="pay-info__bottom">
                      <ul class="pay-info__bottom--list">
                        <li
                          v-if="order.showPriceInfo.immediateDiscountAmt"
                          class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.immediateDiscount') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.immediateDiscountAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                        </li>
                        <li
                          v-if="order.showPriceInfo.additionalDiscountAmt"
                          class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.employeeDiscount') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.additionalDiscountAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                        </li>
                        <li
                          v-if="order.showPriceInfo.productCouponDiscountAmt"
                          class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.goodsCoupn') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.productCouponDiscountAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                        </li>
                        <li
                          v-if="order.showPriceInfo.cartCouponDiscountAmt > 0"
                          class="pay-info__bottom--item">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.cartCoupon') }}</p>
                          <p class="pay-info__bottom--price">
                            <span>{{order.showPriceInfo.cartCouponDiscountAmt | formatCurrency}}</span>{{ $t('currency') }}
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
                <td v-if="isExec">
                  <div class="pay-info__item">
                    <p class="pay-info__item--title">{{ $t('payInfo.employeePoint') }}</p>
                    <p class="pay-info__item--price">
                      <span>{{order.showPriceInfo.subPayAmt | formatCurrency}}</span>{{ $t('currency') }}
                    </p>
                  </div>
                  <div class="pay-info__bottom">
                    <ul class="pay-info__bottom--list">
                      <li
                        class="pay-info__bottom--item">
                        <p class="pay-info__bottom--title">{{ $t('payInfo.employeePoint') }}</p>
                        <p class="pay-info__bottom--price">
                          <span>{{order.showPriceInfo.subPayAmt | formatCurrency}}</span>{{ $t('currency') }}
                        </p>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <div class="pay-info__wrap last">
                    <div class="pay-info__item __last">
                      <p class="pay-info__item--title">{{ $t('payInfo.totalPayPrice') }}</p>
                      <p class="pay-info__item--price pay-info__total">
                        <span class="total">{{order.showPriceInfo.chargeAmt | formatCurrency}}</span>{{ $t('currency') }}
                      </p>
                    </div>
                    <div class="pay-info__bottom pay-info__last">
                      <ul class="pay-info__bottom--list">
                        <li class="pay-info__bottom--item pay-total">
                          <p class="pay-info__bottom--title">{{ $t('payInfo.payType') }}</p>
                          <p class="pay-info__bottom--price">
                            {{order.payTypeLabel === '적립금 전액 사용' ? '임직원 포인트' : order.payTypeLabel}}{{order.payInfo && order.payInfo.cardInfo ? ' ' + order.payInfo.cardInfo.installmentLabel : ''}}<br>
                            <template v-if="order.payInfo && order.payInfo.cardInfo">
                              {{order.payInfo.cardInfo ? order.payInfo.cardInfo.cardName : ''}}
                              <i class="num">{{order.payInfo.cardInfo ? order.payInfo.cardInfo.cardNo : ''}}</i>
                            </template>
                          </p>
                        </li>
                        <template v-if="order.payType === 'VIRTUAL_ACCOUNT'">
                          <li class="pay-info__bottom--item">
                            <p class="pay-info__bottom--title">{{ $t('payInfo.bankName') }}</p>
                            <p class="pay-info__bottom--price">{{order.payInfo.bankInfo.bankName}}</p>
                          </li>
                          <li class="pay-info__bottom--item">
                            <p class="pay-info__bottom--title">{{ $t('payInfo.bankAccount') }}</p>
                            <p class="pay-info__bottom--price">{{order.payInfo.bankInfo.account}}</p>
                          </li>
                          <li class="pay-info__bottom--item">
                            <p class="pay-info__bottom--title">{{ $t('payInfo.bankExpiration') }}</p>
                            <p class="pay-info__bottom--price">{{ order.payInfo.bankInfo.paymentExpirationYmdt | dateFormatStr('yyyy-MM-dd HH:mm') }}</p>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>
<script>
import OrderDetailPaymentInfoNew from '@/components/mixins/mypage/order/detail/OrderDetailPaymentInfoNew'
import { mapGetters } from 'vuex'

export default {
  mixins: [OrderDetailPaymentInfoNew],
  computed: {
    ...mapGetters('profile', ['isExec'])
  }
}
</script>
<style lang="scss" scoped>
.tip {
  position: relative;
  cursor: pointer;
  width: 15px;
  height: 15px;
  margin-left: 2px;
  vertical-align: -1px;
  display: inline-block;
  background: url(~@/assets/images/payco/ico_tip.png) no-repeat 0 0;
}

.tip:hover {
  background: url(~@/assets/images/payco/ico_tip_on.png) no-repeat 0 0;
}

.tip:hover>.tip_popup {
  display: block;
  animation: showMenu 0.5s;
  -moz-animation: showMenu 0.5s;
  -webkit-animation: showMenu 0.5s;
  -o-animation: showMenu 0.5s;
  animation-fill-mode: forwards;

}

.tip_popup {
  display: none;
  border: solid 1px #969696;
  background-color: #fff;
  color: #5a5a5a;
  position: absolute;
  top: 0;
  left: 20px;
  font-size: 13px !important;
  padding: 20px;
  box-sizing: border-box;
  text-align: left;
  line-height: 32px;
  z-index: 9999;
  font-weight: normal;
}

.tip_popup dl {
  width: 100%;
  display: table;
  height: 19px;
  line-height: 19px;
  padding-bottom: 10px;
}

.tip_popup dl dt {
  color: #3c3c3c;
  display: table-cell;
}

.tip_popup dl dd {
  color: #5a5a5a;
  display: table-cell;
  text-align: right;
  padding-left: 20px;
}

.tip_popup dl dd span {
  font-weight: normal !important;
  font-family: NotoSansCJKkr-Regular !important;
}

.tip_popup .total_pop {
  border-top: 1px solid #e6e6e6;
  padding-top: 10px;
}

.tip_popup .total_pop dl {
  padding-bottom: 0;
}

.tip_popup .num {
  font-size: 13px !important;
}

.tip_popup.size_1,
.tip_popup.size_2,
.tip_popup.size_3 {
  white-space: nowrap;
}

.tip_popup.size_2>p {
  height: 19px;
  line-height: 19px;
}

.tip_popup.size_3 dl {
  padding-bottom: 0;
}

.tip_popup.size_3 dl dd {
  text-align: left;
  padding-left: 10px;
  white-space: normal;
  width: 156px;
  display: block;
}

.tip_popup.size_4 {
  width: 288px;
  line-height: 1.54
}
</style>