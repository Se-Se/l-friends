<template>
  <div>
    <goods-list
      v-if="goods"
      :direction="direction"
      :width="width"
      :margin="margin"
      :skin="skin"
      :paddingSide="paddingSide"
      :goods="goods"
    />
    <goods-button
      v-if="info"
      :link="info.sectionExplain"
    />
  </div>
</template>

<script>
import GoodsList from './GoodsList'
import GoodsButton from './GoodsButton'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  components: {
    GoodsList,
    GoodsButton
  },
  props: {
    sectionNo: {
      type: Number,
      required: true
    },
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
    limit: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters('display', {
      goodses: 'sections'
    }),
    ...mapState('display', ['sectionInfos']),
    goods () {
      if (this.limit === 0) {
        return this.goodses[this.sectionNo]
      }

      return this.goodses[this.sectionNo] ? this.goodses[this.sectionNo].slice(0, this.limit) : []
    },
    info () {
      return this.sectionInfos[this.sectionNo]
    }
  },
  mounted () {
    this.fetchGoodsSection(this.sectionNo)
  },
  methods: {
    ...mapActions('display', ['fetchGoodsSection'])
  }
}
</script>
