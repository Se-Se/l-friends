<template>
  <form>
    <fieldset>
      <legend class="blind">カート</legend>
      <div class="table_wrap">
        <table class="table_data item table_cart_area">
          <caption class="blind">カート</caption>
          <colgroup>
            <col style="width:82px">
            <col style="">
            <col style="width:150px">
            <col style="width:176px">
            <col style="width:140px">
            <col style="width:140px">
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span class="bx_input check2">
                  <input id="check_box_all" type="checkbox">
                  <label for="check_box_all"><span></span></label>
                </span>
              </th>
              <th scope="col">商品情報</th>
              <th scope="col">数量</th>
              <th scope="col">小計(税込)</th>
              <th scope="col">送料</th>
              <th scope="col">注文</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6">
                <div class="data_none">
                  <span class="ico"></span>
                  <p class="txt">カートには商品が入っていません。</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </fieldset>
  </form>
</template>
