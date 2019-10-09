<template>
  <div class="hot_area">
    <div class="wrap">
      <h2 class="ttl_1">注目されています</h2>
      <p class="ttl_sub">強力推薦アイテム</p>
      <ul class="banner_list column-3">
        <basic-banner v-for="(banner, index) in banners" :key="`mid_${index}`" :banner="banner" />
      </ul>
    </div>
  </div>
</template>

<script>
import BasicBanner from '@/components/common/BasicBanner'

export default {
  props: ['banners'],
  components: {
    BasicBanner
  }
}
</script>
