<template>
  <div>
    <template v-if="event && event.top && event.top.mobile.url">
      <div class="area_event_banner" v-if="event.top.mobile.type === 'HTML'" v-html="event.top.mobile.url">
      </div>
      <div class="area_event_banner" v-else>
        <img :src="event.top.mobile.url" alt="">
      </div>
    </template>
    <div v-if="event && event.coupon && event.coupon.coupons.length > 0" class="project-detail__coupon">
      <coupon-container>
        <div class="project-detail__coupon-title">
          <project-header title="쿠폰 혜택" :coupon="true" />
        </div>
        <div class="project-detail__coupon-item">
          <coupon-item v-for="(item, index) in event.coupon.coupons" :key="index" :coupon="item" />
        </div>
      </coupon-container>
    </div>
    <div v-if="event && event.sectionMenu && event.sectionMenu.length > 0" class="project-detail__goods">
      <project-tabs v-if="event.sectionMenu.length > 1" />
      <main-article :padding-top="2">
        <div v-for="(section, index) in event.sectionMenu" :key="index" :id="`event-${index}`" class="project-detail__goods-list">
          <template v-if="section.products.length > 0">
            <div class="project-detail__goods-title">
              <project-header :title="section.label" :coupon="false" />
            </div>
            <goods-list :goods="section.products" />
          </template>
        </div>
      </main-article>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CouponContainer from '@/components/mobile/others/CouponContainer'
import ProjectHeader from '@/components/mobile/others/ProjectHeader'
import CouponItem from '@/components/mobile/others/CouponItem'
import ProjectTabs from '@/components/mobile/others/ProjectTabs'
import GoodsList from '@/components/mobile/goods/GoodsList'
import MainArticle from '@/components/mobile/main/MainArticle'
import $ from 'jquery'
import { gaEventViewPromotion } from '@/utils/gaEventUtils'
export default {
  name: 'EventViewNew',
  components: {
    CouponContainer,
    ProjectHeader,
    CouponItem,
    ProjectTabs,
    GoodsList,
    MainArticle
  },
  computed: {
    ...mapState('event', ['event'])
  },
  methods: {
    ...mapActions('event', ['fetchEventDetail'])
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

<style lang="scss" scoped>
.area_event_banner {
  font-size: 0;
}

/deep/ img {
  max-width: 100% !important;
  // height: auto !important;
}
</style>
