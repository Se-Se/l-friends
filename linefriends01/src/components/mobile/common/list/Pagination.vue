<template>
  <div class="pagination">
    <a
      v-if="blockStart !== 1"
      class="pagination-action pagination-prev"
      @click.prevent="to(blockStart - 1)"
    >이전</a>
    <ul class="pagination-list">
      <li
        v-for="(item, key) in pages"
        :key="key"
        class="pagination-item number"
        :class="{ active: item === value }"
        @click.prevent="to(item)"
      >
        {{ item }}
      </li>
    </ul>
    <a
      v-if="blockEnd !== maxPage"
      class="pagination-action pagination-next"
      @click.prevent="to(blockEnd + 1)"
    >다음</a>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      default: 5
    },
    value: {
      type: Number,
      default: 1
    },
    scrollTop: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    sideSize () {
      return Math.floor(this.size / 2)
    },
    maxPage () {
      return Math.ceil(this.total / this.limit)
    },
    blockStart () {
      return Math.floor((this.value - 1) / this.size) * this.size + 1
    },
    blockEnd () {
      return Math.min(this.blockStart + this.size - 1, this.maxPage)
    },
    pages () {
      let pages = []
      for (let i = this.blockStart; i <= this.blockEnd; i++) {
        pages.push(i)
      }

      return pages
    }
  },
  methods: {
    to (num) {
      if (this.scrollTop) {
        $('html, body').animate({
          scrollTop: 0
        }, 400)
      }
      if (num >= 1 && num <= this.maxPage) {
        this.$emit('input', Number(num))
        this.$emit('change', Number(num))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  font-size: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &-action {
    font-size: 0;
    width: 2.8rem;
    height: 2.8rem;
    background-size: cover;
    background-repeat: no-repeat;
  }

  &-prev {
    margin-right: 2.4rem;
    background-image: url(~@/assets/images/pc/icons/ic-pagination28x28.svg);
    transform: rotate(180deg);
  }
  &-next {
    margin-left: 2.4rem;
    background-image: url(~@/assets/images/pc/icons/ic-pagination28x28.svg);
  }

  &-list {
    display: flex;
  }

  &-item {
    font-size: 2rem;
    color: #999999;
    line-height: normal;

    &.active {
      font-weight: 600;
      color: #333333;
    }

    &:not(:last-child) {
      margin-right: 2.4rem;
    }
  }
}
</style>
