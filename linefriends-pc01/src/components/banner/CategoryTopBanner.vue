
<template>
  <div>
    <h1 class="list-title">すべて</h1>
      <div v-if="banner" class="list-banner">
        <banner-link :banner="banner">
          <img :src="banner.imageUrl" alt="">
        </banner-link>
      </div>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'
export default {
  props: ['banner'],
  components: {
    BannerLink
  }
}
</script>
