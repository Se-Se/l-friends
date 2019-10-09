<template>
  <div class="store-tab">
    <ul class="store-tab__list">
      <li class="store-tab__item">
        <a
        @click.prevent="tabMove('all')"
          href="#"
          :class="{  
            'store-tab__item-action': true,
            '_active': active === 'all'
          }"
        >전체</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('korea')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'korea'
          }"
        >한국</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('china')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'china'
          }"
        >중국</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('japan')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'japan'
          }"
        >일본</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('taiwan')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'taiwan'
          }"
        >대만</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('hongkong')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'hongkong'
          }"
        >홍콩</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('thai')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'thai'
          }"
        >태국</a>
      </li>
      <li class="store-tab__item">
        <a
          @click.prevent="tabMove('usa')"
          href="#"
          :class="{
            'store-tab__item-action': true,
            '_active': active === 'usa'
          }"
        >미국</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'StoreTabs',
  data () {
    return {
      active: 'all'
    }
  },
  methods: {
    tabMove (event) {
      this.$emit('childs-event', event)
      if (event === 'all') {
        this.active = 'all'
      } else if (event === 'china') {
        this.active = 'china'
      } else if (event === 'japan') {
        this.active = 'japan'
      } else if (event === 'taiwan') {
        this.active = 'taiwan'
      } else if (event === 'hongkong') {
        this.active = 'hongkong'
      } else if (event === 'korea') {
        this.active = 'korea'
      } else if (event === 'thai') {
        this.active = 'thai'
      } else if (event === 'usa') {
        this.active = 'usa'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
