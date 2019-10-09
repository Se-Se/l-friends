<template>
  <div class="half">
    <ul class="half__list">
      <li v-for="(hlaf, key) in banners" :key="key" class="half__item">
        <div>
          <a
            @click.prevent="goTarget(hlaf)" href="#"
          >
            <figure class="half__fig">
              <img class="half__img" :src="hlaf.imageUrl" :alt="hlaf.name" :title="hlaf.name"/>
            </figure>
            <div class="half__info">
              <h2 class="half__info--title">{{ hlaf.name }}</h2>
              <p class="half__info--description">{{ hlaf.description }}</p>
            </div>
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import LayoutWidth from '../layout/common/LayoutWidth'

export default {
  name: 'half-list',
  props: {
    banners: {
      type: [Object, Array],
      required: true
    }
  },
  component: { LayoutWidth },
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
