<template>
  <a href="#" @click.prevent="toLink">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ['banner'],
  methods: {
    toLink () {
      if (this.banner) {
        if (this.banner.landingUrlType === 'EVENT') {
          if (this.banner.browerTargetType === 'CURRENT') {
            this.$router.push(`/event/${this.banner.landingUrl}`)
          } else {
            let routeData = this.$router.resolve({ path: `/event/${this.banner.landingUrl}` })
            window.open(routeData.href, '_blank')
          }
        }
        if (this.banner.landingUrlType === 'GENERAL') {
          let landingUrl = this.banner.landingUrl.indexOf('https://') !== -1 || this.banner.landingUrl.indexOf('http://') !== -1 ? this.banner.landingUrl : `https://${this.banner.landingUrl}`
          if (this.banner.browerTargetType === 'CURRENT') {
            window.location.href = landingUrl
          } else {
            window.open(landingUrl)
          }
        }
      }
    }
  }
}
</script>
