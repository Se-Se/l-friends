<template>
  <thead>
    <tr>
      <th scope="col">
        <span class="bx_input check2">
          <input type="checkbox" id="select_all" v-if="checkEmptyCart" disabled>
          <input type="checkbox" id="select_all" v-model="checkAllGo" @change="checkAll" v-else>
          <label for="select_all">
            <span></span>
          </label>
        </span>
      </th>
      <th scope="col">{{ $t('layout.cart.goodsInfo') }}</th>
      <th scope="col">{{ $t('layout.cart.cnt') }}</th>
      <th scope="col">{{ $t('layout.cart.discountPriceExpected') }}</th>
      <th scope="col">{{ $t('layout.cart.deliveryPrice') }}</th>
      <th scope="col">{{ $t('layout.cart.order') }}</th>
    </tr>
  </thead>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data () {
    return {
      mychecked: false
    }
  },
  computed: {
    ...mapState('cart', ['cart']),
    ...mapGetters('cart', ['allChecked']),
    checkAllGo: {
      // getter
      get () {
        return this.allChecked
      },
      // setter
      set (newValue) {
        this.mychecked = newValue
      }
    },
    checkEmptyCart () {
      if (!this.cart) return true
      return this.cart && this.cart.deliveryGroups.length === 0
    }
  },
  methods: {
    checkAll () {
      this.$store.commit('cart/CHECK_ALL', this.mychecked)
      this.$store.dispatch('cart/calculate')
    }
  }
}
</script>
