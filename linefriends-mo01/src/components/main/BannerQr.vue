<template>
  <div class="account_area pt-40">
    <h2 class="ttl_1">公式アカウント</h2>
    <p class="ttl_sub">最新情報をお届けします。</p>
    <ul class="two_wrap">
      <li :class="getClassName(index)" v-for="(banner, index) in banners" :key="index">
        <div class="photo_wrap">
          <banner-link :banner="banner">
            <img alt="" :src="banner.imageUrl" />
          </banner-link>
        </div>
        <div class="info_wrap">{{banner.name}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'

export default {
  props: ['banners'],
  components: {
    BannerLink
  },
  methods: {
    getClassName (idx) {
      if (idx === 0) {
        return 'two_left_wrap'
      } else {
        return 'two_right_wrap'
      }
    }
  }
}
</script>
