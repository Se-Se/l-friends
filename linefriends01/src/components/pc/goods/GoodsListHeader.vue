<template>
  <div>
    <div class="goods-list-header">
      <p class="goods-list-header__title">
        <span>{{ total }}</span>{{ $t('goods.list.search') }}
      </p>
      <div class="goods-list-header__option">
        <div class="goods-list-header__select">
          <ul class="select">
            <li class="select-item">
              <select
                v-model="order"
                @change="search"
              >
                <option value="MD_RECOMMEND|ASC">
                  {{ $t('goods.list.recentProduct') }}
                </option>
                <option value="POPULAR|DESC">
                  {{ $t('goods.list.popular') }}
                </option>
                <option value="DISCOUNTED_PRICE|ASC">
                  {{ $t('goods.list.discountedPrice') }}
                </option>
                <option value="DISCOUNTED_PRICE|DESC">
                  {{ $t('goods.list.highPrice') }}
                </option>
              </select>
            </li>
          </ul>
        </div>
        <div class="goods-option">
          <button
            type="button"
            class="goods-option__active"
            @click="charViewToggle()"
          >
            {{ currentBrand.label }}
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-show="charView === true"
        class="goods-option__wrap">
        <div
          class="goods-option__wrap-dim"
          @click="charViewClose()"
        ></div>
        <div class="goods-option__content">
          <layout-width>
            <div class="goods-option-char">
              <h2 class="goods-option-char__title">
                {{ $t('goods.list.charAll') }}
              </h2>
              <ul class="goods-option-char__list">
                <li class="goods-option-char__item">
                  <a
                    href="#"
                    @click.prevent="selectBrand(null)"
                  >
                    <div class="goods-option-char__item--icon">ALL</div>
                    <p class="goods-option-char__item--title">{{ $t('goods.list.all') }}</p>
                  </a>
                </li>
              </ul>
            </div>
            <div
              v-for="(brand, index) in brands"
              :key="index"
              class="goods-option-char"
            >
              <h2 class="goods-option-char__title">
                {{ brand.label }}
              </h2>
              <ul
                v-for="(brandList, index) in make4ColumnBrand(brand)"
                :key="index"
                class="goods-option-char__list"
              >
                <li
                  v-for="(item, bindex) in brandList"
                  :key="bindex"
                  class="goods-option-char__item"
                >
                  <a
                    href="#"
                    @click.prevent="selectBrand(item)"
                  >
                    <figure class="goods-option-char__fig">
                      <img
                        class="goods-option-char__img" 
                        :src="item.icon"
                      >
                      <figcaption class="goods-option-char__fcp">
                        <p>{{ item.label }}</p>
                      </figcaption>
                    </figure>
                  </a>
                </li>
              </ul>
            </div>
          </layout-width>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import * as $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import SelectItem from '../assets/Select'
import LayoutWidth from '../layout/common/LayoutWidth'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

export default {
  name: 'GoodsListHeader',
  components: {
    SelectItem,
    LayoutWidth
  },
  props: {
    total: {
      type: Number,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    orderBy: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      charView: false,
      order: 'MD_RECOMMEND|ASC',
      character: 0,
      goodsListOption: [
        {
          title: this.$t('goods.list.all'),
          value: 'all'
        },
        {
          title: this.$t('goods.list.recentProduct'),
          value: 'new'
        },
        {
          title: this.$t('goods.list.popular'),
          value: 'pop'
        },
        {
          title: this.$t('goods.list.discountedPrice'),
          value: 'rowPrice'
        },
        {
          title: this.$t('goods.list.highPrice'),
          value: 'highPrice'
        }
      ]
    }
  },
  computed: {
    ...mapState('brand', ['brands']),
    ...mapGetters('brand', ['flatBrands']),
    currentBrand () {
      const brandNo = this.$route.query.brandNo || undefined
      if (!brandNo) {
        return { label: this.$t('goods.list.charAll') }
      } else {
        return this.flatBrands.filter(brand => brand.brandNo === brandNo)[0]
      }
    }
  },
  watch: {
    $route (next) {
      if (this.charView === true) {
        this.charViewToggle()
      }

      if (next.query.sortBy) {
        this.order = next.query.sortBy.replace(':', '|')
      } else {
        this.order = 'MD_RECOMMEND|ASC'
      }
    }
  },
  created () {
    this.$elem = $('html, body')
  },
  methods: {
    charViewToggle () {
      if (this.charView === true) {
        this.charView = false
        this.$elem.css('overflow', '')
      } else if (this.charView === false) {
        this.charView = true
        this.$elem.css('overflow', 'hidden')
      }
    },
    charViewClose () {
      this.charView = false
      enablePageScroll()
      this.$elem.css('overflow', '')
    },
    search () {
      this.$emit('getOrderBy', { order: this.order })
      this.$emit('search', { order: this.order })
    },
    make4ColumnBrand (brand) {
      let list = [
        [{ ...brand, label: this.$t('character.all') }]
      ]

      for (const key in brand.brands) {
        const item = brand.brands[key]
        const currentIndex = Math.ceil((Number(key) + 2) / 4) - 1

        list[currentIndex] = [...(list[currentIndex] || []), item]
      }

      return list
    },
    selectBrand (brand) {
      this.charViewToggle()

      let query = {
        ...this.$route.query
      }

      if (brand === null) {
        delete query.brandNo
      } else {
        query.brandNo = brand.brandNo
      }

      this.$router.replace({
        query
      })
    }
  },
  mounted () {
    if (this.orderBy) {
      this.order = this.orderBy
    }
  }
}
</script>
