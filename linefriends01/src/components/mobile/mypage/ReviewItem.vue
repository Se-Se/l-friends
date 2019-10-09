<template>
  <div class="review-goods__wrapper">
    <div class="review-goods">
      <router-link :to="'/goods/detail/'+product.productNo">
        <div class="review-goods-image">
          <img :src="product.imageUrl" :title="product.productName" :alt="product.productName">
        </div>
      </router-link>
      <div class="review-goods-info">
        <p class="review-goods__name">
          <router-link :to="'/goods/detail/'+product.productNo">
            {{ product.productName }}
          </router-link>
        </p>
        <div class="review-goods__options">
          <template v-if="reviewable">
            <span class="review-goods__option">{{ product.optionName }}: {{ product.optionValue }}</span>
            <span class="review-goods__count">구매수량 : {{ product.orderCnt.toLocaleString() }}개</span>
          </template>
          <template v-else>
            <span class="review-goods__option">{{ product.orderedOption.optionName }}: {{ product.orderedOption.optionValue }}</span>
            <span class="review-goods__count">구매수량 : {{ product.orderedOption.orderCnt.toLocaleString() }}개</span>
          </template>
        </div>
        <app-button v-if="!product.content" size="review-width" class="review-add-btn" @click="$emit('add', product)">
          상품평 작성하기
        </app-button>
      </div>
    </div>
    <div v-if="product.content" class="review-info">
      <div class="review-star__wrapper">
        <star-selector v-model="product.rate" readonly />
      </div>
      <p class="review-content">
        <more-view :content="product.content"></more-view>
      </p>
      <div class="review-header">
        <span class="review-header__user-email" v-if="profile && profile.email">{{ profile.email }}</span>
        <span class="review-header__reg-date">{{product.registerYmdt.split(' ')[0].replace(/-/g,'.')}}</span>
      </div>
      <ul v-if="isShowImage" :class="['review-images', isMore ? 'more': '']">
        <li v-for="i in product.fileUrls.length" :key="i" :style="{ backgroundImage: 'url(' + product.fileUrls[i-1] + ')' }" class="review-images__item" @click="showMore(i-1)" />
      </ul>
      <ul class="review-buttons">
        <li class="review-buttons__item">
          <app-button size="small" @click="$emit('update', product)">
            수정
          </app-button>
        </li>
        <li class="review-buttons__item">
          <app-button @click="deleteReview(product.productNo, product.reviewNo)" size="small">
            삭제
          </app-button>
        </li>
      </ul>
    </div>
    <image-modal :bus="modalBus" />
  </div>
</template>

<script>
import Vue from 'vue'
import ImageModal from '@/components/mobile/common/modal/ImageModal'
import AppButton from '@/components/mobile/common/button/Button'
import MyReviewNew from '@/components/mixins/mypage/review/MyReviewsNew'
import MyReviewableNew from '@/components/mixins/mypage/review/MyReviewableNew'
import StarSelector from '@/components/mobile/common/StarSelector'
import MoreView from '@/components/common/MoreView'

export default {
  name: 'ReviewItem',
  mixins: [MyReviewNew, MyReviewableNew],
  components: {
    AppButton,
    ImageModal,
    StarSelector,
    MoreView
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    reviewable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalBus: new Vue()
    }
  },
  computed: {
    isMore () {
      return this.product.fileUrls.length < 5
    },
    isShowImage () {
      return this.product.fileUrls && this.product.fileUrls.length > 0
    },
    images () {
      let images = []
      for (const image of this.product.fileUrls) {
        images.push(image)
      }

      return images
    }
  },
  methods: {
    showMore (index) {
      this.modalBus.$emit('open', this.images, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  &-goods {
    display: flex;
    justify-content: space-between;

    &__wrapper {
      padding: 3.6rem 2rem 3.5rem;
    }

    &-image {
      width: 9.6rem;

      img {
        width: 100%;
      }
    }

    &-info {
      width: calc(100% - 12.4rem);
    }

    &__name {
      margin-top: -0.4rem;
      padding-right: 2rem;
      font-family: "Noto Sans KR";
      font-weight: normal;
      font-size: 1.6rem;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #333;
      word-break: keep-all;
    }

    &__options {
      margin-top: 0.5rem;
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1.43;
      letter-spacing: -0.01rem;
      color: #999;
    }
    &__option {
      padding-right: 0.8rem;
    }
  }

  &-star {
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;

    &__wrapper {
      display: flex;
    }

    &.active {
      color: #333;
    }
  }

  &-header {
    &__user-email {
      padding-right: 2.5rem;
    }
    &__user-email,
    &__reg-date {
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #999;
    }
  }

  &-content {
    margin: 1.9rem 0;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
    & > pre {
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
      padding: 0;
    }
  }

  &-images {
    display: flex;
    margin-top: 2.1rem;

    &__item {
      width: 6rem;
      height: 6rem;
      background-size: cover;
      border: 1px solid #ededed;

      &:not(:last-child) {
        margin-right: 0.4rem;
      }
    }

    &.more &__item:last-child::after {
      content: "더보기";
      display: block;
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      background: rgba(255, 255, 255, 0.5);
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333;
      text-align: center;
    }
  }

  &-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 2.4rem;

    &__item {
      width: 5.3rem;
      margin-left: 0.8rem;
    }
  }

  &-add-btn {
    width: 14.4rem;
    margin-top: 1.8rem;
  }

  &-info {
    margin-top: 3.2rem;
  }
}
</style>
