<template>
  <section class="main-slide swiper-container">
    <ul class="main-slide-images swiper-wrapper" :style="{ width: (images ? (images.length + 2) * 100 : 100) + '%' }">
      <li v-for="(image, key) in images" :key="key" class="main-slide-images__item swiper-slide">
        <img :src="image">
      </li>
    </ul>
    <template v-if="images.length > 1">
      <nav class="swiper-pagination" />
    </template>
  </section>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper.js'

export default {
  name: 'GoodsSlide',
  props: {
    product: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      swiper: null
    }
  },
  watch: {
    product () {
      this.initSlide()
    }
  },
  computed: {
    images () {
      return this.product ? this.product.baseInfo.imageUrls : []
    }
  },
  mounted () {
    this.initSlide()
  },
  methods: {
    initSlide () {
      if (this.images.length === 0) {
        return false
      }
      let loop = this.images.length > 1
      this.swiper = new Swiper('.main-slide', {
        loop,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      })
    },
    slideTo (index) {
      this.swiper.slideTo(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-slide {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 37.5rem;
  background: #fafafa;

  &-images {
    height: 100%;
    display: flex;

    &__item {
      height: 100%;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.swiper-pagination {
  width: 100%;
  position: absolute;
  bottom: 0.8rem;
  display: flex;
  justify-content: center;
  padding-top: 2.4rem;

  /deep/ &-bullet {
    border-radius: 100%;
    width: 0.6rem;
    height: 0.6rem;
    font-size: 0;
    background: #333;
    opacity: 0.1;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    &-active {
      opacity: 1;
    }
  }
}
</style>
