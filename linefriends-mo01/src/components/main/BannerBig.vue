<template>
  <div class="banner_area">
    <slick class="top_bnr" v-if="banners" :options="slickOptions">
      <banner-link v-for="(banner, index) in banners" :key="index" :banner="banner">
        <img :src="banner.imageUrl" alt="">
        <div class="ttl_ex" style="color: #f13c88">
          <h2 :style="{color: banner.nameColor}">{{banner.name}}</h2>
          <p :style="{color: banner.descriptionColor}">{{banner.description}}</p>
        </div>
      </banner-link>
    </slick>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'
import Slick from 'vue-slick'

export default {
  props: ['banners'],
  data () {
    return {
      slickOptions: {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear'
      }
    }
  },
  components: {
    BannerLink,
    Slick
  }
}
</script>
