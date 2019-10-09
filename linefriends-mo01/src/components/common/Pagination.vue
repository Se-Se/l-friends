<template>
  <div class="pagination">
    <a class="prev" @click.prevent="to(blockStart - 1)" v-if="blockStart !== 1">前へ</a>
    <template v-for="(item, key) in pages">
      <a @click.prevent="to(item)" class="now" v-if="item === value" :key="key"><em>{{ item }}</em></a>
      <a v-else :key="key" @click.prevent="to(item)">{{ item }}</a>
    </template>
    <a class="next" @click.prevent="to(blockEnd + 1)" v-if="blockEnd !== maxPage">次へ</a>
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
