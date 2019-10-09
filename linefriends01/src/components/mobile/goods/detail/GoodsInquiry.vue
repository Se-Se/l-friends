<template>
  <div id="container">
    <div
      v-if="inquiryList && inquiryList.totalCount > 0"
      class="goods-inquiry"
    >
      <div
        class="goods-inquiry-button"
      >
        <app-button
          :to="isLogined ? { name: 'GoodsInquiry', params: { goodsNo: product.baseInfo.productNo } } : '/member/login'"
          size="middle-small"
        >
          상품문의 등록하기
        </app-button>
      </div>
      <div class="goods-inquiry-list" ref="goodsInquireList">
        <inquiry-item
          v-for="(item, index) in inquiryList.item"
          :key="index"
          :inquiry="item"
          :active="active === item.inquiryNo"
          @click="setActive(item.inquiryNo)"
        />
      </div>
      <pagination
        class="goods-inquiry-pagination"
        :value="page"
        :total="inquiryList.totalCount"
        :limit="5"
        @input="fetchList"
      />
    </div>
    <not-found
      v-else
      description="등록된 상품문의가 없습니다."
    >
      <app-button
        :to="isLogined ? { name: 'GoodsInquiry', params: { goodsNo: product.baseInfo.productNo } } : '/member/login'"
        class="add-inquiry"
        size="middle-small"
      >
        상품문의 등록하기
        <img
          class="add-inquiry__img"
          src="@/assets/images/mobile/ic-chat.svg"
        >
      </app-button>
    </not-found>
  </div>
</template>

<script>
import NotFound from '@/components/mobile/goods/detail/NotFound'
import AppButton from '@/components/mobile/common/button/Button'
import InquiryItem from '@/components/mobile/goods/InquiryItem'
import Pagination from '@/components/mobile/common/list/Pagination'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'GoodsInquiry',
  components: {
    NotFound,
    AppButton,
    InquiryItem,
    Pagination
  },
  data () {
    return {
      page: this.$router.currentRoute.params.page || 1,
      active: -1,
      items: []
    }
  },
  computed: {
    ...mapGetters('product', ['product']),
    ...mapGetters(['isLogined']),
    ...mapState('productinquiry', ['inquiryList']),
    goodsNo () {
      return this.$router.currentRoute.params.goodsNo
    }
  },
  watch: {
    inquiryList: function (val) {
      this.$refs.goodsInquireList.style.removeProperty('height')
      this.items = [...val.item]
    }
  },
  methods: {
    ...mapActions('productinquiry', ['fetchProductInquiry']),
    init () {
      this.page = 1
      this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
    },
    fetchList (num) {
      if (num !== this.page) {
        const goodsNode = this.$refs.goodsInquireList.childNodes
        if (goodsNode.length) {
          this.$refs.goodsInquireList.style.height = goodsNode[0].offsetHeight * this.items.length + 'px'
        }
        this.inquiryList.item = []
        setTimeout(() => {
          this.inquiryList.item = this.items
        }, 1)
        this.page = num
        this.active = -1
        this.$emit('update')
        this.fetchProductInquiry({ productNo: this.goodsNo, pageNo: this.page })
      }
    },
    setActive (inquiryNo) {
      let tempItem = this.inquiryList.item.find(item => item.inquiryNo === inquiryNo)
      if (tempItem && tempItem.answers) {
        this.active = this.active === inquiryNo ? -1 : inquiryNo
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-inquiry {
  &-list {
    margin: 2rem 0;
  }
  &-button {
    margin: 2rem;
    color: #333333;
    font-family: 'Noto Sans KR';
  }
  &-pagination {
    margin-bottom: 8rem;
  }
  &-nodata {
    &__wrap {
    position: absolute; left: 50%;
    transform: translateX(-50%);
    margin: 12rem 0 19.6rem 0;
    }
    &__img {
      margin: 0 auto;
      width: 8.333rem;
      height: 14rem;
    }
    &__title {
      margin: 2rem 0 0;
      color: #666666;
      font-size: 1.4rem;
      font-family: 'Noto Sans KR';
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
      text-align: center;
    }
  }
}

.add-inquiry {
  margin-top: 2.333rem;
  width: 17.4rem;

  &__img {
    vertical-align: top;
    margin-top: 0.3rem;
    width: 1.6rem;
    height: 1.5rem;
  }
}
</style>
