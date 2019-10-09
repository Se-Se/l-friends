<template>
  <div
    class="sub-page-header--wrapper"
    :class="{ '_fixed': fixed }">
    <div class="sub-page-header">
      <span
        v-if="!close && back"
        class="sub-page-header__icon left sub-page-header__back"
        @click="closeListener"
      >
        뒤로가기
      </span>
      <a
        v-if="close"
        @click.prevent="closeListener"
        class="sub-page-header__icon right sub-page-header__close"
      >
        닫기
      </a>
      <a
        v-if="product"
        class="sub-page-header__icon right sub-page-header__like"
        :class="{ active: product.liked }"
        @click.prevent="toggleLike"
      >
        좋아요
      </a>
      <h2>{{ title }}</h2>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'SubPageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    close: {
      type: Boolean,
      required: false,
      default: false
    },
    back: {
      type: Boolean,
      required: false,
      default: true
    },
    product: {
      type: Object,
      default: null
    },
    onClose: {
      type: Function,
      default: null
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['isLogined'])
  },
  data () {
    return {
      like: false
    }
  },
  methods: {
    ...mapActions('likeProducts', ['postLikeProducts']),
    ...mapMutations('product', ['CHANGELIKED']),
    async toggleLike () {
      if (!this.isLogined) {
        this.$router.push('/member/login')
      } else {
        try {
          await this.postLikeProducts([this.product.baseInfo.productNo])
          this.CHANGELIKED()
        } catch (e) {
          console.log(e)
        }
      }
    },
    closeListener () {
      if (this.onClose) {
        this.onClose()
      } else {
        if (this.$route.query && this.$route.query.tab) {
          this.$router.go(-3)
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
._fixed {
  position: fixed;
  width: 100%;
  background-color: #ffffff;
}

.sub-page-header {
  position: relative;
  height: 5.6rem;
  text-align: center;

  &__icon {
    position: absolute;
    font-size: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3.2rem;
    height: 3.2rem;
    background-size: 100% 100%;

    &.left {
      left: 0.9rem;
    }

    &.right {
      right: 1.2rem;
    }
  }

  &__back {
    background-image: url(~@/assets/images/mobile/back.svg);
  }

  &__close {
    background-image: url(~@/assets/images/mobile/close.svg);
  }

  &__like {
    background-image: url(~@/assets/images/common/ic-heart.svg);

    &.active {
      background-image: url(~@/assets/images/common/ic-heart--active.svg);
    }
  }

  h2 {
    padding-top: 0.1rem;
    line-height: 5.5rem;
    font-size: 1.6rem;
    letter-spacing: -0.01rem;
    color: #333;
    font-family: 'Noto Sans KR';
    font-weight: bold;
  }
}
</style>
