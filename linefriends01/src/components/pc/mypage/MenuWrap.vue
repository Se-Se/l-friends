<template>
  <div
    v-if="mode !== 'Profile' && mode !== 'Hack' && mode !== 'PasswordConfirm'"
    class="mypage-menu">
    <ul class="mypage-menu__wrap">
      <router-link to="/mypage/orderlist">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'OrderList'
        }"
      >
        {{ $t('delivery.title') }}
      </li>
      </router-link>
      <router-link to="/mypage/cancelList">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'CancelList'
        }"
      >
        {{ $t('return.title') }}
      </li>
      </router-link>
      <router-link to="/mypage/mycoupon">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          'active': mode === 'ValidCoupon' || mode == 'NoValidCoupon'
        }"
      >
        {{ $t('user.couponBox') }}
      </li>
      </router-link>
      <router-link to="/mypage/welfare">
      <li
        v-if="isExec"
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'Welfare'
        }"
      >
        {{ $t('executives.point') }}
      </li>
      </router-link>
      <router-link to="/mypage/myreview">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: child === 'myreview'
        }"
      >
        {{ $t('user.review') }}
      </li>
      </router-link>
      <router-link to="/mypage/myproductinquires">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'MyProductInquirys'
        }"
      >
        {{ $t('contactUs.title') }}
      </li>
      </router-link>
      <router-link to="/mypage/inquiry">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'ProfileInquiries'
        }"
      >
        {{ $t('menu.inquiry') }}
      </li>
      </router-link>
      <router-link to="/mypage/like">
      <li
        :class="{
          'mypage-menu__item': true,
          'executives': !isExec,
          active: mode === 'LikeProducts'
        }"
      >
        {{ $t('user.likeProduct') }}
      </li>
      </router-link>
    </ul>
    <div
      v-if="mode === 'review'"
      class="mypage-review"
    >
      <ul class="mypage-review__wrap"
        <li class="mypage-review__item active">
          <a href="#">{{ $t('button.reviewAdd') }}</a>
        </li>
        <li class="mypage-review__item">
          <a href="#">{{ $t('button.myReviews') }}</a>
        </li>
      </ul>
    </div>
    <div
      v-if="mode === 'ValidCoupon' || mode === 'NoValidCoupon'"
      class="mypage-review"
    >
      <ul class="mypage-review__wrap">
        <li
          :class="{
            'mypage-review__item':true,
            'active': mode === 'ValidCoupon'
          }"
        >
          <router-link to="/mypage/mycoupon">사용가능 쿠폰</router-link>
        </li>
        <li
          :class="{
            'mypage-review__item':true,
            'active': mode === 'NoValidCoupon'
          }"
        >
          <router-link to="/mypage/novalidcoupon">사용완료/기간만료 쿠폰</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MenuWrap',
  props: {
    mode: {
      type: String,
      default: ''
    },
    executives: {
      type: Boolean,
      required: false
    },
    child: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec'])
  }
}
</script>
