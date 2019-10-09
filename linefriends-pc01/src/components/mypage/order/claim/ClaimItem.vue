<template>
  <tr>
    <td>
      <div class="cancel_check">
        <span class="bx_input">
          <input :id="`option_${option.orderOptionNo}`" type="checkbox" disabled="disabled" checked="true" v-if="type === 'cancel'">
          <input :id="`option_${option.orderOptionNo}`" type="checkbox" :checked="option.checked" @click="clickOption" v-else>
          <label :for="`option_${option.orderOptionNo}`"></label>
        </span>
      </div>
    </td>
    <td>
      <router-link :to="'/product/detail/' + option.productNo" class="product_info">
        <div class="product_img">
          <img :src="option.imageUrl">
        </div>
        <div class="detail_txt detail">
          <p class="sup_info" style="word-break: break-all;">{{option.productName | bytesFormat(98)}}</p>
          <p class="sub_info">{{option.optionTitle}}</p>
        </div>
      </router-link>
    </td>
    <td>
      <p class="mix_box">￥<span class="num">{{option.price.buyAmt | formatCurrency}}</span></p>
    </td>
    <td>
      <p class="mix_box"><span class="num">{{option.orderCnt}}</span> 件</p>
    </td>
    <td>
      <div class="cancel_num">
        <div class="bx_select size_m disabled" v-if="type === 'cancel'">
          <div class="txt_select">
            <span class="select_vle">{{option.showCnt}}</span>
            <span class="ico_arrow"></span>
          </div>
        </div>
        <vue-select-box class="size_m" :showValue="option.showCnt" :items="cntList" @selected="selectCnt" v-else />
      </div>
    </td>
  </tr>
</template>

<script>
import VueSelectBox from '@/components/common/VueSelectBox'

export default {
  props: ['option', 'type'],
  computed: {
    cntList () {
      let list = []
      for (let i = this.option.orderCnt; i >= 1; i--) {
        list.push({
          label: i,
          value: i
        })
      }
      return list
    }
  },
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
  },
  components: {
    VueSelectBox
  }
}
</script>
