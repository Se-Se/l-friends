<template>
  <div>
    <h2>{{titleLabel}}</h2>
    <div class="bx_tit_step">
      <div :class="['tit_step', {'on' : type === 'cart'}]">カート</div>
      <div :class="['tit_step', {'on' : type === 'ordersheet'}]">注文・決済</div>
      <div :class="['tit_step', {'on' : type === 'paymentconfirm'}]">注文完了</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type'],
  computed: {
    titleLabel () {
      if (this.type === 'cart') {
        return 'カート'
      } else if (this.type === 'ordersheet') {
        return '注文・決済'
      } else {
        return '注文完了'
      }
    }
  }
}
</script>
