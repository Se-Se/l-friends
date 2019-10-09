<template>
  <div class="cart_wrapper">
    <div class="cart_main">
      <div class="menu">
        <div class="">
          <div class="menuItems">
            <div class="product_item pt-16">
              <ul class="input_list">
                <li>
                  <dl>
                    <dt><span class="must">受取人</span></dt>
                    <dd>
                      <input type="text" placeholder="受取人" v-model="editAddress.receiverName" ref="receiverName">
                    </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt><span class="must">住所</span></dt>
                    <dd><span class="c-666">郵便番号</span></dd>
                    <dd>
                      <span class="table-grid__left w-70p pr-7">
                        <input type="text" v-model="editAddress.receiverZipCd" disabled="true">
                      </span>
                    </dd>
                    <dd><span class="c-666">ご住所１(都道府県・市区町村)</span></dd>
                    <dd>
                      <input type="text" v-model="editAddress.receiverAddress" disabled="true">
                    </dd>
                    <dd><span class="c-666">ご住所２(番地・その以降)</span></dd>
                    <dd>
                      <input type="text" v-model="editAddress.receiverDetailAddress" disabled="true">
                    </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt><span class="must">電話番号</span></dt>
                    <dd>
                      <div class="tn">
                        <p>
                          <input type="text" placeholder="" :maxlength="contact1Length" v-model="contact1" @keypress="onlyNumber" @keyup="phoneNumberCheck">
                        </p>
                        <p>
                          <input type="text" placeholder="" :maxlength="contact2Length" required="" v-model="showContact2" ref="contact2" @keypress="onlyNumber" @keyup="phoneNumberCheck" @keydown="validateNumber" @blur="validateNumber">
                        </p>
                        <p>
                          <input type="text" placeholder="" maxlength="4" required="" v-model="showContact3" ref="contact3" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                        </p>
                      </div>
                    </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt><span>ご希望のお届け日</span></dt>
                    <dd>
                      <input type="text" :value="deliveryWishYmdt" disabled="true">
                      <div class="wish_date">
                        <p>- 選択しない場合、商品のご用意が出来次第発送いたします。</p>
                      </div>
                    </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt><span>ご希望のお届け時間帯</span></dt>
                    <dd>
                      <input type="text" :value="deliveryTimeText" disabled="true">
                    </dd>
                  </dl>
                </li>
                <li>
                  <dl>
                    <dt class="order_font_weight">配送コメント</dt>
                    <dd>
                      <div class="select_normal">
                        <select v-model="editAddress.deliveryMemo">
                          <option value="">なし</option>
                          <option value="不在時は宅配BOX希望">不在時は宅配BOX希望</option>
                        </select>
                      </div>
                    </dd>
                  </dl>
                </li>
                <li>
                  <ul class="product_active">
                    <li><button class="btn" @click.prevent="goBack">キャンセル</button></li>
                    <li><button class="btn btn_green" @click.prevent="setAddress">変更</button></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from '@/utils/VueClickOutside.js'
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
      contact1: this.address ? telnoFormat(this.address.receiverContact1)[0] : '',
      contact2: this.address ? telnoFormat(this.address.receiverContact1)[1] : '',
      contact3: this.address ? telnoFormat(this.address.receiverContact1)[2] : '',
      contact1Length: 5,
      contact2Length: 4
    }
  },
  computed: {
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
    goBack () {
      this.$router.go(-1)
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
      } else {
        let addressRequest = {
          deliveryMemo: this.editAddress.deliveryMemo,
          receiverContact1: `${this.contact1}-${this.contact2}-${this.contact3}`,
          receiverName: this.editAddress.receiverName
        }
        this.$store.dispatch('myorder/editDeliveries', { orderNo: this.$route.params.orderNo, data: addressRequest }).then(res => {
          this.goBack()
        })
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
  directives: {
    ClickOutside
  }
}
</script>
