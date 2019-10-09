<template>
  <div class="hot_area">
    <div class="wrap">
      <ul class="banner_list">
        <li v-for="(banner, index) in banners" :key="index">
          <banner-link :banner="banner">
            <div class="photo_wrap">
              <div class="thumbnail">
                <img :src="banner.imageUrl" alt="">
              </div>
            </div>
            <div class="info">
              <h3>{{banner.name}}</h3>
              <p class="txt_ex">{{banner.description}}</p>
            </div>
          </banner-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'

export default {
  props: ['banners'],
  components: {
    BannerLink
  }
}
</script>
