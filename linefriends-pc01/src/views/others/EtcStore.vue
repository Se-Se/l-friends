<template>
  <div id="container" class="store">
    <div class="wrap">
      <bread-crumbs breadCrumbs="店舗情報" />
      <div class="store-content">
        <h1>店舗情報</h1>
        <div class="banner_area">
          <div class="top_bnr swiperCon">
            <slick v-if="slides" :options="SlickOptions">
              <a v-for="(slide,value) in slides" :key="value">
                <img :src="slide.imageUrl">
              </a>
            </slick>
          </div>
        </div>
        <div class="box_area">
          <dl class="store-number">
            <dt>STORE</dt>
          </dl>
          <div class="filter">
            <h2>東京都渋谷区原宿店</h2>
          </div>
          <div class="filter">
            <ul class="box">
              <li>
                <div class="place store_info">東京都渋谷区神宮前 4-31-12 原宿ゼロゲート</div>
                <a :href="'https://www.google.com/maps/place/%E5%8E%9F%E5%AE%BF%E3%82%BC%E3%83%AD%E3%82%B2%E3%83%BC%E3%83%88/@35.669357,139.706271,15z/data=!4m5!3m4!1s0x0:0xb4ad1d7a45bafbe5!8m2!3d35.6693568!4d139.706271?hl=jp'" target="_blank">
                  <p class="txt-add">地図を見る</p>
                </a>
              </li>
              <li>
                <div class="call store_info">03-5785-3001</div>
              </li>
              <li>
                <div class="time store_info">11:00 ~ 21:00</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import Slick from 'vue-slick'
export default {
  components: {
    Slick,
    BreadCrumbs
  },
  data () {
    return {
      SlickOptions: {
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: false, // 垂直方向
        autoplay: true,
        dots: true,
        arrows: false,
        infinite: false,
        fade: false
      },
      slides: [
        {
          imageUrl: require('../../assets/img/temp/jp-store.png')
        }
      ]
    }
  }
}
</script>
