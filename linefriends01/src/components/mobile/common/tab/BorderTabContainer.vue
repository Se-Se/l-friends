<template>
  <article class="tab">
    <nav class="tab-nav">
      <ul class="tab-list">
        <li
          v-for="(id, label) in tabs"
          :key="id"
          :class="{ 'tab-list__label': true, 'tab-list__label--goods': !!goods, 'tab-list__label--active': id === active }"
          @click="tabUpdate(id)"
        >
          <p>
            {{ label }}
            <span
              v-if="count[id] !== undefined"
              class="number"
            >
              {{ count[id].toLocaleString() }}
            </span>
          </p>
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
  name: 'BorderTabContainer',
  mixins: [TabContainer],
  props: {
    goods: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {

  &-list {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: flex-end;
    top: -.1rem;
    
    &__label {
      flex: 1;
      height: 4.2rem;
      padding-top: 1.1rem;
      padding-bottom: 0.9rem;
      border-bottom: 1px solid #eee;
      text-align: center;

      transition: all .2s;

      & > p {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: normal;
        line-height: normal;
        letter-spacing: -0.01rem;
        color: #999;

        transition: all .2s;
      }

      &--goods{
        height: 5.2rem;
        transition: none;
        padding: 0;

        & > p {
          display: inline-block;
          transition: none;
          font-size: 1.6rem;
          line-height: 5.2rem;
        }
      }

      &--active {
        border-width: 2px;
        border-color: #333;

        > p {
          font-weight: bold;
          color: #333;
        }
      }
    }
  }
}
</style>
