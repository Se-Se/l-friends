<template>
  <ul
    v-if="mode === 'recommand'"
    :class="{
    'goods-list': true
    }"
  >
    <li
      v-for="(item, key) in goods"
      :key="key"
      :class="['goods-item', 'goods-item__' + mode ]">
      <goods-item-single
        :mode="mode"
        :item="item"
      />
    </li>
  </ul>
  <ul
    v-else
    :class="{
    'goods-list': true,
    '_mainlist': mode === 'section',
    '_min-height': interval === true
    }"
  >
    <li
      v-for="(item, key) in goodsItem"
      :key="key"
      :class="['goods-item', 'goods-item__' + mode ]">
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
      type: [String, Number],
      default: 'section'
    },
    interval: {
      type: Boolean,
      required: false
    },
    limit: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters('banners', ['topBanners']),
    ...mapGetters('display', {
      goodses: 'sections'
    }),
    goodsItem () {
      if (this.limit === 0) {
        return this.mode === 'list' ? this.goods : this.goodses[this.sectionNo]
      }

      return this.mode === 'list' ? this.goods : (this.goodses[this.sectionNo] || []).slice(0, this.limit)
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
