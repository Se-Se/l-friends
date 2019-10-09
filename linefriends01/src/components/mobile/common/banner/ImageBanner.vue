<template>
  <figure class="banner">
    <a v-if="banner" @click.prevent="goTarget(banner)" href="#">
      <img :src="banner.imageUrl" :alt="banner.name" :title="banner.name">
    </a>
  </figure>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    banner: {
      type: Object,
      default: null
    }
  },
  methods: {
    goTarget (project) {
      if (project.landingUrlType === 'EVENT') {
        if (project.browerTargetType === 'CURRENT') {
          this.$router.push(`/event/${project.landingUrl}`)
        } else {
          let routeData = this.$router.resolve({ path: `/event/${project.landingUrl}` })
          window.open(routeData.href, '_blank')
        }
      } else {
        let landingUrl = project.landingUrl.indexOf('https://') !== -1 || project.landingUrl.indexOf('http://') !== -1 ? project.landingUrl : `https://${project.landingUrl}`
        if (project.browerTargetType === 'CURRENT') {
          window.location.href = landingUrl
        } else {
          window.open(landingUrl)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  font-size: 0;

  img {
    width: 100%;
    max-height: 9.6rem;
  }
}
</style>
