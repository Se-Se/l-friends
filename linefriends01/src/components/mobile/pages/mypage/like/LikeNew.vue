<template>
  <div class="like">
    <sub-page-header title="찜한 상품" />

    <div id="container">
      <goods-list
        v-if="likeProducts && likeProducts.totalCount > 0"
        :goods="likeProducts"
        checkable
        deletable
        @delete="deleteLike"
      />
      <not-found
        v-else
        description="찜한 상품이 없습니다."
      />
    </div>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import GoodsList from '@/components/mobile/goods/GoodsList'
import NotFound from '@/components/mobile/common/list/NotFound'
import LikeNew from '@/components/mixins/mypage/like/LikeNew'
import { onScrollNextPage } from '@/utils/event-bus'

export default {
  name: 'LikeProducts',
  mixins: [LikeNew],
  components: {
    SubPageHeader,
    GoodsList,
    NotFound
  },
  mounted () {
    onScrollNextPage(async () => {
      if (this.likeProducts.length < this.likeProducts.totalCount) {
        await this.$store.dispatch('likeProducts/getLikeProductsMore')
      }
    })
  },
  methods: {
    deleteLike (products) {
      this.selectedNos = products
      this.likeDeleteProducts()
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.6rem 2rem 1.6rem;
}
</style>
