<template>
  <main-article
    v-if="goods.length > 0"
    :label="{ name: 'BEST', color: '#df67ff' }"
    :title="title"
  >
    <goods-list
      :direction="direction"
      :width="width"
      :margin="margin"
      :skin="skin"
      :paddingSide="paddingSide"
      :goods="goods"
      :isMainBest="isMainBest"
    />
  </main-article>
</template>

<script>
import MainArticle from '@/components/mobile/main/MainArticle'
import GoodsList from './GoodsList'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'GoodsBestArticle',
  components: {
    GoodsList,
    MainArticle
  },
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
    isMainBest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      title: '',
      goods: []
    }
  },
  computed: {
    ...mapState('display', ['best'])
  },
  async mounted () {
    await this.fetchGoodsBest()

    this.goods = this.best.mainBestProductInfos
    this.title = this.$t('article.best.title.' + this.best.mainBestSearchType)
  },
  methods: {
    ...mapActions('display', ['fetchGoodsBest'])
  }
}
</script>
