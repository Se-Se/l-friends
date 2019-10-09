<template>
  <div id="container" class="cart-order" v-if="order">
    <div class="wrap_category">
      <h2>お届け先の変更</h2>
      <div class="category_right">
        <a href="javascript:" class="btn_close" @click.prevent="goBack">Close</a>
      </div>
    </div>
    <edit-body :address="order.shippingAddress" :deliveryMemo="order.deliveryMemo" :deliveryWishYmdt="order.deliveryWishYmdt" :deliveryTimeText="order.deliveryTimeText" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import EditBody from '@/components/mypage/order/detail/EditBody'

export default {
  computed: {
    ...mapState('myorder', ['order'])
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },
  components: {
    EditBody
  }
}
</script>
