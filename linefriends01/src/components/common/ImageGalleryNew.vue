<template>
  <span>
    <ul class="lst_thumb">
      <template v-for=" (imageUrl, index) in images.slice(0,6)">
        <li :key="index" :class="{view_more: index===5}">
          <a href="javascript:" @click="openPopup(index)">
            <img :src="imageUrl" alt="리뷰사진"  width="100" height="100" :style="imgPointer ? 'cursor: pointer;' : ''">
            <!-- <product-img :image='imageUrl'></product-img> -->
          </a>
        </li>
      </template>
    </ul>
    <ImageGalleryPop :images="images" :idx="slideCount" @closePop="closePopup" v-if="popupOn" />
  </span>
</template>

<script>
import ImageGalleryPop from '@/components/common/ImageGalleryPop'
import Slick from 'vue-slick'
import $ from 'jquery'
import { addClass, removeClass } from '@/utils/utils'
import ProductImg from '@/components/common/ProductImgNew'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      slideCount: 0,
      slideFrist: 0,
      popupOn: false,
      bodyScrollTop: 0,
      pdoptions1: {
        fade: true,
        infinite: true,
        arrows: true,
        centerMode: true
      },
      localImgIndex: '',
      galleryThumbsOption: {
        slidesPerView: 4,
        freeMode: true,
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
    }
  },
  components: {
    ImageGalleryPop
  },
  computed: {
  },
  methods: {
    openPopup (index) {
      this.popupOn = true
      this.slideCount = index + 1
    },
    closePopup () {
      this.popupOn = false
      this.slideCount = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.review_photo_popup .popup_inner .btn_close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 25px;
}

.review_photo_popup .popup_inner .btn_close .sp {
  display: block;
  width: 28px;
  height: 28px;
  background-position: -206px -48px;
}
.basic_popup .popup_wrap {
  display: inline-block;
  position: relative;
  text-align: left;
  vertical-align: middle;
  width: 680px;
  height: 660px;
  padding: 40px;
  box-sizing: border-box;
  background-color: #fff;
}

.review_photo_popup {
  display: inline-block;
  height: 100%;
  position: relative;
  z-index: 40;
  border: 0;
  vertical-align: middle;
}

.review_photo_popup:before {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  content: "";
}

.review_photo_popup .popup_inner {
  background: transparent;
}

.review_photo_slider .slider {
  position: relative;
}

.review_photo_slider .counter {
  position: absolute;
  left: 50%;
  bottom: 20px;
  height: 27px;
  padding: 0 12px;
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.3);
  font-family: "helvetica", "arial";
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 27px;
  transform: translateX(-50%);
}

.review_photo_slider .counter strong {
  font-family: "HelveticaNeue-Bold", Arial, sans-serif;
  color: rgb(255, 255, 255);
}

.review_photo_slider .slider_b {
  position: relative;
}
.review_photo_slider .slider_s {
  margin-top: 20px;
}
.itemview .basic_popup .slick-initialized .slick-slide {
  height: auto !important;
}
.review_photo_slider .slider_s .slick-list.draggable .slick-slide img {
  box-sizing: border-box;
}
.bx_thumblst {
  overflow: hidden;
  position: relative;
  margin-top: 20px;
  width: 460px;
  margin-left: 70px;
  height: 100px;
}
.layer_review_img .lst_thumb li.slick-current a {
  opacity: 1;
}
.layer_review_img .lst_thumb li a:before {
  left: 0;
  bottom: 0;
}
.layer_review_img .lst_thumb li.slick-current a:before {
  background: transparent;
  border-bottom: 2px solid #fa2828;
}
.lst_review .bx_thumblst .lst_thumb {
  margin: 0;
  position: absolute;
}
.lst_review .review_photo_slider .lst_thumb li {
  margin: 0 0 0 20px;
}
.lst_review .lst_thumb li a img {
  opacity: 1 !important;
}
.review_photo_slider .slider_s .slick-list.draggable {
  padding: 0 !important;
}

.review_photo_slider .slider_b img {
  margin: 0 auto;
  // max-height: 460px;
  width: 600px !important;
  height: 580px;
}

.review_photo_slider .slider_s img {
  max-width: 80px;
  margin: 0 auto;
  max-height: 80px;
  width: auto;
}

.review_photo_slider .slider_b .slick-track {
  height: 460px;
  line-height: 460px;
  font-size: 0;
}

.review_photo_slider .slider_s .slick-track {
  height: 80px;
  line-height: 80px;
}

.slick-no-slide .slick-track {
  transform: translate3d(0px, 0px, 0px) !important;
}

.tumb-anim {
  transition: left 0.3s ease;
}

.slick-small_box {
  width: 80px;
  margin: 0 auto;
}

.slick-small {
  position: relative;
  vertical-align: middle;
  width: 80px;
  height: 80px;
  display: table-cell;
  box-sizing: border-box;
}
.slick-small:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
}
.review_photo_slider .slick-slide.slick-current .slick-small:before {
  border-bottom: 2px solid #fa2828;
}
.slider_b::before {
  /* content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 500px;
  height: 500px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box; */
}
.mypage .lst_review .popup_wrap .lst_thumb li:nth-child(6):after {
  display: none;
}
.lst_thumb a {
  cursor: pointer;
}
.lst_thumb {
  margin-top: 20px;
  font-size: 0;
  & > li {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
}
.gallery_close {
  width: 30px;
  height: 30px;
  background-image: url(~@/assets/images/pc/icons/ic-goods-close.svg);
  background-repeat: no-repeat;
  background-size: 100% auto;
  text-indent: -9999px;
  right: 10px;
  top: 10px;
  color: transparent;
}
</style>
