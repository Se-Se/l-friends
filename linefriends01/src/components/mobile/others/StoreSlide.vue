<template>
  <section
    v-if="slides"
    class="store-slide swiper-container"
  >
    <slick
      ref="slick"
      :options="SlickOptions" 
    >
      <div
        v-for="(slide, key) in slides"
        :key="key"
        class="store-slide-images__item swiper-slide"
      >
        <a
          :href="slide.landingUrl"
          :target="slide.browerTargetType === 'NEW' ? '_blank' : ''"
        >
          <img
            class="store-slide-images__bg"
            :src="slide.imageUrl"
          >
          <div class="store-slide-info">
            <p class="store-slide-info__title">
              {{ slide.name }}
            </p>
            <p class="store-slide-info__description">
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
  name: 'Storeslide',
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
      },
      slides: [
        {
          imageUrl: '/static/images/mobile/slides/slide1.png'
        },
        {
          imageUrl: '/static/images/mobile/slides/slide2.png'
        },
        {
          imageUrl: '/static/images/mobile/slides/slide3.png'
        },
        {
          imageUrl: '/static/images/mobile/slides/slide4.png'
        },
        {
          imageUrl: '/static/images/mobile/slides/slide5.png'
        },
        {
          imageUrl: '/static/images/mobile/slides/slide6.png'
        }
      ]
    }
  },
  created () {
    window.addEventListener('load', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = $('.store-slide__fig').outerHeight()
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

.store-slide {
  position: relative;
  overflow: hidden;
  height: 25.1rem;

  /deep/ .slick-track {
    display: flex;
  }

  /deep/ .slick-slide {

    img {
      object-fit: cover;
      height: 25.1rem;
    }

    &.slick-active .store-slide-info {
      display: block;
    }
  }

  .store-slide-info {
    position: absolute;
    width: calc(100% - 6.4rem);
    left: 2.8rem;
    bottom: 5.2rem;
    display: none;

    &__title, &__description {
      font-family: 'Noto Sans KR';

      animation-name: fadeUp;
      animation-duration: .5s;
      animation-fill-mode: forwards;

      opacity: 0;
      transform: translateY(2rem);
    }
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
