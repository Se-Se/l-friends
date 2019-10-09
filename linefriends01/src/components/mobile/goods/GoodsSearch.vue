<template>
  <goods-list
    :direction="direction"
    :width="width"
    :margin="margin"
    :skin="skin"
    :paddingSide="paddingSide"
    :goods="goods"
  />
</template>

<script>
import GoodsList from './GoodsList'

import { mapActions, mapState } from 'vuex'

export default {
  components: { GoodsList },
  props: {
    direction: {
      type: String,
      default: 'vertical'
    },
    width: {
      type: Number,
      default: 20.2
    },
    margin: {
      type: Number,
      default: 1.2
    },
    skin: {
      type: String,
      default: 'normal'
    },
    paddingSide: {
      type: Number,
      default: 0
    },
    orderBy: {
      type: String,
      default: 'MD_RECOMMEND'
    },
    orderDirection: {
      type: String,
      defualt: 'ASC'
    },
    categoryNos: {
      type: Number,
      defualt: null
    },
    pageSize: {
      type: Number,
      default: 15
    }
  },
  data () {
    return {
      page: 1,
      goods: []
    }
  },
  computed: {
    ...mapState('productList', ['list'])
  },
  async mounted () {
    await this.fetchList()
  },
  methods: {
    ...mapActions('productList', ['resetAndFetchList']),
    async fetchList () {
      await this.resetAndFetchList({
        params: {
          'order.by': this.orderBy,
          'order.direction': this.orderDirection,
          'categoryNos': this.categoryNos,
          'pageSize': this.pageSize,
          'pageNumber': this.page
        }
      })
      this.goods = [...this.goods, ...this.list]
    }
  }
}
</script>
