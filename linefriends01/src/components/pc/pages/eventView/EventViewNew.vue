<template>
  <div id="container" class="event payco" v-if="event">
    <div class="findingprocess">
      <!--상단(기획전 명, 다른 기획전 셀렉터)-->
      <template v-if="event && event.top && event.top.pc.url">
        <div class="area_event_banner" v-if="event.top.pc.type === 'HTML'" v-html="event.top.pc.url">
        </div>
        <div class="area_event_banner" v-else>
          <img :src="event.top.pc.url" alt="">
        </div>
      </template>
      <!--쿠폰-->
      <EventCoupon></EventCoupon>
      <!--상품섹션-->
      <EventProduct></EventProduct>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EventCoupon from './leaf/EventCouponNew'
import EventProduct from './leaf/EventProductNew'
import config from '@/config'
import $ from 'jquery'
import { gaEventViewPromotion } from '@/utils/gaEventUtils'
export default {
  components: {
    EventCoupon,
    EventProduct
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    ...mapActions('event', ['fetchEventDetail'])
  },
  beforeCreate () {
    const empNo = sessionStorage.getItem('empNo')
    if (this.$route.path === config.internalEventPath && !empNo) {
      window.location.href = '/member/internal?next=' + this.$route.fullPath
    }
  },
  mounted () {
    this.fetchEventDetail({ eventNo: this.$route.params.eventNo, isMain: true }).then(() => {
      if (this.$route.hash && $(this.$route.hash).offset()) {
        $('body,html').scrollTop($(this.$route.hash).offset().top)
      }
      gaEventViewPromotion(this.event)
    })
  }
}
</script>

<style lang="scss">
#wrap.pc #container.payco {
  padding-top: 161px;

  @import "~@/styles/pc/payco/index.scss";
}
.findingprocess {
  font-size: 0;
}
</style>
