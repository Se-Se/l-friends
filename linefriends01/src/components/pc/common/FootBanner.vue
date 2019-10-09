<template>
  <a :href="landingUrl" :target="target">
    <img :src="banner.imageUrl" alt="">
  </a>
</template>

<script>
export default {
  props: ['banner'],
  computed: {
    landingUrl () {
      return this.banner && ((this.banner.landingUrlType === 'EVENT' && '/event/' + this.banner.landingUrl) || this.banner.landingUrl)
    },
    target () {
      return this.banner.browerTargetType === 'NEW' ? '_blank' : ''
    }
  }
}
</script>

