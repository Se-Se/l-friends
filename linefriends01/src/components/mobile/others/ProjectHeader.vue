<template>
  <div class="project-header">
    <h2 class="project-header__title">
      {{ title }}
    </h2>
    <p
      v-if="coupon === true"
      class="project-header__layer"
    >
      <router-link :to="`/others/couponguides/${event.eventNo}`">쿠폰 안내</router-link>
    </p>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    coupon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('event', ['event'])
  }
}
</script>
<style lang="scss" scoped>
.project-header {
  position: relative;
}
.coupon-intro {
  position: absolute;
  left: 50%;
  top: 6.5rem;
  transform: translateX(-50%);
  border: 1px solid #eee;
  border-radius: 0.5rem;
  z-index: 10;
  padding: 2rem;
  width: 90vw;
  height: auto;
  background: #fff;
  font-family: 'Noto Sans KR';
  font-size: 1.2rem;
  font-weight: normal;
  line-height: normal;
  overflow: hidden;
  word-break: break-all;
}
</style>
