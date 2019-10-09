<template>
  <div v-if="showResult && !emptyAddresses">
    <h4 class="ttl_h4">{{ $t('common.addressItemNew.title') }}<strong class="txt_color_red">{{(addresses && addresses.totalCount) || 0}}</strong>{{ $t('common.addressItemNew.unit') }}</h4>
    <table class="table_list list_2 th-center">
      <colgroup>
        <col style="width:540px">
        <col style="width:160px">
      </colgroup>
      <thead>
        <tr style="text-align: -webkit-auto;">
          <th>{{ $t('common.addressItemNew.address') }}</th>
          <th>{{ $t('common.addressItemNew.postalCode') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2">
            <div class="roller">
              <table class="table_list_sub">
                <colgroup>
                  <col style="width:540px">
                  <col style="width:160px">
                </colgroup>
                <tbody>
                  <tr v-for="(address, index) in addresses && addresses.items" :key="index">
                    <td>
                      <ul class="list_1">
                        <li>
                          <span class="mark">{{ $t('common.addressItemNew.roadName') }}</span>
                          <span class="txt" @click.prevent="selectAddress('address', address)">{{address.address}}{{address.detailAddress}}</span>
                        </li>
                        <li>
                          <span class="mark">{{ $t('common.addressItemNew.zipCode') }}</span>
                          <span class="txt" @click.prevent="selectAddress('jibun', address)">{{address.jibunAddress}}{{address.detailAddress}}</span>
                        </li>
                      </ul>
                    </td>
                    <td>
                      <strong>{{address.zipCode}}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination mt-3">
      <!-- [D] 현재 페이지인 곳에 now 클래스 추가 -->
      <pagination :page="1" :total_count="(addresses && addresses.totalCount) || 0" :page_size="5" :page_term="5" @onPageChange="pageChange" ref="pagination" />
    </div>
  </div>
  <div v-else-if="showResult && emptyAddresses" class="bx_no_result">
    <h4 class="ttl_h4">검색 결과<strong class="txt_color_red">0</strong>개</h4>
    <table class="table_list">
      <tbody>
        <tr>
          <td colspan="2" class="none">
            {{ $t('common.addressItemNew.noData.item1') }}<br>{{ $t('common.addressItemNew.noData.item2') }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination mt-3">
      <!-- [D] 현재 페이지인 곳에 now 클래스 추가 -->
      <a href="#" class="prev" @click.prevent="noDone">{{ $t('common.addressItemNew.prev') }}</a>
      <a href="#" class="now" @click.prevent="noDone"><em>1</em></a>
      <a href="#" class="next" @click.prevent="noDone">{{ $t('common.addressItemNew.next') }}</a>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/pc/assets/Pagination'

export default {
  data () {
    return {
      showResult: false,
      resetPaging: false
    }
  },
  props: ['addresses', 'viewResult'],
  methods: {
    noDone () { },
    selectAddress (addresstype, address) {
      if (addresstype === 'address') {
        this.$emit('selectAddress', 'address', address.zipCode, address.address, address.jibunAddress, address.detailAddress)
      } else if (addresstype === 'jibun') {
        this.$emit('selectAddress', 'jibun', address.zipCode, address.address, address.jibunAddress, address.detailAddress)
      }
    },
    search () {
      this.showResult = true
      this.resetPaging = true
    },
    pageChange (page) {
      this.$emit('pageChange', page)
    }
  },
  components: {
    Pagination
  },
  computed: {
    emptyAddresses () {
      return this.addresses && this.addresses.items.length === 0
    }
  },
  updated () {
    if (this.resetPaging) {
      this.$refs.pagination && this.$refs.pagination.reset()
      this.resetPaging = false
    }
  }
}
</script>
<style scoped>
.ttl_h4 {
  margin-top: 40px !important;
  font-size: 14px !important;
  color: #3c3c3c !important;
}
tr ul.list_1{
  cursor: pointer;
}
</style>
