<template>
  <div class="cancellation--collection">
    <div class="cancellation--collection__header">
      <h3 class="cancellation--collection__title">
        반품 수거 정보
      </h3>
      <a
        v-if="!claimOrderOption.claimType"
        href="#"
        class="update-delivery"
        @click.prevent="showAddressPopup = true"
      >수거지 정보 변경</a>
    </div>
    <div class="cancellation--collection__info">
      <p class="cancellation--collection__info-title">
        받는 사람
      </p>
      <p class="cancellation--collection__info-value">
        {{ showReturnAddress.receiverName }}
      </p>
    </div>
    <div class="cancellation--collection__info">
      <p class="cancellation--collection__info-title">
        주소
      </p>
      <p class="cancellation--collection__info-value" style="max-width: 22.4rem;">
        <span class="num">{{ showReturnAddress.receiverZipCd }}</span>-{{ showReturnAddress.receiverAddress }} {{ showReturnAddress.receiverDetailAddress }}
      </p>
    </div>
    <div class="cancellation--collection__info">
      <p class="cancellation--collection__info-title">
        휴대전화
      </p>
      <p class="cancellation--collection__info-value">
        {{ showReturnAddress.receiverContact1 }}
      </p>
    </div>
    <transition name="address-input-popup">
      <div
        v-show="showAddressPopup"
        ref="AddressInputPopup"
        class="address-input-popup"
      >
        <address-pop
          ref="addressPop"
          :returnAddress="claimOrderOption.returnAddress"
          :requireCustomsIdNumber="!!claimOrderOption.returnAddress.customsIdNumber" 
          @close="showAddressPopup = false"
          @update="setReturnAddress"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import AddressPop from '@/components/mobile/pages/mypage/order/claim/OrderClaimReturnAddressNew'
import AddressInfoNew from '@/components/mixins/mypage/order/claim/AddressInfoNew'

export default {
  mixins: [AddressInfoNew],
  components: {
    AddressPop
  },
  data () {
    return {
      showAddressPopup: false
    }
  }
}
</script>

<style lang="scss" scoped>
.address-input-popup {
  position: fixed;
  z-index: 1005;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;

  &-enter-active, &-leave-active {
    transition: .3s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}
.cancellation--collection__info {
  align-items: baseline;
}
</style>
