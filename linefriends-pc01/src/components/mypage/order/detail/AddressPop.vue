<template>
  <div class="popup-layer" style="display: block;">
    <div class="popup_common popup_size_5">
      <div class="roller_area">
        <h1>お届け先の変更</h1>
        <div class="con">
          <table class="table_info sp_2 order-pop-thw">
            <thead>
              <tr>
                <th>
                  <span class="must">受取人</span>
                </th>
                <td>
                  <div class="win-220">
                    <input type="text" placeholder="受取人" v-model="editAddress.receiverName" ref="receiverName">
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <span class="must">住所</span>
                </th>
                <td>
                  <dl class="address">
                    <dt>郵便番号</dt>
                    <dd>
                      <span>
                        <input type="text" placeholder="郵便番号" v-model="editAddress.receiverZipCd" disabled="true">
                      </span>
                    </dd>
                    <dt>ご住所１(都道府県・市区町村)</dt>
                    <dd>
                      <input type="text" v-model="editAddress.receiverAddress" disabled="true">
                    </dd>
                    <dt>ご住所２(番地・その以降)</dt>
                    <dd>
                      <input type="text" placeholder="ご住所２(番地・その以降)を入力してください。" v-model="editAddress.receiverDetailAddress" disabled="true">
                    </dd>
                  </dl>
                </td>
              </tr>
              <tr>
                <th>
                  <span class="must">電話番号</span>
                </th>
                <td>
                  <div class="telNum">
                    <div class="number">
                      <input type="text" placeholder="" :maxlength="contact1Length" v-model="contact1" @keypress="onlyNumber" @keyup="phoneNumberCheck">
                    </div>
                    <span class="symbol">-</span>
                    <div class="number">
                      <input type="text" placeholder="" :maxlength="contact2Length" required="" v-model="showContact2" ref="contact2" @keypress="onlyNumber" @keyup="phoneNumberCheck" @keydown="validateNumber" @blur="validateNumber">
                    </div>
                    <span class="symbol">-</span>
                    <div class="number">
                      <input type="text" placeholder="" maxlength="4" required="" v-model="showContact3" ref="contact3" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th class="order-new_query">ご希望のお届け日
                  <div class="tip">
                    <div class="tip_popup size_1">
                      <p>
                        - 選択しない場合、<br>
                        商品のご用意が出来次第<br>
                        発送いたします。
                      </p>
                    </div>
                  </div>
                </th>
                <td>
                  <input type="text" :value="deliveryWishYmdt" disabled="true">
                </td>
              </tr>
              <tr>
                <th>ご希望のお届け時間帯</th>
                <td>
                  <input type="text" :value="deliveryTimeText" disabled="true">
                </td>
              </tr>
              <tr>
                <th>配送コメント</th>
                <td>
                  <vue-select-box class="size_m" :showValue="editAddress.deliveryMemo" :items="memoList" @selected="selectType" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="btn_list btn_list-margin">
          <li>
            <button class="btn" @click.prevent="closePop">キャンセル</button>
          </li>
          <li>
            <button class="btn btn_green" @click.prevent="setAddress">変更</button>
          </li>
        </ul>
      </div>
      <button class="btn_close" @click.prevent="closePop">close</button>
    </div>
  </div>
</template>

<script>
import VueSelectBox from '@/components/common/VueSelectBox'
import { telnoFormat } from '@/utils/StringUtils.js'
import { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { Alert } from '@/components/common/modal'

export default {
  props: ['address', 'deliveryMemo', 'deliveryWishYmdt', 'deliveryTimeText'],
  data () {
    return {
      editAddress: {
        receiverName: '',
        receiverZipCd: '',
        receiverAddress: '',
        receiverDetailAddress: '',
        deliveryMemo: ''
      },
      contact1: this.address ? telnoFormat(this.address.receiverContact1)[0] : '010',
      contact2: this.address ? telnoFormat(this.address.receiverContact1)[1] : '',
      contact3: this.address ? telnoFormat(this.address.receiverContact1)[2] : '',
      contact1Length: 5,
      contact2Length: 4
    }
  },
  computed: {
    memoList () {
      return [
        {
          label: 'なし',
          value: ''
        }, {
          label: '不在時は宅配BOX希望',
          value: '不在時は宅配BOX希望'
        }
      ]
    },
    showContact2: {
      get () {
        return this.contact2
      },
      set (value) {
        this.contact2 = changeKoreanToEmptyString(value)
      }
    },
    showContact3: {
      get () {
        return this.contact3
      },
      set (value) {
        this.contact3 = changeKoreanToEmptyString(value)
      }
    }
  },
  methods: {
    selectType (value) {
      this.editAddress.deliveryMemo = value
    },
    closePop () {
      this.$emit('closePop')
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        $event.preventDefault()
      }
    },
    validateNumber (event) {
      validateNumber(event)
    },
    phoneNumberCheck ($event) {
      switch (this.contact1.length) {
        case 5:
          this.contact2Length = 1
          break
        case 4:
          this.contact2Length = 2
          break
        case 3:
          this.contact2Length = 4
          break
        default:
          this.contact2Length = 4
          break
      }

      switch (this.contact2.length) {
        case 4:
          this.contact1Length = 3
          break
        case 3:
          this.contact1Length = 3
          break
        case 2:
          this.contact1Length = 4
          break
        case 1:
          this.contact1Length = 5
          break
        default:
          this.contact1Length = 5
          break
      }
    },
    setAddress () {
      let lengthCheckd = this.contact1 + this.contact2 + this.contact3
      if (this.contact1 === '' || this.contact2 === '' || this.contact3 === '' || this.contact1.substring(0, 1) !== '0' || lengthCheckd.length < 10) {
        Alert('正しい電話番号を入力してください。')
      } else if (this.editAddress.receiverName.length === 0) {
        Alert('受取人を入力してください。')
      } else {
        let addressRequest = {
          deliveryMemo: this.editAddress.deliveryMemo,
          receiverContact1: `${this.contact1}-${this.contact2}-${this.contact3}`,
          receiverName: this.editAddress.receiverName
        }
        this.$store.dispatch('myorder/editDeliveries', { orderNo: this.$route.params.orderNo, data: addressRequest })
        this.closePop()
      }
    }
  },
  created () {
    let tempAddress = JSON.parse(JSON.stringify(this.address))
    this.editAddress = {
      receiverName: tempAddress.receiverName,
      receiverZipCd: tempAddress.receiverZipCd,
      receiverAddress: tempAddress.receiverAddress,
      receiverDetailAddress: tempAddress.receiverDetailAddress,
      deliveryMemo: JSON.parse(JSON.stringify(this.deliveryMemo))
    }
  },
  destroyed () {
    this.$store.commit('CLOSE_POP')
  },
  components: {
    VueSelectBox
  }
}
</script>
