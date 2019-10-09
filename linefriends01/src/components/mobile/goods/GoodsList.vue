<template>
  <div :class="['goods-list__wrapper', direction, skin]">
    <div
      v-if="checkable"
      class="check-header"
    >
      <app-checkbox
        v-model="checkAll"
        size="large"
        @change="toggleCheckAll"
      >
        <span class="check-all">전체선택</span>
      </app-checkbox>
      <a
        v-if="deletable"
        href="#"
        :class="['check-delete-btn', goodsSelected ? 'active' : '']"
        @click.prevent="$emit('delete', checkList)"
      >선택상품 삭제</a>
    </div>
    <ul
      v-if="skin !== 'grid'"
      :style="{ width: listWidth, padding: '0 ' + paddingSide + 'rem', paddingLeft: (paddingLeft || paddingSide) + 'rem' , paddingRight: (paddingLeft || paddingSide) + 'rem' }"
      class="goods-list"
    >
      <li
        v-for="(item, key) in goods"
        :key="key"
        :style="{ width: goodsWidth }"
        class="goods-item"
      >
        <app-checkbox
          v-if="checkable"
          v-model="check[item.productNo]"
          :id="'' + item.productNo"
          size="large"
          class="goods-check"
          @change="toggleCheck(item.productNo)"
        />

        <goods-item
          v-if="skin === 'normal'"
          :goods="item"
          :isMainBest="isMainBest"
        />

        <goods-box-item
          v-if="skin === 'box'"
          :goods="item"
        />

        <goods-thumb-item
          v-if="skin === 'thumb'"
          :goods="item"
        />
      </li>
    </ul>
    <image-grid
      v-if="skin === 'grid'"
      :images="gridGoods"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ImageGrid from '../common/ImageGrid'
import GoodsItem from './goodsItem/GoodsItem'
import GoodsBoxItem from './goodsItem/GoodsBoxItem'
import GoodsThumbItem from './goodsItem/GoodsThumbItem'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import LikeNew from '@/components/mixins/mypage/like/LikeNew'

export default {
  mixins: [LikeNew],
  components: {
    GoodsItem,
    GoodsBoxItem,
    GoodsThumbItem,
    ImageGrid,
    AppCheckbox
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
    paddingLeft: {
      type: Number,
      default: 0
    },
    goods: {
      type: Array,
      required: true
    },
    checkable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    },
    isMainBest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      check: {},
      checkList: [],
      checkAll: false
    }
  },
  computed: {
    isHorizontal () {
      return this.direction === 'horizontal'
    },
    listWidth () {
      return this.isHorizontal ? (this.width * this.goods.length + 1.2 * (this.goods.length - 1)) + 'rem' : 'auto'
    },
    goodsWidth () {
      return this.isHorizontal ? this.width + 'rem' : '43.2vw'
    },
    gridGoods () {
      let goods = []
      for (let item of this.goods) {
        goods.push({
          src: item.imageUrls[0],
          link: '/goods/detail/' + item.productNo
        })
      }

      return goods
    },
    goodsSelected () {
      return Object.values(this.check).filter(i => i).length > 0
    }
  },
  methods: {
    toggleCheckAll () {
      let check = {}
      for (const goods of this.goods) {
        check[goods.productNo] = this.checkAll
      }

      this.check = check
      this.checkList = []
      if (this.checkAll) {
        this.goods.map(item => {
          this.checkList.push(item.productNo)
        })
      }
    },
    toggleCheck (productNo) {
      if (this.check[productNo]) {
        if (this.checkList.indexOf(productNo) < 0) this.checkList.push(productNo)
      } else {
        this.checkList.splice(this.checkList.indexOf(productNo), 1)
      }

      this.checkAll = this.checkList.length === this.goods.length
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  &__wrapper.horizontal {
    width: 100%;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;

    .goods-list {
      flex-wrap: nowrap;
      box-sizing: content-box;

      > .goods-item {
        margin-right: 1.2rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  &__wrapper.vertical {
    .goods-list > .goods-item {
      margin-bottom: 1.2rem;
    }
  }
}

.goods-item {
  position: relative;
}

.goods-check {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 50;
}

.check {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2.8rem;
    margin-bottom: 2.7rem;
  }

  &-all {
    display: inline-block;
    margin-left: 1.2rem;
    margin-top: 0.1rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &-delete-btn {
    border: 1px solid #ddd;
    border-radius: 1.4rem;
    padding: 0 1.3rem;
    height: 2.8rem;
    padding-top: 0.4rem;
    text-align: center;
    font-family: 'Noto Sans KR';
    font-size: 1.2rem;
    font-weight: 500;
    line-height: normal;
    color: #999;
    transition: all .2s;

    &.active {
      color: #666;
    }
  }
}
</style>
