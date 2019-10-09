<template>
  <div class="project-list">
    <a @click.prevent="goTarget(project)" href="#">
      <div class="project-list__item">
        <div v-if="project.imageUrl" class="project-item__img">
          <img :src="project.imageUrl" :title="project.name" :alt="project.name">
        </div>
        <div v-else class="project-list__nodata">
          <figure class="logo">
            <img src="~@/assets/images/common/logo.svg" alt="Line Friends">
          </figure>
        </div>
        <div class="project-item__info">
          <div class="project-item__info-header">
            <p class="project-item__info-title">
              {{ project.name }}
            </p>
            <span v-if="!isEnd" class="project-item__info-status">진행중</span>
            <span v-else class="project-item__info-status closed">종료</span>
          </div>
          <p v-if="project.displayPeriodType === 'PERIOD'" class="project-item__info-ymd">
            {{ project.displayStartYmdt.split(' ').shift() }} ~ {{ project.displayEndYmdt.split(' ').shift() }}
          </p>
          <p v-else class="project-item__info-ymd">
            {{ project.displayStartYmdt.split(' ').shift() }} ~
          </p>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
const currentDate = new Date()

export default {
  name: 'ProjectItem',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    isEnd () {
      return new Date(this.project.displayEndYmdt) <= currentDate
    },
    landingUrl () {
      let url = this.project.landingUrl
      if (this.project.landingUrlType === 'EVENT') {
        url = `/event/${url}`
      }

      return url
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
