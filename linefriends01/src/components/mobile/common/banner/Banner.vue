<template>
  <article class="banner">
    <a
      v-if="banner"
      @click.prevent="goTarget(banner)" href="#"
    >
      <div class="banner-thumb">
        <img
          :src="banner.imageUrl"
          :alt="banner.name"
          :title="banner.name"
        >
      </div>
      <div class="banner-info">
        <p class="banner-info__title">{{ banner.name }}</p>
        <p :class="{ 'banner-info__description': true, overflow: textOverflow }">{{ banner.description }}</p>
      </div>
    </a>
  </article>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    banner: {
      type: Object,
      default: null
    },
    textOverflow: {
      type: Boolean,
      default: false
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

  &-thumb {
    font-size: 0;

    img {
      width: 100%;
      height: 22.4rem;
    }
  }

  &-info {
    padding: 1.6rem 2rem 2.8rem;
    background: #fff;

    &__title {
      margin-bottom: 1rem;
      font-family: "Noto Sans KR",sans-self;
      font-weight: 500;
      font-size: 1.6rem;
      letter-spacing: -0.01rem;
      color: #333;

      &:not(.overflow) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &__description {
      display: block;
      width: 100%;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      font-size: 1.4rem;
      letter-spacing: -0.01rem;
      color: #666;

      &:not(.overflow) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.overflow {
        margin-top: -0.4rem;
        line-height: 2.1rem;
      }
    }
  }
}
</style>
