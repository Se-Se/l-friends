<template>
  <article class="tab">
    <nav class="tab-nav">
      <ul class="tab-list">
        <li
          v-for="(id, label) in tabs"
          :key="id"
          :class="{ 'tab-list__label': true, 'tab-list__label--active': id === active }"
          @click.prevent="tabUpdate(id)"
        >
          <a href='#'>
            {{ label }}
          </a>
        </li>
      </ul>
    </nav>
    <div class="tab-contents">
      <slot />
    </div>
  </article>
</template>
<script>
import TabContainer from './TabContainer'

export default {
  name: 'ServiceTabContainer',
  mixins: [TabContainer]
}
</script>

<style lang="scss" scoped>
.tab {
  overflow-x: auto;
  &-list {
    display: flex;
    width: max-content;
    padding: 0 2rem;
    border-bottom: 1px solid #eee;
    &__label {
      text-align: center;
      &:not(:last-child) {
        margin-right: 2.466rem;
      }
      & > a {
        display: block;
        padding: 1.4rem 0;
        color: #999;
        font-size: 1.6rem;
        font-weight: normal;
        line-height: normal;
        letter-spacing: -0.01rem;
      }
      &--active {
        > a {
          border-bottom: 2px solid #333;
          color: #333;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
