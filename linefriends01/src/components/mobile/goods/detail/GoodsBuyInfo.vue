<template>
  <div id="container">
    <expand-menu class="goods-buy-info-menu" label="배송정보" opened>
      <div class="expand-content delivery-info">
        <label>배송안내</label>
        <table>
          <tr>
            <th>배송기준</th>
            <td>주문번호별 묶음배송</td>
          </tr>
          <tr>
            <th>배송기간</th>
            <td>1-3영업일 (지역별, 주문 폭증 시 지연가능)</td>
          </tr>
          <tr>
            <th>배송사</th>
            <td>
              <template v-if="product.deliveryFee && product.deliveryFee.deliveryCompanyTypeLabel">
                {{ product.deliveryFee.deliveryCompanyTypeLabel }}
              </template>
              <template v-else>
                {{ $t('goods.detailBuy.delivery.directDelivery') }}
              </template>
            </td>
          </tr>
          <tr>
            <th>배송비</th>
            <td>
              <template v-if="product.deliveryFee && product.deliveryFee.deliveryConditionType === 'FREE'">
                {{ $t('goods.detailBuy.free') }}
              </template>
              <template v-else>
                {{ product.deliveryFee.defaultDeliveryConditionLabel }}
              </template>
            </td>
          </tr>
        </table>
      </div>
    </expand-menu>
    <expand-menu class="goods-buy-info-menu" label="교환/반품" opened>
      <div class="expand-content change-return-info">
        <dl>
          <dt>
            교환/반품 기간
          </dt>
          <dd>
            상품 수령일로부터 7일 이내에 교환/반품이 가능합니다. (교환 상품 품절 시, 반품으로 진행)<br>
            단, 상품이 표시광고 내용과 다르거나 불량 등 계약과 다르게 이행된 경우는 상품 수령일로부터 3개월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 교환/반품이 가능합니다.
          </dd>
        </dl>
        <dl>
          <dt>
            교환/반품 배송비
          </dt>
          <dd>
            <ul>
              <li>교환/반품 배송비 : {{ product.deliveryFee.returnDeliveryAmt }}원</li>
              <li>규격 초과 시, 추가 배송비가 발생할 수 있으며 상품하자 및 배송 오류로 인한 사유는 라인프렌즈에서 부담합니다.</li>
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>
            교환/반품 가능한 경우
          </dt>
          <dd>
            <ul>
              <li>고객님의 단순변심으로 인한 교환/반품 신청이 상품 수령일로부터 7일 이내인 경우</li>
              <li>배송된 상품이 주문 내역 및 상품 페이지에 제공된 정보와 상이한 경우</li>
              <li>배송된 상품이 파손/손상되거나 심하게 오염되어 있을 경우</li>
            </ul>
          </dd>
        </dl>
        <dl>
          <dt>
            교환/반품 불가한 경우
          </dt>
          <dd>
            <ul>
              <li>고객님의 단순변심으로 인한 교환/반품 신청이 상품 수령일로부터 7일이 경과한 경우</li>
              <li>고객님의 부주의로 인해 상품 등이 멸실 또는 훼손된 경우</li>
              <li>고객님의 사용 또는 소비에 의하여 상품 등의 가치가 현저히 감소한 경우</li>
              <li>시간이 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
              <li>포장 개봉 시 상품가치가 훼손되는 식품, 문구, 완구, 소형가전 등의 상품인 경우</li>
              <li>반송된 상품의 구성품이 누락된 경우 (가전제품 부속품, 사은품 등)</li>
              <li>
                기타 전자상거래 등에서의 소비자보호에 관한 법률이 정하는 소비자 청약철회 제한 내용에 해당되는 경우<br>
                <router-link to="/etc/faq">더 알아보기</router-link>
              </li>
            </ul>
          </dd>
        </dl>
      </div>
    </expand-menu>
    <expand-menu class="goods-buy-info-menu" label="고객센터" opened>
      <p class="expand-content contact-info">
        ☎ 1544-5921<br>
        평일 09시-18시 / 점심시간 12시-13시<br>
        (토요일 및 공휴일 휴무)<br>
        <span>✉</span> customercare@linefriends.com
      </p>
    </expand-menu>
    <!-- <expand-menu
      class="goods-buy-info-menu"
      label="판매자 정보"
      opened
    >
      <ul class="expand-content seller-info">
        <li>- 미성년자가 물품을 구매하는 경우, 법정대리인이 동의하지 않으면 미성년자 본인 또는 법정대리인이 구매를 취소할 수 있습니다.</li>
        <li>- 안전검사 대상 공산품이나 어린이 보호포장대상 공산품을 구매하는 경우 품질경영 및 공산품 안전관리법에 따른 안전검사 표시가 있는 제품이거나 어린이 보호 포장 착용제품인지를 확인하시기 바랍니다.</li>
        <li>- 정보,전기통신기기를 구매하는 경우 관련법률에 따라 인증 또는 승인을 받은 상품인지 확인하시기 바랍니다.</li>
        <li>- 예약 및 입장권 티켓 등의 여행상품을 구매할 경우, 배송이 되지 않고 현장  이용하는 상품이 많으니 구매전 이용방법 및 판매자 약관을 꼭 확인하시기 바랍니다.</li>
        <li>- 라인프렌즈몰의 결제시스템을 이용하지 않고 판매자와 직거래 하실 경우 상품을 받지 못하거나 구매한 상품과 상이한 상품을 받는 등 피해가 발생할 수 있으니 유의하시기 바랍니다.</li>
        <li>- 라인프렌즈몰에서 등록된 판매물품과 내용은 판매자가 등록한 것으로 라인프렌즈(주)가 운영하는 라인프렌즈몰은 중개시스템만 제공하며 내용에 대하여 일체 책임을 지지 않습니다.</li>
      </ul>
    </expand-menu> -->
  </div>
</template>

<script>
import ExpandMenu from '@/components/mobile/common/list/ExpandMenu'

export default {
  name: 'GoodsBuyInfo',
  components: {
    ExpandMenu
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 0 2rem 4rem;
}

.goods-buy-info-menu {
  padding: 2.8rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  /deep/ .expand-menu__label {
    padding-left: 0;
    padding-right: 0.8rem;
  }
}

.expand-content {
  padding-top: 2.8rem;
  padding-bottom: 1.2rem;
}

.delivery-info {
  label {
    display: inline-block;
    margin-bottom: 0.8rem;
    font-family: "Noto Sans KR";
    font-size: 1.2rem;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333333;
  }

  table {
    border-top: 1px solid #eee;

    td,
    th {
      border-bottom: 1px solid #eee;
      padding: 0.8rem 1.2rem;
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #666666;
      text-align: left;
      font-weight: 400;
    }

    th {
      width: 11.2rem;
      background: #fafafa;
      font-weight: 500;
    }
  }
}

.change-return-info {
  dl:not(:last-child) {
    margin-bottom: 3.2rem;
  }

  dt,
  dd {
    font-family: "Noto Sans KR";
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #666666;
  }

  dt {
    font-weight: 500;
    color: #333333;
    margin-bottom: 0.4rem;
  }

  ul {
    padding-left: 0.8rem;

    li {
      &::before {
        content: "-";
        margin-left: -0.8rem;
        font-family: "Noto Sans KR";
        font-size: 1.2rem;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: -0.01rem;
        color: #666666;
        padding-right: 0.4rem;
      }
    }
  }

  a {
    color: #4ba4d9;
    text-decoration: underline;
  }
}

.contact-info {
  font-family: "Noto Sans KR";
  font-size: 1.2rem;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #666;
  & > span {
    vertical-align: middle;
    font-size: 2rem;
  }
}

.seller-info {
  li {
    font-family: "Noto Sans KR";
    font-size: 1.2rem;
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #666;

    &:not(:last-child) {
      margin-bottom: 1.2rem;
    }
  }
}
</style>
