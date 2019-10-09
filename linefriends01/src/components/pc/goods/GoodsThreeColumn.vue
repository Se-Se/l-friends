<template>
  <layout-full>
    <layout-width>
      <slot></slot>
      <ul class="goods-three-column__list" >
        <li class="goods-item" 
            v-for="(banner, key) in banners" 
            :key="key">
          <div>
            <a
              @click.prevent="goTarget(banner)" href="#"
            >
              <figure class="goods-item__fig">
                  <img :src="banner.imageUrl" :title="banner.name" :name='banner.name'>
              </figure>
              <div class="goods-item__info">
                  <h2 class="goods-item__title" v-if="banner.name">{{ banner.name }}</h2>
                  <p class="goods-item__description" v-if="banner.description">{{ banner.description }}</p>
              </div>
            </a>
          </div>
        </li>
      </ul>
    </layout-width>
  </layout-full>
</template>
<script>
import LayoutFull from '../layout/common/LayoutFull'
import LayoutWidth from '../layout/common/LayoutWidth'

export default {
  name: 'goods-three-column',
  components: {
    LayoutFull,
    LayoutWidth
  },
  props: {
    banners: {
      type: Array,
      required: false
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
