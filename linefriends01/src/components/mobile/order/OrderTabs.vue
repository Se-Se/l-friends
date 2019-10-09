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
          <p>{{ label }}</p>
        </li>
      </ul>
    </nav>
  </article>
</template>

<script>
export default {
  name: 'OrderTabs',
  props: ['value', 'tabs'],
  data () {
    return {
      active: this.value
    }
  },
  watch: {
    value (next) {
      this.active = next
    }
  },
  methods: {
    tabUpdate (id) {
      this.$emit('input', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {

  &-list {
    width: 100%;
    display: flex;
    align-content: flex-end;
    border-bottom: 1px solid #eee;

    &__label {
      width: 12.5rem;
      height: 4.2rem;
      padding-top: 1.1rem;
      padding-bottom: 1.23rem;
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

      &--active {
        border-bottom: 2px solid  #333;

        > p {
          font-weight: bold;
          color: #333;
        }
      }
    }
  }
}
</style>
