<template>
  <ul class="goods-list _mainlist _eventlist">
    <li
      v-for="(item, key) in goods"
      :key="key"
      class="goods-item _eventitem"
    >
      <goods-item-single
        :mode="mode"
        :item="item"
      />
    </li>
  </ul>
</template>
<script>
import GoodsItemSingle from './goodsItem/GoodsItemSingleLine'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'GoodsList',
  components: {
    GoodsItemSingle
  },
  props: {
    direction: {
      type: String,
      default: 'vertical'
    },
    sectionNo: {
      type: Number,
      required: false
    },
    goods: {
      type: Array,
      required: false
    },
    mode: {
      type: String,
      default: 'section'
    },
    rows: {
      type: Number,
      required: false,
      default: 6
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
