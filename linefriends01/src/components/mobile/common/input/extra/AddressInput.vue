<template>
  <div class="input-group">
    <div class="input-group inline">
      <app-input
        v-model="address.postcode"
        type="text"
        size="large"
        placeholder="우편번호"
        readonly
       />
      <app-button
        class="search-address"
        type="secondary"
        :disable="readonly"
        @click="search = true"
      >
        검색
      </app-button>
    </div>
    <app-input v-model="address.address" type="text" size="large" placeholder="주소" readonly />
    <app-input v-model="address.detail" type="text" size="large" placeholder="상세 주소" :readonly="readonly" @blur="handleDetailAddress"/>
    <page-popup :show.sync="search">
      <address-input-popup ref="AddressInputPopup" class="address-input-popup" @close="search = false" @select-address="selectAddress" />
    </page-popup>
  </div>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import PagePopup from '@/components/mobile/common/PagePopup'
import AddressInputPopup from './AddressInputPopup'

export default {
  name: 'AddressInput',
  components: {
    AppButton,
    AppInput,
    PagePopup,
    AddressInputPopup
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (next) {
      this.address = {
        postcode: next.postcode,
        address: next.address,
        detail: next.detail,
        jibun: next.jibun
      }
    }
  },
  data () {
    return {
      address: {
        postcode: this.value.postcode,
        address: this.value.address,
        detail: this.value.detail,
        jibun: this.value.jibun
      },
      search: false
    }
  },
  methods: {
    selectAddress (postcode, address, detail, jibun) {
      this.address = {
        postcode,
        address,
        detail,
        jibun
      }
      this.$emit('input', this.address)
    },
    handleDetailAddress () {
      this.$emit('input', this.address)
    }
  }

}
</script>

<style lang="scss" scoped>
.input-group {
  &:not(.inline) {
    > *:not(:last-child) {
      margin-bottom: 0.7rem;
    }
  }

  &.inline {
    display: flex;

    > *:not(:last-child) {
      margin-right: 0.7rem;
    }
  }
}

#postcode {
  width: calc(100% - 11.4rem);
}

.search-address {
  width: 10.7rem;
}
</style>
