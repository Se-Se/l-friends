<template>
  <section class="status">
    <div class="status-content">
      <div
        :class="{
          'status-info': true,
          active: executives === false
        }"
      >
        <p class="status__name">
          <strong>{{ memberName | formatName }}</strong>
          {{ $t('common.sir') }}
        </p>
        <p class="status__welcome">
          {{ $t('common.welcome') }}
        </p>
        <button
          class="status__btn"
          type="button"
          @click="goProfile"
        >
          {{ $t('user.menu.updateInfo') }}
        </button>
      </div>
      <div
        v-if="isExec && welfareTotal"
        class="status-executives"
      >
        <p class="status-executives__title">
          {{ $t('executives.point') }}
        </p>
        <p class="status-executives__value">
          <span>{{ welfareTotal.totalAvailableAmt | formatCurrency }}</span>{{ $t('currency') }}
        </p>
      </div>
    </div>
    <ul class="status-delivery">
      <!-- <li class="status-delivery__item">
        <router-link to="/mypage/orderlist">
          <figure class="status-delivery__fig delivery">
            <img src="~@/assets/images/pc/icons/ic-delivery34x23.svg">
          </figure>
          <h2 class="status-delivery__title">
            {{ $t('order.delivering') }}
          </h2>
          <p class="status-delivery__cnt">
            {{ mySummary && mySummary.orderCountByStatus.deliveryIngCnt }}
          </p>
        </router-link>
      </li> -->
      <li class="status-delivery__item">
        <figure class="status-delivery__fig coupon">
          <img src="~@/assets/images/pc/icons/ic-coupon24x24.svg">
        </figure>
        <h2 class="status-delivery__title">
          {{ $t('user.couponBox') }}
        </h2>
        <router-link to="/mypage/mycoupon">
          <p class="status-delivery__cnt">
            {{ mySummary && mySummary.usableCouponCnt }}
          </p>
        </router-link>
      </li>
      <li class="status-delivery__item">
        <figure class="status-delivery__fig review">
          <img src="~@/assets/images/pc/icons/ic-review27x27.svg">
        </figure>
        <h2 class="status-delivery__title review__title">
          {{ $t('user.review') }}
        </h2>
        <router-link to="/mypage/myreview">
          <p class="status-delivery__cnt review__cnt">
            {{ mySummary && mySummary.reviewCnt }}
          </p>
        </router-link>
      </li>
      <li class="status-delivery__item">
        <figure class="status-delivery__fig wish">
          <img src="~@/assets/images/pc/icons/ic-wish26x23.svg">
        </figure>
        <h2 class="status-delivery__title">
          {{ $t('user.likeProduct') }}
        </h2>
        <router-link to="/mypage/like">
          <p class="status-delivery__cnt">
            {{ mySummary && mySummary.likeCnt }}
          </p>
        </router-link>
      </li>
    </ul>
  </section>
</template>
<script>
import status from '@/components/mixins/mypage/Status'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Status',
  mixins: [status],
  methods: {
    goProfile () {
      this.$router.push({
        path: '/mypage/profile'
      })
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec'])
  }
}
</script>
