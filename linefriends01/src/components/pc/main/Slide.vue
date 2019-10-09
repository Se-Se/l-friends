<template>
  <section class='main-slide'
    :style="{ height: defaultHeight + 'px' }"
  >
    <slick
      :options="SlickOptions"
      @beforeChange="beforeChange">
      <div
        v-for="(slide, key) in slides"
        :key="key">
         <a @click.prevent="goTarget(slide)" href="#">
          <figure class="main-slide__fig">
            <img :src="slide.imageUrl"/>
          </figure>
          <div class='main-slide__wrapper'
              :style="{ height: defaultHeight + 'px' }">
            <div
              :style="{ height: 'auto' }"
              v-bind:class="{
                'main-slide__info': true,
                __black : slide.color === 'black',
                'main-slide__info--active': currentIndex === key
              }"
            >
              <h2 class="main-slide__info--title" :style="{color: slide.nameColor}">
                {{ slide.name }}
              </h2>
              <p class="main-slide__info--description" :style="{color: slide.descriptionColor}">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </slick>
  </section>
</template>
<script>
import * as $ from 'jquery'
import Slick from 'vue-slick'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'slide',
  props: {
    slides: {
      required: true
    }
  },
  data () {
    return {
      active: 0,
      fullHeight: 0,
      images: [],
      actions: false,
      window: {
        width: 0,
        height: 800
      },
      arrow: false,
      defaultHeight: $('.main-slide__fig').outerHeight(),
      currentIndex: 0,
      SlickOptions: {
        slidesToShow: 1,
        dots: true,
        infinite: true,
        speed: 800,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3400,
        cssEase: 'linear'
      }
    }
  },
  components: {
    Slick
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
      this.window.height = $('.main-slide__fig').outerHeight()
    },
    beforeChange (event, slick, currentSlide, nextSlide) {
      this.currentIndex = nextSlide
    },
    handleLazyLoaded (event, slick, image, imageSource) {
      this.slides = image
    },
    goTarget (project) {
      if (project.landingUrlType === 'EVENT') {
        if (project.browerTargetType === 'CURRENT') {
          this.$router.push(`/event/${project.landingUrl}`)
        } else {
          let routeData = this.$router.resolve({ path: `/event/${project.landingUrl}` })
          window.open(routeData.href, '_blank')
        }
      } else {
        let landingUrl = project.landingUrl.indexOf('https://') !== -1 || project.landingUrl.indexOf('http://') !== -1 ? project.landingUrl : `https://${project.landingUrl}`
        if (project.browerTargetType === 'CURRENT') {
          window.location.href = landingUrl
        } else {
          window.open(landingUrl)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main-slide {
  min-width: 1280px;
  width:100%;
  height: auto;
  overflow: hidden;
  position: relative;
  &__swiper {
    height: 100%;
  }
  &__fig {
    width: 100%;
    & > img {
      width: 100%;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  &__item {
    display: inline-block;
    min-width: 1180px;
    height: 100%;
    position: relative;
  }
  &__wrapper {
    position: absolute;
    top:0;
    width: 100%;
    height: 100%;
  }
  &__info {
    position: absolute;
    width: 1180px;
    bottom: 52px;
    left: 50%;
    transform: translateX(-50%);
    &--title {
      font-family: "Noto Sans KR";
      font-weight: bold;
      font-size: 32px;
      letter-spacing: -0.1px;
      line-height: 1.25;
    }
    &--description {
      padding-top: 4px;
      font-family: "Noto Sans KR", sans-self;
      font-weight:normal;
      font-size: 16px;
      letter-spacing: -0.1px;
      line-height: 1.5;
      opacity: 0.7;
    }
    &--action {
      display: inline-block;
      padding-top: 20px;
      font-family: "Noto Sans KR", sans-self;
      font-weight:500;
      font-size: 14px;
      letter-spacing: -0.1px;
      text-decoration: underline;
      line-height: 1.5;
      opacity: 0.7;
    }
  }
  &__info--active {
    bottom: 52px;
    opacity: 1;
    animation: slideAction 1.5s;
    position: absolute;
    @keyframes slideAction {
      0% {
        bottom: 10px;
        opacity: 0;
      }
      100% {
        bottom: 52px;
        opacity: 1;
      }
    }
  }
  & .__black {
    color: #ffffff;
  }
  &__pagination {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    &--list {
      font-size: 0;
    }
    &--item {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.5);
      margin-right: 12px;
      border-radius: 10px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &__active {
        background-color: #ffffff;
      }
    }
  }
  &__btn {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: 300ms;
    opacity: 0;
    &--active {
      opacity: 1;
      transition: 300ms;
    }
    &--next,
    &--prev {
      width: 48px;
      height: 48px;
      position: absolute;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    &--next {
      background-image: url('/static/images/pc/icons/ic-next.svg');
      right: 40px;
    }
    &--prev {
      background-image: url('/static/images/pc/icons/ic-prev.svg');
      left: 40px;
    }
  }
  .slick-slide img
  {
    display: block;
    width: 100%;
    // max-height: 740px;
  }
}
</style>
