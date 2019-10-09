<template>
  <div
    class="pagination__wrapper"
  >
    <a
      v-if="blockStart !== 1"
      class="pagination-action pagination-prev"
      @click.prevent="to(blockStart - 1)"
    >{{ $t('assets.pagination.prev') }}</a>
    <ul
      class="pagination-list"
    >
      <li
        v-for="(item, key) in pages"
        :key="key"
        class="pagination-item"
        :class="{ _active: item === page }"
      >
        <a
          href="#"
          @click.prevent="to(item)"
        >
          {{ item }}
        </a>
      </li>
    </ul>
    <a
      v-if="blockEnd !== maxPage"
      class="pagination-action pagination-next"
      @click.prevent="to(blockEnd + 1)"
    >{{ $t('assets.pagination.next') }}</a>
  </div>
</template>
<script>
import * as $ from 'jquery'

export default {
  name: 'Pagination',
  props: {
    toTop: {
      type: Boolean,
      default: true
    },
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
      default: 10
    },
    value: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      page: this.value
    }
  },
  watch: {
    value (next) {
      this.page = Number(next)
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
      return Math.floor((this.page - 1) / this.size) * this.size + 1
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
      if (this.toTop !== false) $('html, body').animate({ scrollTop: 0 })
      if (num >= 1 && num <= this.maxPage) {
        this.page = Number(num)
        this.$emit('input', num)
        this.$emit('change', num)
      }
    },
    reset () {
      this.to(1)
    }
  }
}
</script>
