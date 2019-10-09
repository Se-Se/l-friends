<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <main-title :title="title" />
        <div class="project-contents">
          <project-item
            v-for="(item, index) in promotionBanners"
            :key="index"
            :project="item"
          />
        </div>
        <!-- <pagination /> -->
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import MainWrapper from '@/components/pc/layout/common/MainWrapper'
import LayoutWidth from '@/components/pc/layout/common/LayoutWidth'
import BreadCrumbs from '@/components/pc/layout/common/BreadCrumbs'
import ProjectItem from '@/components/pc/others/ProjectItem'
import MainTitle from '@/components/pc/mypage/MainTitle'
import Pagination from '@/components/pc/assets/Pagination'
import { mapGetters } from 'vuex'

export default {
  name: 'Project',
  components: {
    MainWrapper,
    LayoutWidth,
    BreadCrumbs,
    MainTitle,
    ProjectItem,
    Pagination
  },
  props: {
    title: {
      type: String,
      default: '프로모션'
    }
  },
  data () {
    return {
      basicCrumbs: '홈'
    }
  },
  computed: {
    ...mapGetters('banners', ['promotionBanners'])
  }
}
</script>
<style lang="scss" scoped>
.project {
  &-contents {
    margin-top: 20px;
  }
}
</style>
