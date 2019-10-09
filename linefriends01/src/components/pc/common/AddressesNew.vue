<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'popup_size_2'" :no_area_contents="true" ref="modal"  popup_name="addressModified" @closeAddressesPopup="closeAddressesPopup">
    <h1 slot="title">{{ $t('common.addressNew.title') }}</h1>
    <div class="con mypage-layerpopup">
      <div class="zip_code">
        <div class="table-grid">
          <div class="table-grid__left input_con width-400 zipcode">
            <input class="address" type="text" placeholder="예)이태원로200" @keypress.enter="searchAddresses" v-model="keyword">
          </div>
          <div class="able-grid__left btn_con mar-left--1 width-100">
            <button class="btn btn_gray" @click.prevent="searchAddresses">{{ $t('common.addressNew.search') }}</button>
          </div>
        </div>
        <p class="txt_ex_1">{{ $t('common.addressNew.info') }}</p>
      </div>

      <address-item :addresses="addresses" @selectAddress="setAddress" @pageChange="pageChange" ref="addressItem" />
    </div>
  </modal-layer-popup>
</template>
<script>
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import { mapState, mapActions } from 'vuex'
import AddressItem from '@/components/pc/common/AddressItemNew'
import { addClass, removeClass } from '@/utils/utils'
import { Alert, Confirm } from '@/utils/event-bus'
export default {
  props: ['isShowAddresses'],
  data () {
    return {
      keyword: '',
      active: false
    }
  },
  components: {
    AddressItem,
    ModalLayerPopup
  },
  methods: {
    ...mapActions('common', ['resetAddress']),
    close () {
      this.$emit('update:isShowAddresses', false)
    },
    searchAddresses () {
      if (!this.keyword || !this.keyword.trim()) {
        // alert('검색어를 입력해주세요.')
        Alert({
          message: '검색어를 입력해주세요.'
        })
        return
      }
      this.$refs.addressItem.search()
      this.pageChange(1)
    },
    pageChange (page) {
      const params = {
        keyword: this.keyword,
        pageNumber: page
      }
      this.$store.dispatch('common/fetchAddresses', params)
    },
    setAddress (type, zipCode, address, jibunAddress, detailAddress) {
      this.$emit('setPopupAddress', type, zipCode, address, jibunAddress, detailAddress)
      this.$refs.modal.close()
      this.$emit('openFather')
      // this.close()
    },
    keywordClean () {
      this.resetAddress()
      this.keyword = ''
    },
    openAddressesPopup () {
      addClass(document.body, 'no_scroll')
      this.keywordClean()
      this.active = true
    },
    closeAddressesPopup () {
      removeClass(document.body, 'no_scroll')
      this.active = false
      this.$emit('openFather')
    }
  },
  computed: {
    ...mapState('common', ['addresses', 'loading'])
  }
}
</script>
<style scoped>
.popup_common h1 {
  font-size: 24px !important;
  font-weight: bold !important;
  color: #3c3c3c !important;
  text-align: left !important;
  height: 24px !important;
}
.popup_common .txt_ex_1 {
  padding: 0 !important;
  padding-top: 10px !important;
  color: #969696 !important;
  font-size: 13px !important;
  margin: 0 !important;
}
input {
  width: 100% !important;
}
</style>
