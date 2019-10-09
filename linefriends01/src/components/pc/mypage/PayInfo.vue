<template>
  <div class="pay-info">
    <div class="pay-info__header">
      <h2 class="pay-info__header--title">
        {{ $t('payInfo.title') }}
      </h2>
    </div>
    <table class="pay-info__table">
      <colgroup>
        <col
          style="width: 33%;"
          span="3"
        >
      </colgroup>
      <tbody>
        <tr>
          <td>
            <div class="pay-info__item">
              <p class="pay-info__item--title">
                {{ $t('payInfo.totalOrderPrice') }}
              </p>
              <p class="pay-info__item--price">
                <span>{{ totalOrderPrice }}</span>{{ $t('currency') }}
              </p>
            </div>
            <div class="pay-info__bottom">
              <ul class="pay-info__bottom--list">
                <li class="pay-info__bottom--item">
                  <p class="pay-info__bottom--title">
                    {{ $t('payInfo.totalGoodsPrice') }}
                  </p>
                  <p class="pay-info__bottom--price">
                    <span>{{ totalGoodsPrice }}</span>{{ $t('currency') }}
                  </p>
                </li>
                <li class="pay-info__bottom--item">
                  <p class="pay-info__bottom--title">
                    {{ $t('payInfo.totalDeliveryPrice') }}
                  </p>
                  <p class="pay-info__bottom--price">
                    <span>{{ totalDeliveryPrice }}</span>{{ $t('currency') }}
                  </p>
                </li>
              </ul>
            </div>
          </td>
          <td>
            <div class="pay-info__item">
              <p class="pay-info__item--title">
                {{ $t('payInfo.totalDiscountPrice') }}
              </p>
              <p class="pay-info__item--price">
                -<span>{{ totalDiscountPrice }}</span>{{ $t('currency') }}
              </p>
            </div>
            <div class="pay-info__bottom">
              <ul class="pay-info__bottom--list">
                <li class="pay-info__bottom--item">
                  <p class="pay-info__bottom--title">
                    {{ $t('payInfo.goodsCoupn') }}
                  </p>
                  <p class="pay-info__bottom--price">
                    <span>{{ goodsCouponPrice }}</span>{{ $t('currency') }}
                  </p>
                </li>
              </ul>
            </div>
          </td>
          <td>
            <div class="pay-info__item pay-info__last">
              <p class="pay-info__item--title">
                {{ $t('payInfo.totalPayPrice') }}
              </p>
              <p class="pay-info__item--price pay-info__total">
                <span class="total">{{ totalPrice }}</span>{{ $t('currency') }}
              </p>
            </div>
            <div class="pay-info__bottom pay-info__last">
              <ul class="pay-info__bottom--list">
                <li class="pay-info__bottom--item pay-total">
                  <p class="pay-info__bottom--title">
                    {{ $t('payInfo.totalGoodsPrice') }}
                  </p>
                  <p class="pay-info__bottom--price">
                    {{ $t('payInfo.orderType.creditCard') }}
                  </p>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'PayInfo',
  props: {
    orderDetails: {
      type: Object,
      required: true
    }
  },
  computed: {
    totalOrderPrice () {
      return (this.orderDetails.price + this.orderDetails.deliveryPrice).toLocaleString()
    },
    totalGoodsPrice () {
      return this.orderDetails.price.toLocaleString()
    },
    totalDeliveryPrice () {
      return this.orderDetails.deliveryPrice.toLocaleString()
    },
    totalDiscountPrice () {
      return this.orderDetails.couponPrice.toLocaleString()
    },
    goodsCouponPrice () {
      return this.orderDetails.couponPrice.toLocaleString()
    },
    totalPrice () {
      return ((this.orderDetails.price + this.orderDetails.deliveryPrice) - this.orderDetails.couponPrice).toLocaleString()
    }
  }
}
</script>
