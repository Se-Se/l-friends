<template>
  <div class="bill">
    <div class="bill_con">
      <div class="column_4 plus">
        <table class="table_bill">
          <tbody>
          <tr>
            <th>
              <span class="ttl">商品割引金額</span>
            </th>
          </tr>
          <tr>
            <td>
              <strong class="amount">￥ {{productAmt | formatCurrency}}</strong>
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
              <span class="ttl">カート割引金額</span>
            </th>
          </tr>
          <tr>
            <td>
              <strong class="amount">￥ {{cartAmt | formatCurrency}}</strong>
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
              <span class="ttl">送料割引金額</span>
            </th>
          </tr>
          <tr>
            <td>
              <strong class="amount">￥ {{deliveryAmt | formatCurrency}} </strong>
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
              <span class="ttl">総割引金額</span>
            </th>
          </tr>
          <tr>
            <td>
              <strong class="amount total">￥ {{totalAmt | formatCurrency}}</strong>
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
