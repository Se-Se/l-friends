<template>
  <div class="project-goods">
    <ul
      class="project-goods__list"
    >
      <li
        v-for="(item, key) in goods"
        :key="key"
        class="project-goods__item"
        :class="('project-goods__item', mode)"
      >
        <a href="#">
          <project-goods-single
            :item="item"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import ProjectGoodsSingle from './ProjectGoodsSingle'

export default {
  name: 'ProjectGoodsList',
  components: {
    ProjectGoodsSingle
  },
  props: {
    goods: {
      type: Array,
      default: () => ([])
    },
    mode: {
      type: String,
      default: ''
    }
  }
}
</script>
