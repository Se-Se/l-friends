<template>
  <section v-if="slides" class="main-slide swiper-container">
    <slick ref="slick" :options="SlickOptions">
      <div v-for="(slide, key) in slides" :key="key" class="main-slide-images__item swiper-slide">
        <a @click.prevent="goTarget(slide)" href="#">
          <img class="main-slide-images__bg" :src="slide.imageUrl">
          <div class="main-slide-info">
            <p class="main-slide-info__title" :style="{color: slide.nameColor}">
              {{ slide.name }}
            </p>
            <p class="main-slide-info__description" :style="{color: slide.descriptionColor}">
              {{ slide.description }}
            </p>
          </div>
        </a>
      </div>
    </slick>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as $ from 'jquery'
import Slick from 'vue-slick'

export default {
  name: 'MainSlide',
  components: {
    Slick
  },
  data () {
    return {
      window: {
        width: 0,
        height: 800
      },
      SlickOptions: {
        slidesToShow: 1,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 300,
        fade: true,
        autoplay: true,
        autoplaySpeed: 5000
      }
    }
  },
  computed: {
    ...mapGetters('banners', {
      slides: 'slideBanners'
    })
  },
  created () {
    window.addEventListener('load', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = $('.main-slide__fig').outerHeight()
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
  },
  updated () {
    this.$nextTick(() => {
      this.$refs.slick.reSlick()
    })
  }
}
</script>

<style lang="scss" scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }

  to {
    opacity: 1;
    transform: translateY(0rem);
  }
}

.main-slide {
  position: relative;
  overflow: hidden;
  height: 46rem;

  /deep/ .slick-track {
    display: flex;
  }

  /deep/ .slick-slide {
    img {
      object-fit: cover;
      height: 46rem;
    }

    &.slick-active .main-slide-info {
      display: block;
    }
  }

  .main-slide-info {
    position: absolute;
    width: 100%;
    left: 2.8rem;
    bottom: 5.2rem;
    display: none;

    &__title,
    &__description {
      font-family: "Noto Sans KR";

      animation-name: fadeUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;

      opacity: 0;
      transform: translateY(2rem);
    }

    &__title {
      font-family: "Volte", "Noto Sans KR", sans-serif;
      font-size: 2.7rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
      line-height: 1.25;
      color: #333333;
      width: 80.5%;
      animation-delay: 0.1s;
      word-break: break-all;
      max-height: 6.7rem;
      overflow: hidden;
    }

    &__description {
      font-size: 1.6rem;
      font-weight: normal;
      letter-spacing: -0.01rem;
      line-height: 1.5;
      color: rgba(51, 51, 51, 0.8);
      width: 76.5%;
      animation-delay: 0.2s;
    }
  }
}

/deep/ .slick-arrow {
  &.slick-prev,
  &.slick-next {
    position: absolute;
    z-index: 1001;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0;
    width: 4rem;
    height: 4rem;
    background-size: cover;
    outline: none;
  }

  &.slick-prev {
    background-image: url(~@/assets/images/mobile/ic-slide-prev.svg);
    left: 2rem;
  }

  &.slick-next {
    background-image: url(~@/assets/images/mobile/ic-slide-next.svg);
    right: 2rem;
  }
}

/deep/ .slick-dots {
  width: 100%;
  position: absolute;
  z-index: 1001;
  bottom: 2rem;
  display: flex;
  justify-content: center;
  padding-top: 2.4rem;

  > li {
    border-radius: 100%;
    width: 0.8rem;
    height: 0.8rem;
    font-size: 0;
    opacity: 0.4;
    background: #fff;

    &:not(:last-child) {
      margin-right: 1.2rem;
    }

    &.slick-active {
      opacity: 1;
    }
  }
}
</style>
