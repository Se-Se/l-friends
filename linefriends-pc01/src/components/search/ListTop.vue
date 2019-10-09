<template>
  <div class="list-banner" v-if="categoryRoot">
    <div class="list-goods-tab">
      <ul class="list-goods-tab-list">
        <li class="list-goods-tab_item">
          <a href="javascript:" @click.prevent="search" :class="['list-goods-action', { 'list-goods-active' : !categorySub}]">すべて</a>
        </li>
        <li class="list-goods-tab_item" v-for="(item, idx) in categoryRoot.children" :key="`sub_${idx}`">
          <a href="javascript:" @click.prevent="search(item)" :class="['list-goods-action', { 'list-goods-active' : categorySub && categorySub.categoryNo === item.categoryNo}]">{{item.label}}</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="list-banner" v-else-if="banner">
    <banner-link :banner="banner">
      <img :src="banner.imageUrl" alt="">
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
