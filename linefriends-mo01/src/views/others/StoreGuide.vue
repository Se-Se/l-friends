<template>
  <div id="container" class="store">
    <sub-header title="店舗情報" />
    <div class="banner_area">
      <slick class="top_bnr" v-if="slides" :options="slickOptions">
        <a v-for="(slide,value) in slides" :key="value" :banner="slides">
          <img :src="slide.imageUrl" alt="">
        </a>
      </slick>
    </div>
    <div class="store-wrapper">
      <div class="box_area">
        <div class="filter">
          <div class="color-green">STORE</div>
          <h2>東京都渋谷区原宿店</h2>
          <ul class="box">
            <li class="border-bottom">
              <div class="place content">
                <span>東京都渋谷区神宮前 4-31-12 原宿ゼロゲート</span>
              </div>
              <div class="locate_link content">
                <a :href="'https://www.google.com/maps/place/%E5%8E%9F%E5%AE%BF%E3%82%BC%E3%83%AD%E3%82%B2%E3%83%BC%E3%83%88/@35.669357,139.706271,15z/data=!4m5!3m4!1s0x0:0xb4ad1d7a45bafbe5!8m2!3d35.6693568!4d139.706271?hl=jp'" target="_blank">
                  地図を見る
                  <img alt="" src="@/assets/img/icon/ic-map-more.png" />
                </a>
              </div>
            </li>
            <li class="border-bottom">
              <div class="call content">+81-03-5785-3001</div>
            </li>
            <li>
              <div class="time content">11:00 ~ 21:00</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Slick from 'vue-slick'
import SubHeader from '@/components/header/SubHeader'
export default {
  props: ['banners'],
  components: {
    Slick,
    SubHeader
  },
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
      },
      fullPath: this.$route.fullPath,
      slides: [
        {
          imageUrl: require('../../assets/img/etc/japan_store.png')
        }
      ]
    }
  }
}
</script>
