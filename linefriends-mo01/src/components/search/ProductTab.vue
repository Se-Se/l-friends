<template>
  <nav class="list-page-tab-nav" v-if="categoryRoot">
    <ul class="list-tab-nav-list">
      <li class="list-tab-nav-item">
        <a @click.prevent="search" :class="['list-nav-label', { 'list-active' : !categorySub}]">すべて</a>
      </li>
      <li class="list-tab-nav-item" v-for="(item, idx) in categoryRoot.children" :key="`sub_${idx}`">
        <a @click.prevent="search(item)" :class="['list-nav-label', { 'list-active' : categorySub && categorySub.categoryNo === item.categoryNo}]">{{item.label}}</a>
      </li>
    </ul>
  </nav>
  <div class="list-banner" v-else-if="banner">
    <banner-link :banner="banner">
      <img :src="banner.imageUrl" alt="" class="list-banner-image">
    </banner-link>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'

export default {
  props: ['categoryRoot', 'categorySub', 'banner'],
  methods: {
    search (item) {
      let params = {
        type: 'category',
        categoryNo: this.categoryRoot.categoryNo,
        depth1Desc: this.categoryRoot.label
      }
      if (item) {
        params.subCategoryNo = item.categoryNo
        params.depth2Desc = item.label
      }
      this.$emit('searchList', params)
    }
  },
  components: {
    BannerLink
  }
}
</script>
