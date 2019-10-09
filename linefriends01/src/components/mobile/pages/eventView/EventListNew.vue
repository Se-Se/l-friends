<template>
  <div>
    <sub-page-header title="프로모션"/>
    <div id="container">
      <project-item
        v-for="(item, index) in promotionBanners"
        :key="index"
        :project="item"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import ProjectItem from '@/components/mobile/others/ProjectItem'

export default {
  name: 'EventListNew',
  components: {
    SubPageHeader,
    ProjectItem
  },
  computed: {
    ...mapGetters('banners', ['promotionBanners'])
  }
}
</script>

<style lang="scss" scope>
</style>
