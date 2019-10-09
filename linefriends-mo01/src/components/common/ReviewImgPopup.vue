<template>
  <div class="popup-layer">
    <div class="popup_common popup_review">
      <div class="roller_area">
        <div class="con">
          <div class="view-con">
            <div class="swiper-container slick-img">
              <swiper ref="galleryTop" :options="galleryTopOption" class="swiper-wrapper">
                <swiper-slide v-for=" (imageUrl, index) in images" :key="index">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide">
                      <div class="thumbnail">
                        <img class="item_img" :src="imageUrl" alt="">
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
            <button class="swiper-button-prev num">prev<span><span class="current-index">1</span>/{{images.length}}</span></button>
            <button class="swiper-button-next">next</button>

            <div class="swiper-container slider-nav">
              <swiper class="swiper-wrapper" ref="galleryThumbs" :options="galleryThumbsOption">
                <swiper-slide v-for=" (imageUrl, index) in images" :key="index" :class="images.length === 1 ? 'swiper-slide-thumb-active' : ''">
                  <div class="swiper-wrapper">
                    <div class="swiper-slide">
                      <div class="thumbnail" @click="swiperSlideTo(index)">
                        <div class="btzmask"></div>
                        <img class="item_img" :src="imageUrl" alt="">
                      </div>
                    </div>
                  </div>
                </swiper-slide>
              </swiper>
            </div>

          </div>
        </div>
      </div>
      <button class="btn_close" @click="$emit('close')">close</button>
    </div>
  </div>

</template>
<script>
export default {
  name: 'ReviewImgPopup',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => {
        return []
      }
    },
    initialSlide: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      galleryTop: null,
      galleryThumbsOption: {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
      },
      galleryTopOption: {
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  methods: {
    swiperSlideTo (index) {
      this.$refs.galleryTop.swiper.slideTo(index, 0, false)
      this.$refs.galleryThumbs.swiper.slideTo(index, 0, false)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const galleryTop = this.$refs.galleryTop.swiper
      const galleryThumbs = this.$refs.galleryThumbs.swiper
      galleryTop.controller.control = galleryThumbs
      galleryThumbs.controller.control = galleryTop
      this.swiperSlideTo(this.initialSlide)
      this.swiperSlideTo(this.initialSlide - 1)
    })
  }
}
</script>
<style scoped>
.wrapper-sp
  .popup_common.popup_review
  .view-con
  .swiper-container.slider-nav
  .swiper-slide.swiper-slide-active
  .thumbnail {
  border: 0.2rem solid #00d664;
  opacity: 1;
}
</style>
