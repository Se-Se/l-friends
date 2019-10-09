<template>
  <div class="point-log">
    <dl class="point-log__item">
      <dt class="point-log__label">
        일자
      </dt>
      <dd class="point-log__value">
        <span class="number semibold">{{ point.registerYmdt.substring(0, 16).replace(/-/g, '.') }}</span>
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        적립내역
      </dt>
      <dd class="point-log__value">
        {{ point.reasonDetail }}
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        적립
      </dt>
      <dd
        v-if="point.accumulationStatus === 'GIVE_AVAILABLE' || point.accumulationStatus === 'SUBTRACTION_CANCELED'"
        class="point-log__value"
      >
        <span class="number semibold">{{ MyMiliFormat(point.accumulationAmt) }}</span>{{ $t('currency') }}
      </dd>
      <dd
        v-else
        class="point-log__value"
      >
        -
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        차감
      </dt>
      <dd
        v-if="point.accumulationStatus === 'SUBTRACTION_USED'"
        class="point-log__value"
      >
        <span class="number semibold">{{ MyMiliFormat(point.accumulationAmt) }}</span>{{ $t('currency') }}
      </dd>
      <dd
        v-else
        class="point-log__value"
      >
        -
      </dd>
    </dl>
    <dl class="point-log__item">
      <dt class="point-log__label">
        유효기간
      </dt>
      <dd
        v-if="point.accumulationStatus === 'GIVE_AVAILABLE' || point.accumulationStatus === 'SUBTRACTION_CANCELED'"
        class="point-log__value"
      >
        <span class="number semibold">{{ point.registerYmdt.substring(0, 16).replace(/-/g, '.') }}<br> - {{ point.expireYmdt.substring(0, 16).replace(/-/g, '.') }}</span>
      </dd>
      <dd
        v-else
        class="point-log__value"
      >
        -
      </dd>
    </dl>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'

export default {
  name: 'PointLog',
  props: {
    point: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    MyMiliFormat (num) {
      return formatCurrency(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.point-log {
  padding: 3.2rem 2rem;

  &__item {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;

    &:not(:last-child) {
      margin-bottom: 0.8rem;
    }
  }

  &__label {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__value {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__value {
    text-align: right;
    font-weight: bold;

    .number {
      font-size: 1.6rem;
      line-height: 1.6;
    }
  }
}
</style>
