<template>
  <div class="detail-reserve">
    <h2 class="detail-reserve__title">
      {{ $t('goods.detailReserve.title') }}
    </h2>
    <div
      :class="{
        'detail-reserve__list': true,
        '_fixed': mode === 'fixed'
      }"
    >
      <dl>
        <dt>
          {{ $t('goods.detailReserve.orderDate') }}
        </dt>
        <dd>
          {{ reserve.reservationData.reservationStartYmdt | dateFormatStr('yyyy.MM.dd') }} ~
          {{ reserve.reservationData.reservationEndYmdt | dateFormatStr('yyyy.MM.dd') }}
          <template v-if="isPreOrderPeriod">
            (<span class="detail-reserve__date">{{ reservationLeftDate }}</span>{{ $t('goods.detailReserve.dDay') }})
          </template>
        </dd>
      </dl>
      <dl>
        <dt>
          {{ $t('goods.detailReserve.deliveryDate') }}
        </dt>
        <dd>
          {{ reserve.reservationData.reservationDeliveryYmdt | dateFormatStr('yyyy.MM.dd') }}{{ $t('goods.detailReserve.dayDelivery') }}
        </dd>
      </dl>
      <dl>
        <dt>
          {{ $t('goods.detailReserve.deliveryPrice') }}
        </dt>
        <dd>
          {{ reserve.deliveryFee ? reserve.deliveryFee.defaultDeliveryConditionLabel : '-' }}
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>

export default {
  name: 'DetailReserve',
  props: {
    mode: {
      type: Boolean,
      required: false
    },
    reserve: {
      type: [Array, Object],
      required: false
    }
  },
  computed: {
    reservationLeftDate () {
      return Math.ceil((new Date(this.reserve.reservationData.reservationEndYmdt.replace(' ', 'T')) - new Date()) / (1000 * 3600 * 24))
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.reserve && this.reserve.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.reserve.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.reserve.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    }
  }
}
</script>
