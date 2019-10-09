<template>
  <ul class="goods-thumblist">
    <li
      v-for="(item, key) in goodsItem"
      :key="key"
      class="goods-item"
    >
      <goods-thumb-item :goods="item" />
    </li>
  </ul>
</template>
<script>
import GoodsThumbItem from './goodsItem/GoodsThumbItem'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'goods-thumb-list',
  components: { GoodsThumbItem },
  props: {
    goods: {
      type: Array,
      required: false
    },
    sectionNo: {
      type: Number,
      required: false
    }
  },
  computed: {
    ...mapGetters('display', {
      sectionses: 'sections'
    }),
    goodsItem () {
      return this.sectionses[this.sectionNo]
    }
  },
  mounted () {
    if (this.sectionNo) {
      this.fetchGoodsSection(this.sectionNo)
    }
  },
  methods: {
    ...mapActions('display', ['setSection', 'fetchGoodsSection'])
  }
}
</script>
