<template>
  <div class="wrap">
    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="event">
      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <bread-crumbs/>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ event-good_area ↓↓↓↓↓ -->
      <div class="event-good_area">
        <p class="title">プロモーション</p>
        <div class="good_contents_list">
          <ul class="banner_list column-3">
            <li v-for="(project, index) in promotionBanners" :key="index">
              <banner-link :banner="project">
                <div class="photo_wrap">
                  <div class="thumbnail" v-if="project.imageUrl">
                    <img
                      :src="project.imageUrl"
                      :title="project.name"
                      :alt="project.name"
                    >
                  </div>
                  <div class="project-list__nodata" v-else>
                    <figure class="logo">
                      <img
                        src="~@/assets/img/common/logo.svg"
                        alt="Line Friends"
                      >
                    </figure>
                  </div>
                </div>
                <div class="info good_padding">
                  <div class="name_line">
                    <h3 class="set_name">{{ project.name }}</h3>
                    <span class="badge badge_green" v-if="!isEnd">開催中</span>
                    <span class="badge badge_gray" v-else>終了</span>
                  </div>
                  <p class="txt_ex">{{ project.displayStartYmdt.split(' ').shift() }} ~ {{ project.displayEndYmdt.split(' ').shift() }}</p>
                </div>
              </banner-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- ↑↑↑↑↑ event-good_area ↑↑↑↑↑ -->
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BreadCrumbs from '@/components/common/BreadCrumbs'
import BannerLink from '@/components/common/BannerLink'
const currentDate = new Date()

export default {
  name: 'EventList',
  data () {
    return {
    }
  },
  components: {
    BreadCrumbs,
    BannerLink
  },
  computed: {
    isEnd (displayEndYmdt) {
      return new Date(displayEndYmdt) <= currentDate
    },
    ...mapGetters('display', ['promotionBanners'])
  }
}
</script>
