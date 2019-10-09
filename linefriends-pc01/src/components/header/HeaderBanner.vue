<template>
  <div v-if="topBanners && topBanners[0]" class="banner_top" :style="{background: `linear-gradient(to right,${topBanners[0].leftSpaceColor} 50%,${topBanners[0].rightSpaceColor} 50%)`}">
    <div class="ban_inner" v-for="(topBanner, key) in topBanners" :key="key">
      <p>
        <img :src="topBanner.imageUrl">
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTop',
  methods: {
  },
  props: ['topBanners']
}
</script>

<style>
</style>
