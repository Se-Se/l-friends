<template>
  <div class="cha_banner">
    <ul class="banner_list cha column-3">
      <basic-banner v-for="(banner, index) in banners" :key="`btm_${index}`" :banner="banner" />
    </ul>
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
