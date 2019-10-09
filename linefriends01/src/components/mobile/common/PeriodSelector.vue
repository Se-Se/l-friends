<template>
  <div class="period-selector__wrapper">
    <p class="period-selector-name">
      조회기간
    </p>
    <button-select
      v-model="period"
      :options="filters"
      @input="$emit('input', period)"
    />
  </div>
</template>

<script>
import ButtonSelect from '@/components/mobile/common/ButtonSelect'

export default {
  name: 'PeriodSelector',
  components: {
    ButtonSelect
  },
  params: ['value'],
  data () {
    return {
      period: this.value,
      filters: [
        {
          label: '1개월',
          value: 'one_month',
          active: '0'
        },
        {
          label: '3개월',
          value: 'three_month',
          active: '1'
        },
        {
          label: '6개월',
          value: 'six_month',
          active: '2'
        },
        {
          label: '전체',
          value: 'all',
          active: '3'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.period-selector {
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    border-bottom: 1px solid #ededed;
  }

  &-name {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: -0.01rem;
    color: #333;
    line-height: normal;
  }
}
</style>
