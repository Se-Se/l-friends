<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="coupon">
    <div class="wrap_category">
      <div class="category_left">
        <a href="#" class="btn_back" @click.prevent="goBack">Back</a>
      </div>
      <h2>クーポン</h2>
    </div>
    <div class="coupon-wrap">
      <div class="coupon-tab-block">
        <ul class="coupon-tab-list">
          <li class="coupon-tab-item mr-24" :class="cuponTab==='1' ? 'coupon-active' : ''" @click.prevent="changeTab(1)">
            <a href="#">使用可能</a>
          </li>
          <li class="coupon-tab-item" :class="cuponTab==='2' ? 'coupon-active' : ''" @click.prevent="changeTab(2)">
            <a href="#">使用済み/期限切れ</a>
          </li>
        </ul>
      </div>
      <div class="coupon-search-btn-block" v-if="cuponTab==='1'">
        <input type="text" id="cuponCode" placeholder="クーポンコードを入力して…" class="coupon-search-input">
        <button class="btn coupon-search-btn" @click.prevent="registerCoupon()">登録</button>
      </div>
      <!-- ↓↓↓↓↓ coupon_detail_area ↓↓↓↓↓ -->
      <cupon-list :cuponTab="cuponTab" />
      <!-- ↑↑↑↑↑ coupon_detail_area ↑↑↑↑↑ -->
    </div>
  </div>
  <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CuponList from '@/components/mypage/cupon/CuponList'
import $ from 'jquery'
import { Alert } from '@/components/common/modal'

export default {
  data () {
    return {}
  },
  components: {
    CuponList
  },
  computed: {
    ...mapState('mypage', ['cuponTab'])
  },
  methods: {
    ...mapActions('mypage', ['fetchCupon', 'fetchRegisterCoupon']),
    goBack () {
      this.$router.go(-1)
    },
    changeTab (index) {
      this.$router.replace({
        path: `/m/mypage/cupon/${index}`
      })
    },
    async registerCoupon () {
      let cuponCode = $('#cuponCode').val()
      if (cuponCode) {
        let ret = await this.fetchRegisterCoupon(cuponCode)
        if (ret) {
          Alert({ message: '割引クーポンが発行されました。' }).then(() => {
            this.$router.replace({
              path: `/m/mypage/cupon/${this.cuponTab}`
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
