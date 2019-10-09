<template>
  <div id="container" class="event">
    <Breadcrumb :title="'プロモーション'"></Breadcrumb>
    <div class="event_wrap">
      <ul class="event_list">
        <li class="event_list_item" v-for="(project, index) in promotionBanners" :key="index">
          <router-link :to="project.landingUrlType === 'EVENT' ? '/m/event/'+project.landingUrl : project.landingUrl">
            <div class="thumbnail">
              <img :src="project.imageUrl" :title="project.name" :alt="project.name">
            </div>
            <div class="event_item_info">
              <div class="info_header">
                <h3 class="txt_ttl">{{ project.name }}</h3>
                <span class="badge badge_green3" v-if="!isEnd">開催中</span>
                <span class="badge badge_gray" v-else>終了</span>
              </div>
              <p class="txt_ymd">{{ project.displayStartYmdt.split(' ').shift() }} - {{ project.displayEndYmdt.split(' ').shift() }}</p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { mapGetters } from 'vuex'
const currentDate = new Date()

export default {
  name: 'EventList',
  components: {
    Breadcrumb
  },
  computed: {
    isEnd (displayEndYmdt) {
      return new Date(displayEndYmdt) <= currentDate
    },
    ...mapGetters('display', ['promotionBanners'])
  }
}
</script>
