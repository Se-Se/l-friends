<template>
  <div id="container" class="cart-order">
    <Breadcrumb :title="'カート'"></Breadcrumb>
    <div class="cart_wrapper">
      <template v-if="showItems && showItems.length">
        <cart-header :showItems="showItems" :checkedItems="checkedItems" />
        <delivery-card v-for="(delivery, idx) in showItems" :key="idx" :delivery="delivery" :checkedItems="checkedItems" />
        <cart-footer :calculate="calculate" :checkedItems="checkedItems" v-if="calculate" />
      </template>
      <template v-for="(deliverys,index) in showReservationItems">
        <delivery-card-rvt :delivery="delivery" v-for="(delivery,m) in deliverys" :key="index+'_cartrvt_'+m" :checkedItems="reservationCheckedItems[index] && reservationCheckedItems[index].length > 0 ?reservationCheckedItems[index]:[] " :idx="index" />
      </template>
      <div class="cart_none cart_none-height_auto" v-if="totalCount === 0">
        <div class="no_data cart-order_padding_new">
          <div class="no_data_img">
            <img src="@/assets/img/common/img_no_data.png" alt="">
          </div>
          <p class="no_data_text">カートには商品が入っていません。</p>
        </div>
      </div>
      <best-list type="cart" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/common/Breadcrumb'
import CartHeader from '@/components/escrow/cart/CartHeader'
import DeliveryCard from '@/components/escrow/cart/DeliveryCard'
import CartFooter from '@/components/escrow/cart/CartFooter'
import BestList from '@/components/common/BestList'
import DeliveryCardRvt from '@/components/escrow/cart/reservation/DeliveryCardRvt'

export default {
  name: 'Cart',
  computed: {
    ...mapState('cart', ['showItems', 'checkedItems', 'calculate', 'showReservationItems', 'reservationCheckedItems']),
    ...mapGetters('cart', ['totalCount'])
  },
  components: {
    Breadcrumb,
    CartHeader,
    DeliveryCard,
    CartFooter,
    BestList,
    DeliveryCardRvt
  }
}
</script>
