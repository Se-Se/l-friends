<template>
  <div>
    <div class="header_menu">
      <a @click.prevent="showMenu()" class="btn_menu">Menu</a>
    </div>
    <h1 class="header_title">
      <a href="/m" class="logo">LINE FRIENDS</a>
    </h1>
    <ul class="header_tools">
      <li>
        <router-link to="/m/search" class="btn_search">Search</router-link>
      </li>
      <li>
        <router-link to="/m/cart" class="btn_cart">Cart
          <span class="data">{{count}}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'HeaderTop',
  data () {
    return {
    }
  },
  methods: {
    showMenu () {
      this.$emit('showHamberger')
    }
  },
  computed: {
    ...mapState('cart', ['count'])
  }
}
</script>
