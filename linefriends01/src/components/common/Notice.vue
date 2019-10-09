<template>
  <div
    v-if="notices && notices.length > 0"
    :class="['notice__container', device]"
  >
    <div
      v-for="(notice, index) in notices"
      :key="index"
    >
      <transition name="notice">
        <div
          v-if="active === index"
          :class="['notice__wrapper', device]"
          @click="$router.push(`/notice/detail/${notice.articleNo}`)"
        >
          <span class="notice-icon">NOTICE</span>
          <p class="notice-content">
            {{ notice.title }}
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { isPC } from '@/utils/utils'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Notice',
  async created () {
    this.setBoard('notice')
    await this.fetchList(this.search)

    if (this.notices) {
      setInterval(() => {
        this.active = (this.active + 1) % this.notices.length
      }, 5000)
    }
  },
  data () {
    return {
      search: {
        keyword: ''
      },
      active: 0
    }
  },
  computed: {
    device () {
      return isPC() ? 'pc' : 'mobile'
    },
    ...mapGetters('board', { notices: 'list' })
  },
  methods: {
    ...mapActions('board', ['setBoard', 'fetchList'])
  }
}
</script>

<style lang="scss" scoped>
.notice {
  &-enter-active, &-leave-active {
    transition: opacity .3s;
  }

  &-enter-active {
    z-index: 1;
  }

  &-leave-active {
    z-index: 2;
  }

  &-enter, &-leave-to {
    opacity: 0;
  }
}

.notice__container.mobile {
  height: 4rem;
  position: relative;
  background: #f6f6f6;
}

.notice__wrapper.mobile {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  padding-top:0.1rem;

  .notice-icon {
    background: #fff;
    height: 2rem;
    width: 5.3rem;
    border-radius: 2rem;
    text-align: center;
    line-height: 2.27rem;
    font-size: 1.1rem;
    font-family: Volte, sans-serif;
    font-weight: 600;
    color: #333;
    margin-right: 0.6rem;
    margin-left: -0.3rem;
  }

  .notice-content {
    font-family: "Noto Sans KR",sans-self;
    font-weight: 500;
    font-size: 1.3rem;
    letter-spacing: -0.07rem;
    color: #333;
  }
}
</style>
