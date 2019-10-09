<template>
  <div ref="addressInputPopup">
    <sub-page-header
      title="우편번호 검색"
      close
      :onClose="closePopup"
      :fixed="true"
    />
    <div>
      <div class="postcode-search">
        <div class="input-row">
          <app-input
            v-model="keyword"
            id="postcode"
            type="text"
            size="large"
            placeholder="예)이태원로200"
          />
          <div class="search-postcode">
            <app-button
              type="secondary"
              bold
              @click="searchAddresses"
            >
              검색
            </app-button>
          </div>
          <p class="postcode-label">지번 또는 도로명을 입력해주세요</p>
        </div>
        <div class="search-list" v-if="showResult && !emptyAddresses">
          <p class="search-list__result">검색결과 <span>{{ (addresses && addresses.totalCount) || 0 }}</span>개</p>
          <div class="search-list__address">
            <ul class="search-address__wrap">
              <li
                v-for="(address, index) in addresses && addresses.items"
                :key="index"
                class="search-address"
                @click="selectAddress(address)"
              >
                <span class="search-address__numb">{{address.zipCode}}</span>
                <span class="search-address__info">{{address.address}}{{address.detailAddress}}<em>{{address.jibunAddress}}{{address.detailAddress}}</em></span>
              </li>
            </ul>
          </div>
        </div>
        <div
          v-else-if="showResult && emptyAddresses"
          class="search-nodata"
        >
          <p class="search-nodata__result">검색결과 <span>0</span>개</p>
          <span class ="search-nodata__info">검색어에 대한 결과가 없습니다.<br>지번 또는 도로명을 다시 입력해주세요.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as $ from 'jquery'
import { mapState } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'SearchPostCode',
  components: {
    SubPageHeader,
    AppInput,
    AppButton
  },
  data () {
    return {
      keyword: '',
      showResult: false,
      resetPaging: false,
      $popup: null,
      apiLoading: false
    }
  },
  computed: {
    ...mapState('common', ['addresses', 'loading']),
    emptyAddresses () {
      return this.addresses && this.addresses.items.length === 0
    }
  },
  methods: {
    searchAddresses () {
      if (!this.keyword || !this.keyword.trim()) {
        // alert('검색어를 입력해주세요.')
        Alert({
          message: '검색어를 입력해주세요.'
        })
        return
      }

      this.showResult = true
      this.resetPaging = true

      this.pageChange(1)
    },
    pageChange (page) {
      const params = {
        keyword: this.keyword,
        pageNumber: page
      }
      this.$store.dispatch('common/fetchAddresses', params)
    },
    async scrollHandler (e) {
      if (
        this.addresses &&
        this.addresses.items.length < this.addresses.totalCount &&
        this.$popup.scrollTop() + window.innerHeight >= this.$refs.addressInputPopup.scrollHeight - 20 &&
        !this.apiLoading
      ) {
        this.apiLoading = true
        await this.$store.dispatch('common/fetchMoreAddresses')
        this.apiLoading = false
      }
    },
    selectAddress (address) {
      this.$emit('select-address', address.zipCode, address.address, address.detailAddress, address.jibunAddress)
      Object.assign(this.$data, this.$options.data())
      this.$emit('close')
    },
    closePopup () {
      Object.assign(this.$data, this.$options.data())
      this.$emit('close')
    }
  },
  mounted () {
    this.$popup = $(this.$refs.addressInputPopup)
    this.$popup.on('scroll', this.scrollHandler)
  }
}
</script>
