<template>
  <div id="container" class="event" v-if="event">
    <div class="event_coupon">
      <template v-if="event && event.top && event.top.pc.url">
        <div class="event_head" v-if="event.top.pc.type === 'HTML'" v-html="_xssFilter(event.top.pc.url)">
        </div>
        <div class="event_head" v-else>
          <img :src="event.top.pc.url" alt="">
        </div>
      </template>
      <div class="event_contents">
        <EventCoupon></EventCoupon>
        <EventProduct></EventProduct>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EventCoupon from './leaf/EventCoupon'
import EventProduct from './leaf/EventProduct'
import { xssFilter } from '@/utils/utils'
// import config from '@/config'
// import $ from 'jquery'

export default {
  components: {
    EventCoupon,
    EventProduct
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    },
    ...mapActions('event', ['fetchEventDetail'])
  },
  beforeCreate () {
    // const empNo = sessionStorage.getItem('empNo')
    // console.log(empNo, this.$route.path, config.internalEventPath)
    // if (this.$route.path === config.internalEventPath && !empNo) {
    //   window.location.href = '/member/internal?next=' + this.$route.fullPath
    // }
  },
  mounted () {
    this.fetchEventDetail({ eventNo: this.$route.params.eventNo, isMain: true }).then(() => {
      // if (this.$route.hash && $(this.$route.hash).offset()) {
      //   $('body,html').scrollTop($(this.$route.hash).offset().top)
      // }
    })
  }
}
</script>
