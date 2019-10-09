<template>
  <div
    class="coupon-list"
    v-scroll="couponScrollHandler"
  >
    <sub-page-header title="쿠폰함" />

    <border-tab-container
      class="coupon-tabs"
      :tabs="{ '사용가능 쿠폰': 0, '사용완료/기간만료 쿠폰': 1 }"
      :bus="tabBus"
    >
      <tab-content
        :tab-id="0"
        :bus="tabBus"
      >
        <div class="coupon-registe-form input-group inline">
          <app-input
            v-model="promotionCode"
            size="middle"
            class="coupon-code"
            placeholder="할인쿠폰코드를 입력하세요."
          />
          <app-button
            size="middle-semi"
            class="coupon-register"
            type="secondary"
            @click="registerCoupon"
          >
            등록하기
          </app-button>
        </div>
        <div class="coupon-log-list" v-if="getValidCoupons && getValidCoupons.totalCount > 0">
          <coupon-log
            v-for="(coupon, key) in getValidCoupons"
            :key="key"
            :coupon="coupon"
            class="coupon-log-list__item"
          />
        </div>
        <not-found
          v-else
          description="사용 가능한 쿠폰이 없습니다."
          :height="44.8"
        />
      </tab-content>
      <tab-content
        :tab-id="1"
        :bus="tabBus"
      >
        <div class="coupon-log-list" v-if="getNoValidCoupons && getNoValidCoupons.totalCount > 0">
          <coupon-log
            v-for="(coupon, key) in getNoValidCoupons"
            :key="key"
            :coupon="coupon"
            :expire="true"
            class="coupon-log-list__item" 
          />
        </div>
        <not-found
          v-else
          description="사용 가능한 쿠폰이 없습니다."
        />
      </tab-content>
    </border-tab-container>
  </div>
</template>

<script>
import Vue from 'vue'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BorderTabContainer from '@/components/mobile/common/tab/BorderTabContainer'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import TabContent from '@/components/mobile/common/tab/TabContent'
import CouponLog from '@/components/mobile/coupon/CouponLog'
import NotFound from '@/components/mobile/common/list/NotFound'

import ValidCouponNew from '@/components/mixins/mypage/coupon/ValidCouponNew'
import NoValidCouponNew from '@/components/mixins/mypage/coupon/NoValidCouponNew'

export default {
  name: 'CouponList',
  components: {
    SubPageHeader,
    BorderTabContainer,
    TabContent,
    AppInput,
    AppButton,
    CouponLog,
    NotFound
  },
  mixins: [ValidCouponNew, NoValidCouponNew],
  data () {
    return {
      tabBus: new Vue(),
      currentTab: 0,
      apiLoading: false
    }
  },
  mounted () {
    this.tabBus.$on('tab-change', id => {
      this.currentTab = id
    })
  },
  methods: {
    async couponScrollHandler (evt, el) {
      if (
        !this.apiLoading &&
        (window.scrollY + window.innerHeight / 1.5) >= document.querySelector('footer').offsetTop
      ) {
        this.apiLoading = true
        if (this.currentTab === 0 && this.getValidCoupons.length < this.getValidCoupons.totalCount) {
          await this.$store.dispatch('validCoupon/moreCoupons')
        } else if (this.currentTab === 0 && this.getNoValidCoupons.length < this.getNoValidCoupons.totalCount) {
          await this.$store.dispatch('validCoupon/moreNoCoupons')
        }
        this.apiLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon {
  &-registe-form {
    padding: 3.6rem 2rem;
  }

  &-code {
    width: calc(100% - 11.4rem);
  }

  &-register {
    width: 10.7rem;
  }

  &-log-list__item {

    &:last-child {
      margin-bottom: 0.4rem;
    }
  }
}

.input-group {
  &.inline {
    display: flex;

    > *:not(:last-child) {
      margin-right: 0.7rem;
    }
  }
}
</style>
