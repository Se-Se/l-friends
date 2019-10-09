<template>
  <div class="bill">
    <div class="bill_con">
      <div class="column_4">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">{{ $t('layout.cart.totalPrice') }}</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{this.showTotalItemPrice}}</strong>
                <span class="point bold">원</span> 
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4 plus">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">{{ $t('layout.cart.totalDiscountPrice') }}</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{this.showTotalDiscountAmount}}</strong>
                <span class="point bold">원</span> 
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4 equal">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">{{ $t('layout.cart.totalDeliveryPrice') }}</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{this.showTotalShippingCost}}</strong>
                <span class="point bold">원</span> 
                <em class="add_txt" v-if="havePayOnDelivery">({{ $t('layout.cart.exempt') }})</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">{{ $t('layout.cart.priceReady') }}</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount total">{{this.showPaymentAmount}}</strong>
                <span class="point bold">원</span> 
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import CartPriceInfoNew from '@/components/mixins/cart/CartPriceInfoNew'

export default {
  name: 'CartPriceInfoNew',
  mixins: [CartPriceInfoNew]
}
</script>
