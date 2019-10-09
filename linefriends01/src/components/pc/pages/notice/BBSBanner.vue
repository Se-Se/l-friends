<template>
  <div v-if="_bbsBanners && _bbsBanners.length > 0" class="bbs_banner">
    <div class="bg-left_color" :style="{'background-color': _bbsBanners[currentIndex].leftSpaceColor}"></div>
    <div class="bg-right_color" :style="{'background-color': _bbsBanners[currentIndex].rightSpaceColor}"></div>
    <slick :options="footSlickOptions" @beforeChange="beforeChange" @init="initSlick" class="btm_bnr swiperCon">
      <div class="bnr_img" v-for="banner in _bbsBanners">
        <FootBanner :banner="banner" />
      </div>
    </slick>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Slick from 'vue-slick'
import FootBanner from '@/components/pc/common/FootBanner'

export default {
  components: {
    Slick,
    FootBanner
  },
  data () {
    return {
      currentIndex: 0,
      footSlickOptions: {
        adaptiveHeight: true,
        arrows: false,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear'
      }
    }
  },
  computed: {
    ...mapGetters('board', ['_bbsBanners'])
  },
  methods: {
    beforeChange (event, slick, currentSlide, nextSlide) {
      this.currentIndex = nextSlide
      this.updateArrow(nextSlide, slick)
    },
    initSlick (event, slick) {
      this.updateArrow(slick.currentSlide, slick)
    },
    updateArrow (currentIndex, slick) {
      let prevArrowOptions = `<button class="slick-prev slick-arrow" aria-label="Previous" type="button" aria-disabled="false">${currentIndex + 1} / ${slick.slideCount}</button>`
      let nextArrowOptions = `<button class="slick-next slick-arrow" aria-label="Next" type="button" aria-disabled="false">${currentIndex + 1} / ${slick.slideCount}</button>`
      slick.setOption('prevArrow', prevArrowOptions, true)
      slick.setOption('nextArrow', nextArrowOptions, true)
    }
  }
}
</script>

