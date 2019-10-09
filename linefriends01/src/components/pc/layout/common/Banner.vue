<template>
  <div class="banner">
    <slick :options="SlickOptions">
      <figure v-for="(item , key) in banner" :key="key">
        <a @click.prevent="goTarget(item)" href="#">
          <img class="banner-img" :src="item.imageUrl" :alt="item.name" :title="item.name" />
        </a>
      </figure>
    </slick>
  </div>
</template>
<script>
import Slick from 'vue-slick'

export default {
  name: 'banner',
  components: {
    Slick
  },
  props: {
    banner: {
      type: [Array, Object],
      required: false
    }
  },
  data () {
    return {
      SlickOptions: {
        slidesToShow: 1,
        dots: false,
        arrows: false,
        infinite: false,
        fade: true,
        slideToScroll: 1
      }
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
