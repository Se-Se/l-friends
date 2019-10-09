<template>
  <div class="photo_area  swiper-container">
    <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
      <swiper-slide v-for="(image, key) in images" :key="key">
        <div class="pic_con swiper-wrapper">
          <div class="bnr_img swiper-slide">
            <img :src="image">
          </div>
        </div>
      </swiper-slide>
      <template v-if="images.length > 1">
      <div class="swiper-pagination" slot="pagination"></div>
      </template>
    </swiper>
  </div>

</template>

<script>

export default {
  name: 'GoodsSlide',
  props: {
    images: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        loop: this.images.length > 1
      }

    }
  },
  mounted () {
  },
  methods: {
    callback () {
    }
  }
}
</script>

<style scoped>
.wrapper-sp .detail .pic_con {
  overflow: unset;
}
.wrapper-sp .detail .photo_area {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 37.5rem;
  background: #fafafa;
}
.wrapper-sp .detail .pic_con .bnr_img {
  height: 100%;
}
.wrapper-sp .detail .pic_con .bnr_img img {
  width: 100%;
  height: 100%;
}
.wrapper-sp .detail .pic_con.swiper-wrapper {
  width: 100%;
}
.wrapper-sp .swiper-container {
  width: 100%;
  height: 100%;
}
.bnr_img.swiper-slide.swiper-slide-active {
  width: 100% !important;
}
.swiper-pagination-bullet {
  margin: 2px !important;
}

</style>
