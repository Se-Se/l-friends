<template>
  <ul class="banner-list">
    <li
      v-for="(banner, key) in banners"
      :key="key"
      class="banner-list__item"
    >
      <app-banner
        :banner="banner"
        :text-overflow="textOverflow"
      />
    </li>
  </ul>
</template>

<script>
import AppBanner from './Banner'

export default {
  name: 'BannerList',
  components: { AppBanner },
  props: {
    banners: {
      type: Array,
      required: true
    },
    textOverflow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.banner-list {
  &__item:not(:last-child) {
    margin-bottom: 2.1rem;
  }
}
</style>
