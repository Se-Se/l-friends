<template>
  <div class="popup-layer">
    <div class="popup_common popup_size_6">
      <div class="roller_area">
        <div class="con">
          <div class="view-con">
            <div class="swiper-container slick-img">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for=" (imageUrl, index) in images" :key="index">
                  <div class="thumbnail">
                    <img class="item_img" :src="imageUrl" alt="">
                  </div>
                </div>
              </div>
            </div>

            <button class="swiper-button-prev num">prev<span><span class="current-index">1</span>/{{images.length}}</span></button>
            <button class="swiper-button-next">next</button>

            <div class="swiper-container slider-nav">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for=" (imageUrl, index) in images" :key="index">
                  <div class="thumbnail">
                    <div class="btzmask"></div>
                    <img class="item_img" :src="imageUrl" alt="">
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <button class="btn_close" @click="$emit('close')">close</button>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import $ from 'jquery'
export default {
  data () {
    return {
      nowIndex: this.num
    }
  },
  props: {
    images: {},
    num: null
  },
  components: {
  },
  computed: {

  },

  methods: {
    swiperSlideTo (index) {
      this.galleryTop.slideTo(index, 0, false)
    },
    init () {
      $('.current-index').html(this.num)
    }
  },
  mounted () {
    this.init()
    this.galleryThumbs = new Swiper('.slider-nav', {
      slidesPerView: 4,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true
    })
    this.galleryTop = new Swiper('.slick-img', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      thumbs: {
        swiper: this.galleryThumbs
      },
      on: {
        slideChangeTransitionStart: function () {
          $('.current-index').html(this.activeIndex + 1)
        }
      }
    })
  }
}
</script>

<style scoped>
.current-index {
  padding: 0px !important;
}
</style>
