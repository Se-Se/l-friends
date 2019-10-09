<template>
<section>
  <div v-if="slideLength > 3">
    <div class="goods-swiper goods-active-swiper">
      <ul class="swiper-wrapper"
          :style="{ width: (goods.length * 100) + '%' }">
        <li v-for="(item, key) in goods" :key="key"
            class="swiper-slide goods-swiper__item">
          <goods-horizontal :goods="item"/>
        </li>
      </ul>
      <div class="goods-swiper__pagination"></div>
    </div>
    <div class="goods-swiper__btn">
      <div class="goods-swiper__btn--next"></div>
      <div class="goods-swiper__btn--prev"></div>
    </div>
  </div>
  <div v-else-if="slideLength <= 3">
    <div class="goods-swiper goods-swiper-single">
      <ul>
        <li v-for="(item, key) in goods" :key="key"
            class="goods-swiper__item goods-swiper-single__item">
          <goods-horizontal :goods="item"/>
        </li>
      </ul>
    </div>
  </div>
</section>
</template>
<script>
import Swiper from 'swiper/dist/js/swiper.js'
import GoodsHorizontal from './goodsItem/GoodsHorizontal'

export default {
  name: 'goods-swiper',
  components: {
    GoodsHorizontal
  },
  props: {
    goods: {
      required: false
    }
  },
  data () {
    return {
      active: 0,
      slideLength: null,
      lengthActive: null
    }
  },
  mounted () {
    this.lengthActive = true
    this.swiper = new Swiper('.goods-active-swiper', {
      slidesPerView: 3,
      spaceBetween: 20,
      slidesPerGroup: 3,
      navigation: {
        nextEl: '.goods-swiper__btn--next',
        prevEl: '.goods-swiper__btn--prev'
      },
      pagination: {
        el: '.goods-swiper__pagination',
        clickable: true
      }
    })
  },
  methods: {
    slideTo (index) {
      this.active = index
      this.swiper.slideTo(index)
    }
  },
  created () {
    this.slideLength = Object.keys(this.goods).length
  }
}
</script>

