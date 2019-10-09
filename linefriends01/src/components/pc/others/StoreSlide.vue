<template>
  <section
    class='store-slide'
  >
    <ul
      class='swiper-wrapper store-slide__swiper'
      :style="{ width: (slides.length * 100) + '%' }"
    >
      <li
        v-for="(slide, key) in slides"
        :key="key"
        :style="{ height: window.height + 'px' }"
        class="store-slide__item swiper-slide"
      >
        <figure class="store-slide__fig">
          <img :src="slide.image">
        </figure>
        <div
          class='store-slide__wrapper'
          :style="{ height: window.height + 'px' }"
        >
        </div>
      </li>
    </ul>
    <div class="goods-swiper__pagination _store"></div>
  </section>
</template>
<script>
import * as $ from 'jquery'
import Swiper from 'swiper/dist/js/swiper.js'

export default {
  name: 'StoreSlide',
  data () {
    return {
      active: 0,
      fullHeight: 0,
      overView: false,
      window: {
        width: 0,
        height: 740
      },
      slides: [
        {
          image: '/static/images/pc/store/store-newyork.png'
        },
        {
          image: '/static/images/pc/store/store-japan.png'
        },
        {
          image: '/static/images/pc/store/store-china.png'
        },
        {
          image: '/static/images/pc/store/store-la.png'
        },
        {
          image: '/static/images/pc/store/store-itaewon.png'
        },
        {
          image: '/static/images/pc/store/store-hongdae.png'
        }
      ],
      swiper: null
    }
  },
  mounted () {
    this.swiper = new Swiper('.store-slide', {
      autoplay: {
        delay: 4000
      },
      pagination: {
        el: '.goods-swiper__pagination',
        clickable: true
      },
      effect: 'slide',
      slidesPerView: '1',
      roundLengths: true,
      simulateTouch: false
    })
  },
  created () {
    window.addEventListener('load', this.handleResize)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = $('.store-slide__fig').outerHeight()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
