<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <bread-crumbs breadCrumbs="クーポン"/>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <div class="mypage-content">
        <h1>クーポン<!-- 쿠폰함 --></h1>
        <div class="coupon">
          <div class="sec_nav_area area">
            <ul class="sec_nav_con">
              <li class="nav2_1" :class="cuponTab==='1' ? 'on' : ''" @click.prevent="changeTab(1)">
                <a href="#">使用可能クーポン</a>
              </li>
              <li class="nav2_2" :class="cuponTab==='2' ? 'on' : ''" @click.prevent="changeTab(2)">
                <a href="#">使用済み/期限切れクーポン</a>
              </li>
            </ul>
          </div>
          <div class="search_coupon_area area" v-if="cuponTab==='1'">
            <ul class="search_coupon_con">
              <li class="w-360">
                <input id="cuponCode" type="text" class="size_m" placeholder="クーポンコードを入力してください。">
              </li>
              <li class="coupon_login_btn">
                <button class="btn btn_green" @click.prevent="registerCoupon()">登録</button>
              </li>
            </ul>
          </div>
          <!-- ↓↓↓↓↓ coupon_detail_area ↓↓↓↓↓ -->
          <cupon-list :cuponTab="cuponTab" />
          <!-- ↑↑↑↑↑ coupon_detail_area ↑↑↑↑↑ -->
        </div>
      </div>
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->

  </div>
  <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
</template>
<script>
import { mapState, mapActions } from 'vuex'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import CuponList from '@/components/mypage/cupon/CuponList'
import $ from 'jquery'
import { Alert } from '@/components/common/modal'

export default {
  data () {
    return {}
  },
  components: {
    BreadCrumbs,
    CuponList
  },
  computed: {
    ...mapState('mypage', ['cuponTab'])
  },
  methods: {
    ...mapActions('mypage', ['fetchCupon', 'fetchRegisterCoupon']),
    changeTab (index) {
      this.$router.replace({
        path: `/mypage/cupon/${index}`,
        query: {
          time: new Date().getTime()
        }
      })
    },
    async registerCoupon () {
      let cuponCode = $('#cuponCode').val()
      if (cuponCode) {
        let ret = await this.fetchRegisterCoupon(cuponCode)
        if (ret) {
          Alert({ message: '割引クーポンが発行されました。' }).then(() => {
            this.$router.replace({
              path: `/mypage/cupon/${this.cuponTab}`,
              query: {
                time: new Date().getTime()
              }
            })
          })
        }
      } else {
        Alert('クーポンコードを入力してください。')
      }
    }
  }
}
</script>
