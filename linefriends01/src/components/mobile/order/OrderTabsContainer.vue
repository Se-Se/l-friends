<template>
  <article class="tab">
    <nav class="tab-nav">
      <ul class="tab-list">
        <li
          v-for="(id, label) in tabs"
          :key="id"
          :class="{ 'tab-list__label': true, 'tab-list__label--active': id === active }"
          @click="tabUpdate(id)"
        >
          <span>{{ label }}</span>
        </li>
      </ul>
    </nav>
    <div class="tab-contents">
      <slot />
    </div>
  </article>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'OrderTabsContainer',
  props: {
    tabs: {
      type: Object,
      required: true
    },
    count: {
      type: Object,
      default: () => ({})
    },
    bus: {
      type: Vue,
      required: true
    }
  },
  data () {
    return {
      active: 0
    }
  },
  mounted () {
    let id = Object.values(this.tabs)[0]
    this.tabUpdate(id)

    this.bus.$on('set', id => {
      this.tabUpdate(id)
    })
  },
  methods: {
    tabUpdate (id) {
      this.bus.$emit('tab-change', id)
      this.active = id
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-list {
  display: flex;
  width: 100%;
  justify-content: center;
  align-content: flex-end;
  padding-bottom: 2rem;

  &__label {

    & > span {
      font-family: 'Noto Sans KR';
      font-weight: normal;
      color: #999;
      font-size: 1.6rem;
      letter-spacing: -0.01rem;
    }

    &--active > span {
      color: #333;
      text-decoration: underline;
    }

    &:not(:last-child)::after {
      display: inline-block;
      content: '';
      width: 0.1rem;
      height: 1.4rem;
      background: #ddd;
      margin: 0.65rem 1.2rem 0;
      vertical-align:top;
    }
  }
}
</style>
