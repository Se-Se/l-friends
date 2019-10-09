<template>
  <ul
    v-if="best"
    :class="{
      'goods-best-list': true,
      'wish': type === 'wish'
    }"
  >
    <li
      v-for="(item, key) in goods"
      :key="key"
      :class="{
        'goods-item': type === 'list',
        'goods-item__wish': type === 'wish'
      }"
    >
      <goods-item :goods="item"/>
    </li>
  </ul>
</template>
<script>
import GoodsItem from '../goods/goodsItem/GoodsItemDoubleLine'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'goods-best-list',
  components: {
    GoodsItem
  },
  props: {
    type: {
      type: String,
      required: false,
      default: 'list'
    }
  },
  computed: {
    ...mapState('display', ['best']),
    goods () {
      return this.best.mainBestProductInfos.map(item => ({
        ...item,
        productNo: item.productNo,
        listImageUrls: item.imageUrls,
        imageUrls: item.imageUrls
      }))
    }
  },
  mounted () {
    this.fetchGoodsBest()
  },
  methods: {
    ...mapActions('display', ['fetchGoodsBest'])
  }
}
</script>
