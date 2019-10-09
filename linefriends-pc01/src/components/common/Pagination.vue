<template>
  <div class="list-pagination-block">
    <div class="pagination">
      <a href="javascript:" v-if="blockStart !== 1" class="prev" :class="{ 'disable': blockStart === 1 }" @click.prevent="to(blockStart - 1)">
        前へ</a>
      <a href="javascript:" v-for="(item, key) in pages" :key="key" :class="{ 'now': item === page }" @click.prevent="to(item)">
        <em>{{ item }}</em>
      </a>
      <a href="javascript:" v-if="blockEnd !== maxPage" class="next" :class="{ 'disable': blockEnd === maxPage }" @click.prevent="to(blockEnd + 1)">次へ</a>
    </div>
  </div>
</template>
<script>
// import * as $ from 'jquery'

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
      default: 10
    },
    value: {
      type: Number,
      default: 1
    },
    qaFlag: {
      type: Boolean,
      required: false,
      default: true
    },
    type: {
      required: false
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
      if (num >= 1 && num <= this.maxPage) {
        this.page = Number(num)
        if (this.type === 'list') {
          this.$emit('goPage', Number(num))
        } else {
          this.$emit('input', Number(num))
          this.$emit('change', Number(num))
        }
      }
    }
  }
}
</script>
