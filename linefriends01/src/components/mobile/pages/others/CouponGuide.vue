<template>
<div>
  <sub-page-header 
    title="쿠폰안내"
    close
  />
  <div
    v-if="event && event.coupon && event.coupon.guideImageUrl"
    id="container"
    class="guide"
  >
    <div
      class="coupon-guide"
      v-html="event.coupon.guideImageUrl"
    />
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'

export default {
  name: 'ProjectTitle',
  components: {
    SubPageHeader
  },
  computed: {
    ...mapState('event', ['event'])
  },
  mounted () {
    this.$store.dispatch('event/fetchEventDetail', {eventNo: this.$route.params.eventNo, isMain: true})
  }
}
</script>
<style lang="scss" scoped>
 .coupon-guide {
  padding: 3.2rem 2rem;
  font-size: 1.4rem;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #666666;
 }
</style>

