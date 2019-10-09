<template>
  <div class="bill">
    <div class="bill_con">
      <div class="column_4 plus">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">총 상품 할인 금액</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{productAmt | formatCurrency}} {{ $t('currency')}}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4 plus">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">장바구니 할인 금액</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{cartAmt | formatCurrency}} {{ $t('currency')}}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4 equal">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">배송비 할인 금액</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount">{{deliveryAmt | formatCurrency}} {{ $t('currency')}}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column_4">
        <table class="table_bill">
          <tbody>
            <tr>
              <th>
                <span class="ttl">총 할인 금액</span>
              </th>
            </tr>
            <tr>
              <td>
                <strong class="amount total">{{totalAmt | formatCurrency}} {{ $t('currency')}}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['productAmt', 'cartAmt', 'deliveryAmt'],
  computed: {
    totalAmt () {
      return this.productAmt + this.cartAmt + this.deliveryAmt
    }
  }
}
</script>
