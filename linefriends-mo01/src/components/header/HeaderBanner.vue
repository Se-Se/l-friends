<template>
  <div class="banner_top" v-if="topBanners" :style="{background: `linear-gradient(to right,${topBanners[0].leftSpaceColor} 50%,${topBanners[0].rightSpaceColor} 50%)`}">
    <div class="ban_inner" v-for="(banner,key) in topBanners" :key="key">
      <p>
        <img :src="banner.imageUrl" style="width: 100%">
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeaderTop',
  props: ['topBanners']
}
</script>
