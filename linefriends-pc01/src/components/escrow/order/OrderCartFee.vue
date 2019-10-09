<template>
    <td class="rowspan02">
        <span class="num">
            <template v-if="!option.deliverable">
                <i class="uom2">￥</i>0
            </template>
            <template v-else-if="!option.free">
                <i class="uom2">￥</i>{{option.showShippingFee}}<template v-if="option.deliveryPayType === 'PAY_ON_DELIVERY'">(着払い)</template>
            </template>
            <template v-else>
                無料
            </template>
        </span>
        <div class="tip">
            <div class="tip_popup size_2">
                <i class="tip_notes_ico"></i>
                <p class="tip_notes">送料は東京基準となっており、<br>配送地域によって異なります。</p>
            </div>
        </div>
    </td>
</template>

<script>
export default {
  props: ['option']
}
</script>

<style scoped>

</style>
