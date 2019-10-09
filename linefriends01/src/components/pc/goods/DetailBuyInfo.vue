<template>
  <div class="detail-buyinfo">
    <div class="detail-buyinfo__content">
      <h2 class="detail-buyinfo__title">
        {{ $t('goods.detailBuy.delivery.title') }}
      </h2>
      <table class="detail-info__tbl">
        <colgroup>
          <col span="1" style="width: 259px;"/>
          <col span="1" style="width: 980px;"/>
        </colgroup>
        <tbody>
          <tr>
            <th>{{ $t('goods.detailBuy.delivery.standard') }}</th>
            <td>{{ $t('goods.detailBuy.delivery.standardInfo') }}</td>
          </tr>
          <tr>
            <th>{{ $t('goods.detailBuy.delivery.term') }}</th>
            <td>
              {{ $t('goods.detailBuy.delivery.termInfo') }}
            </td>
          </tr>
          <tr>
            <th>{{ $t('goods.detailBuy.delivery.company') }}</th>
            <td>
              <template v-if="deliveryFee.deliveryCompanyType">
                {{ deliveryFee.deliveryCompanyTypeLabel }}
              </template>
              <template v-else>
                {{ $t('goods.detailBuy.delivery.directDelivery') }}
              </template>
            </td>
          </tr>
          <tr>
            <th>{{ $t('goods.detailBuy.delivery.price') }}</th>
            <td>
              <template v-if="deliveryFee && deliveryFee.deliveryConditionType === 'FREE'">
                {{ $t('goods.detailBuy.free') }}
              </template>
              <template v-else>
                {{ deliveryFee.defaultDeliveryConditionLabel || '-' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="detail-buyinfo__content _return">
      <h2 class="detail-buyinfo__title">
        {{ $t('goods.detailBuy.return.title') }}
      </h2>
      <div class="detail-buyinfo__return">
        <h2 class="detail-buyinfo__return-title">{{ $t('goods.detailBuy.return.term') }}</h2>
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.return.termInfo.txt1') }}<br/>
          {{ $t('goods.detailBuy.return.termInfo.txt2') }}<br/>
          {{ $t('goods.detailBuy.return.termInfo.txt3') }}
        </p>
      </div>
      <div class="detail-buyinfo__return">
        <h2 class="detail-buyinfo__return-title">{{ $t('goods.detailBuy.return.price') }}</h2>
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.return.priceInfo.item1') }}
          <template v-if="deliveryFee && deliveryFee.returnDeliveryAmt === 0">
            {{ $t('goods.detailBuy.free') }}
          </template>
          <template v-else>
            {{ deliveryFee.returnDeliveryAmt }}{{ $t('currency') }}
          </template>
          <!-- {{ $t('goods.detailBuy.return.priceInfo.item2') }}<br/> -->
          {{ $t('goods.detailBuy.return.priceInfo.item3') }}
        </p>
      </div>
      <div class="detail-buyinfo__return">
        <h2 class="detail-buyinfo__return-title">{{ $t('goods.detailBuy.return.possible') }}</h2>
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.return.possibleInfo.txt1') }}<br/>
          {{ $t('goods.detailBuy.return.possibleInfo.txt2') }}<br/>
          {{ $t('goods.detailBuy.return.possibleInfo.txt3') }}
        </p>
      </div>
      <div class="detail-buyinfo__return">
        <h2 class="detail-buyinfo__return-title">{{ $t('goods.detailBuy.return.impossible') }}</h2>
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.return.impossibleInfo.txt1') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt2') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt3') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt4') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt5') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt6') }}<br/>
          {{ $t('goods.detailBuy.return.impossibleInfo.txt7') }}<br/>
          <router-link to="/etc/faq">{{ $t('common.moreInfo') }}</router-link>
        </p>
      </div>
    </div>
    <div class="detail-buyinfo__content _service">
      <h2 class="detail-buyinfo__title">
        {{ $t('goods.detailBuy.contact.title') }}
      </h2>
      <div class="detail-buyinfo__return">
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.contact.contactInfo.txt1') }}<br/>
          {{ $t('goods.detailBuy.contact.contactInfo.txt2') }}<br/>
          {{ $t('goods.detailBuy.contact.contactInfo.txt3') }}<br/>
          <span>✉</span>{{ $t('goods.detailBuy.contact.contactInfo.txt4') }}
        </p>
      </div>
    </div>
    <!-- <div class="detail-buyinfo__content _return">
      <h2 class="detail-buyinfo__title">
        {{ $t('goods.detailBuy.buyerInfo.title') }}
      </h2>
      <div class="detail-buyinfo__return">
        <p class="detail-buyinfo__return-description">
          {{ $t('goods.detailBuy.buyerInfo.info.item1') }}<br/>
          {{ $t('goods.detailBuy.buyerInfo.info.item2') }}<br/>
          {{ $t('goods.detailBuy.buyerInfo.info.item3') }}<br/>
          {{ $t('goods.detailBuy.buyerInfo.info.item4') }}<br/>
          {{ $t('goods.detailBuy.buyerInfo.info.item5') }}<br/>
          {{ $t('goods.detailBuy.buyerInfo.info.item6') }}
        </p>
      </div>
    </div> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'DetailBuyInfo',
  props: {
    buyInfo: {
      type: Object,
      required: false
    }
  },
  computed: {
    ...mapState('productrecommand', { recommands: 'list' }),
    baseInfo () {
      const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    },
    deliveryFee () {
      return this.buyInfo && this.buyInfo.deliveryFee ? this.buyInfo.deliveryFee : {}
    }
  }
}
</script>
