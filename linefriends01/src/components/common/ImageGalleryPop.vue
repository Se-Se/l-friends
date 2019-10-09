<template>
  <div class="popup-layer">
    <div class="popup_common popup_size_6">
      <div class="roller_area">
        <div class="con">
          <div class="view-con">
            <div class="swiper-container slick-img">
              <swiper ref="galleryTop" :options="galleryTopOption" class="swiper-wrapper">
                <swiper-slide v-for="(imgUrl,index) in images" :key="index">
                  <div class="thumbnail">
                    <img class="item_img" :src="imgUrl" alt="">
                  </div>
                </swiper-slide>
              </swiper>
            </div>

            <button class="swiper-button-prev num" @click="lastImg()">prev<span>{{slideCount}}/{{images.length}}</span></button>
            <button class="swiper-button-next" @click="nextImg()">next</button>
            <div class="swiper-container slider-nav">
              <swiper class="swiper-wrapper" ref="galleryThumbs" :options="galleryThumbsOption">
                <swiper-slide :class="images.length === 1 ? 'swiper-slide-thumb-active' : ''" v-for="(imgUrl,index) in images" :key="index">
                  <div class="thumbnail" @click="toImg(index)">
                    <img class="item_img" :src="imgUrl" alt="">
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </div>
      </div>
      <button class="btn_close" @click="closePopup">close</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { addClass, removeClass } from '@/utils/utils'
import ProductImg from '@/components/common/ProductImgNew'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      slideCount: this.idx,
      popupOn: false,
      galleryThumbsOption: {
        slidesPerView: 4,
        freeMode: true,
        initialSlide: 0,
        watchSlidesVisibility: true,
        watchSlidesProgress: true
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
  props: {
    images: {},
    imgPointer: {
      default: false
    },
    idx: {
      default: 0
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    lastImg () {
      this.slideCount--
      if (this.slideCount === 0) {
        return 0
      }
    },
    nextImg () {
      this.slideCount++
      if (this.slideCount > this.images.length) {
        return 0
      }
    },
    toImg (index) {
      this.slideCount = index + 1
    },
    swiperSlideTo (index) {
      this.$refs.galleryTop.swiper.slideTo(index, 0, false)
      this.$refs.galleryThumbs.swiper.slideTo(index, 0, false)
    },
    closePopup () {
      this.$emit('closePop')
    }
  },
  mounted () {
    this.$nextTick(() => {
      let galleryTopThumbs = this.$refs.galleryTop.swiper.thumbs
      galleryTopThumbs.swiper = this.$refs.galleryThumbs.swiper
      galleryTopThumbs.init()
      this.swiperSlideTo(this.idx)
      this.swiperSlideTo(this.idx - 1)
    })
  }
}
</script>
<style lang="scss" scoped>
 .popup_common {
  background: #fff;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #5a5a5a;
  font-size: 14px;
  letter-spacing: 0;
  border-radius: 8px;
}
.popup-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(17, 17, 17, 0.5);
  z-index: 3000;
}
 .popup_size_6 {
  width: 680px;
  height: auto;
}
 .popup_common .roller_area {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  padding:60px 40px 60px;
  height: 670px;
}
 .popup_common.popup_size_6.roller_area {
  height: 670px;
  padding: 60px 0 0;
}

 .popup_common.popup_size_6 .view-con {
  position: relative;
  width: 436px;
  margin: 0 auto;
}
.popup_common.popup_size_6 .view-con .slick-img img{
  height:436px;
} 
.popup_common.popup_size_6 .view-con .slider-nav img{
  height:100%;
}
 .popup_common.popup_size_6 .view-con .slick-img,
 .popup_common.popup_size_6 .view-con .swiper-wrapper {
  position: relative;
}

 .popup_common.popup_size_6 .view-con .slick-img {
  width: 436px;
  height:436px;
}

.popup_common.popup_size_6 .view-con .slider-nav .swiper-slide {
  float: left;
}

 .popup_common.popup_size_6 .view-con .swiper-button-prev,
 .popup_common.popup_size_6 .view-con .swiper-button-next {
  min-width: 48px;
  width: auto;
  height: 48px;
  opacity: 0.5;
  z-index: 99;
  position: absolute;
  top: 251px;
  border-radius: 50%;
  color: transparent;
  font-size: 0;
  cursor: pointer;
  outline: none;
}

 .popup_common.popup_size_6 .view-con .swiper-button-prev.swiper-button-disabled,
 .popup_common.popup_size_6 .view-con .swiper-button-next.swiper-button-disabled {
  opacity: .2;
}

 .popup_common.popup_size_6 .view-con .swiper-button-prev {
  left: -102px;
  background: #333333 url("../../assets/images/pc/icons/mypage-review-icon-arrow-left.png") no-repeat 17px 14px;
}

.popup_common.popup_size_6 .view-con .swiper-button-next {
  background: #333;
  right: -102px;
  background: #333333 url("../../assets/images/pc/icons/mypage-review-icon-arrow-right.png") no-repeat 19px 14px;
}

 .popup_common.popup_size_6 .view-con .swiper-button-prev.num {
  border-radius: 24px;
}

 .popup_common.popup_size_6 .view-con .swiper-button-prev span {
  font-family: 'Volte';
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  padding: 0 26px 0 36px;
  line-height: 48px;
}


 .popup_common.popup_size_6 .view-con .slider-nav {
  position: relative;
  height: 94px;
  margin-top: 20px;
  font-size: 0;
  text-align: center;
  overflow: hidden;
}


 .popup_common.popup_size_6 .view-con .slider-nav .thumbnail {
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin: 0 5px;
  width: 94px !important;
  height: 94px !important;
  box-sizing: border-box;
  opacity: 0.2;
  border: solid 1px #999;
  user-select: none;
  cursor: pointer;
}

 .popup_common.popup_size_6 .view-con .slider-nav .swiper-slide.swiper-slide-thumb-active .thumbnail {
  border: solid 2px #00d664;
  opacity: 1;
}
.btn_close {
  width: 32px;
  height: 32px;
  display: block;
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0;
  background: url('../../assets/images/pc/icons/ico_close_coupon.png') no-repeat 0 0;
  background-size: 100% 100%;
}
</style>


