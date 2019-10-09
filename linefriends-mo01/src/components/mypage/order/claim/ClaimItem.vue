<template>
  <div class="product_item">
    <div class="product_item_checkbox">
      <span class="bx_input">
        <input :id="`option_${option.orderOptionNo}`" type="checkbox" disabled="disabled" checked="true" v-if="type === 'cancel'">
        <input :id="`option_${option.orderOptionNo}`" type="checkbox" :checked="option.checked" @click="clickOption" v-else>
        <label :for="`option_${option.orderOptionNo}`"></label>
      </span>
    </div>
    <div class="product_item_cont">
      <router-link :to="'/product/detail/' + option.productNo" class="thumbnail_inner size_m">
        <div class="thumbnail">
          <img :src="option.imageUrl">
        </div>
      </router-link>
      <div class="product_info">
        <router-link :to="'/product/detail/' + option.productNo" class="product_title mt-0">
          {{option.productName}}
        </router-link>
        <p class="product_options">
          <span>{{option.optionTitle}}</span>
        </p>
        <div class="product_detail size_s">
          <dl class="product_detail_list dark">
            <dt><span class="order_new_font_weight">{{option.orderCnt}}</span> 件</dt>
          </dl>
          <dl class="product_detail_list dark">
            <dt>￥<span class="order_new_font_weight">{{option.price.buyAmt | formatCurrency}}</span></dt>
          </dl>
        </div>
        <div class="product_count disabled">
          <span class="bx_count">
            <button type="button" class="btn_plus">-</button>
            <input type="text" title="数量" :value="option.showCnt" class="count_input" disabled="disabled">
            <button type="button" class="btn_minus">+</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['option', 'type'],
  methods: {
    clickOption () {
      if (this.type === 'return') {
        this.option.checked = !this.option.checked
        this.$nextTick(() => {
          this.$emit('estimate')
        })
      }
    },
    selectCnt (value) {
      this.option.showCnt = value
      this.$nextTick(() => {
        this.$emit('estimate')
      })
    }
  }
}
</script>
