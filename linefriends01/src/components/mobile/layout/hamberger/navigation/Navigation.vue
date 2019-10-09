<template>
  <nav class="hamberger-gnb">
    <ul class="hamberger-gnb--block">
      <li class="hamberger-gnb__item">
        <router-link @click.native="commitLeftClose"
          to="/goods"
          class="hamberger-gnb__label"
        >
          {{ $t('menu.all') }}
        </router-link>
      </li>
      <li class="hamberger-gnb__item">
        <router-link @click.native="commitLeftClose"
          to="/goods/sale"
          class="hamberger-gnb__label highlight"
        >
          {{ $t('menu.sale') }}
        </router-link>
      </li>
    </ul>
    <ul class="hamberger-gnb--block">
      <li
        :class="{
          'hamberger-gnb__item': true,
          character: true,
          active: active === -1
        }"
      >
        <label
          class="hamberger-gnb__label character-icon"
          @click="active = active === -1 ? -2 : -1"
        >
          <span>{{ $t('menu.character') }}</span>
          <i class="hamberger-arrow">expand</i>
        </label>

        <div>
          <div
            v-show="active === -1"
            class="hamberger-expand"
          >
            <!-- <brand-container
              :gap="1.8"
              :allcharacter="true"
              :brand="{
                icon: '/static/images/common/character/ic-all.png',
                brandNo: null,
                label: '캐릭터 전체',
                brands: []
              }"
            /> -->
            <brand-container
              v-for="(item, key) in brands"
              v-if="item.intro"
              :key="key"
              :brand="item"
              hamberger
              @commitLeftClose="commitLeftClose"
            />
          </div>
        </div>
      </li>
    </ul>

    <category-block
      :active="active"
      :update-icon = updateIcon
      @setActive="setActive"
      @commitLeftClose="commitLeftClose"
    />

    <ul class="hamberger-gnb--block">
      <li class="hamberger-gnb__item">
        <router-link
        @click.native="commitLeftClose"
          to="/event"
          class="hamberger-gnb__label"
        >
          {{ $t('menu.promotion') }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import TransitionExpand from '@/components/common/transition/TransitionExpand'
import BrandContainer from '@/components/mobile/brand/BrandContainer'
import CategoryBlock from './CategoryBlock'

export default {
  name: 'Navigation',
  components: {
    BrandContainer,
    TransitionExpand,
    CategoryBlock
  },
  props: {
    updateIcon: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      active: -2
    }
  },
  computed: {
    ...mapState('brand', ['brands'])
  },
  methods: {
    setActive (index) {
      this.active = this.active === index ? -2 : index
    },
    commitLeftClose () {
      this.$emit('commitClose')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .hamberger-gnb {
  &__wrapper {
    width: 100%;
  }

  &--block {
    border-width: 1px 0;
    border-style: solid;
    border-color: #eee;

    > .hamberger-gnb__item:first-child > .hamberger-gnb__label {
      padding-top: 0.4rem;
    }

    > .hamberger-gnb__item:last-child > .hamberger-gnb__label {
      padding-bottom: 0.4rem;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  &--block + .hamberger-gnb--block {
    border-top: 0;
  }

  &__item {
    position: relative;

    &.categories {
      &:first-child > .hamberger-gnb__label {
        padding-top: 0;
      }

      > .hamberger-gnb__label {
        line-height: 4.2rem;
      }
    }

    .hamberger-arrow {
      position: absolute;
      top: 2rem;
      right: 2rem;
      display: block;
      font-size: 0;
      background-image: url(~@/assets/images/common/ic-arrow.svg);
      background-size: 1.2rem 0.8rem;
      width: 1.2rem;
      height: 0.8rem;
      transform: rotate(0deg);
      transition: transform .2s;
    }

    &.character .hamberger-arrow {
      top: 2.5rem;
    }

    &.active .hamberger-arrow {
      transform: rotate(-180deg);
    }

    .hamberger-expand {
      width: 100%;
      overflow: hidden;
    }
  }

  &__label {
    display: inline-block;
    width: 100%;
    padding-left: 2rem;
    font-family: "Noto Sans KR",sans-self;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 4.8rem;
    color: #333;

    &.highlight {
      color: #f74254;
    }

    > span {
      display: inline-block;
      vertical-align: top;
      line-height: 3;
    }

    &.character-icon {
      line-height: 3.6rem;
      &:before {
        display: inline-block;
        content: '';
        width: 2.8rem;
        height: 2.8rem;
        margin-right: 0.8rem;
        background-image: url(~@/assets/images/mobile/ic-character.gif);
        background-size: 2.8rem 2.8rem;
        background-repeat: no-repeat;
        vertical-align: middle;
      }

      & > span{
        vertical-align: middle;
        font-size: 1.6rem;
      }
    }
  }
}

/deep/ .hamberger-lnb {
  background: #fafafa;
  padding: 0.4rem 0 0.4rem 2rem;

  &__item {
    .router-link-exact-active {
      font-weight: bold;
    }
  }

  &__label {
    display: inline-block;
    width: 100%;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 4.4rem;
    color: #666;
  }
}

/deep/ .hamberger--update {
  display: inline-block;
  border-radius: 50%;
  background: #5e88ff;
  vertical-align: top;
  margin-top: 1.75rem;
}
</style>
