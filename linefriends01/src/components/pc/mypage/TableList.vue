<template>
  <section>
    <div
      :class="{ 'table-list' : true, 'table-list__padding' : mode !== 'list' }"
    >
      <div
        class="table-list--header"
      >
        <h2
          class="table-list--header__title"
        >
          {{ title }}
        </h2>
        <ul
          v-if="mode === 'list'"
          class="table-list--header__list"
        >
          <li
            class="table-list--header__item active"
          >
            <a href="#">{{ $t('months.one') }}</a>
          </li>
          <li
            class="table-list--header__item"
          >
            <a href="#">{{ $t('months.three') }}</a>
          </li>
          <li
            class="table-list--header__item"
          >
            <a href="#">{{ $t('months.six') }}</a>
          </li>
          <li
            class="table-list--header__item"
          >
            <a href="#">{{ $t('months.all') }}</a>
          </li>
        </ul>
      </div>
      <table
        class="table"
      >
        <colgroup>
          <col
            v-if="mode === 'list'"
            style="width:20%"
          >
          <col style="width:30%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
          <col style="width:10%">
        </colgroup>
        <thead>
          <tr>
            <th v-if="mode === 'list'">{{ $t('orderInfo.title') }}</th>
            <th>{{ $t('orderInfo.goodsInfo') }}</th>
            <th>{{ $t('orderInfo.cnt') }}</th>
            <th>{{ $t('orderInfo.goodsPrice') }}</th>
            <th>{{ $t('orderInfo.status') }}</th>
            <th>{{ $t('orderInfo.management') }}</th>
          </tr>
        </thead>
        <tbody v-if="orders.lengths !== 0">
          <tr
            v-for="( order, key ) in orders"
            :key="key"
          >
            <td v-if="mode === 'list'">
              <div
                class="table-item"
              >
                <p
                  class="table-item__date"
                >
                  {{ order.orderYmdt.substring(0,10) }}
                </p>
                <p
                  class="table-item__ordno"
                >
                  {{ $t('order.number')}} : {{ order.orderNo }}
                </p>
                <a
                  href="#"
                  class="table-item__action"
                >{{ $t('order.detailOrder') }}</a>
              </div>
            </td>
            <td>
              <div
                v-for="item in order.orderOptions"
                class="table-item table-item__left"
              >
                <figure
                  class="table__fig"
                >
                  <img :src="item.imageUrl">
                </figure>
                <div
                  class="table--info"
                >
                  <h2
                    class="table--info__title"
                  >
                    {{ item.optionName }}
                  </h2>
                  <span
                    v-if="mode === 'detail'"
                    class="table--info__value"
                  >
                    {{ $t('orderInfo.size') }} : {{ item.optionTitle }} /
                  </span>
                  <span
                    class="table--info__value"
                  >
                    {{ $t('orderInfo.buyCnt') }} : {{ item.orderCnt }}
                  </span>
                </div>
              </div>
            </td>
            <td>
              <p>
                {{ item.ordCnt }}{{ $t('orderInfo.unit') }}
              </p>
            </td>
            <td>
              <p>
                {{ item.ordPrice }}{{ $t('orderInfo.currency') }}
              </p>
            </td>
            <td>
              <h2
                class="table__status"
              >
                {{ order.ordStatus }}
              </h2>
            </td>
            <td v-if="mode === 'list'">
              <white-button :data="form.orderCancel" />
              <white-button
                :data="form.contactUs"
                event="goodsReview"
                @childs-event="layerViews"
              />
            </td>
            <td v-if="mode === 'detail'">
              <white-button :data="form.delivery" />
              <white-button
                :data="form.review"
                event="goodsReview"
                @childs-event="layerViews"
              />
              <white-button :data="form.return" />
              <white-button :data="form.contact" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6">
              <div
                class="table-nodata"
              >
                <figure
                  class="table-nodata__fig"
                >
                  <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                </figure>
                <div
                  class="table-nodata--info"
                >
                  <h2
                    class="table-nodata--info__title"
                  >
                    {{ $t('orderInfo.noOrderDelivery1') }}<br>
                    {{ $t('orderInfo.noOrderDelivery2') }}
                  </h2>
                  <router-link
                    to="/goods"
                    class="table-nodata--info__action"
                  >{{ $t('orderInfo.allGoodsView') }}</router-link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="mode === 'list'"
        class="table-list__prev"
      >
        <a
          href="#"
        >{{ $t('orderInfo.prevOrderListView') }}</a>
      </div>
      <div
        v-if="mode === 'list'"
        class="table-list__pagination"
      >
        <pagination />
      </div>
    </div>
    <div>
      <layer-popup
        :visible="layerPopupStatus === 'goodsReview'"
        :description="reviewDescription"
        title="상품평 작성"
        type="review"
        @close="layerPopupStatus = null"
      >
        <tr>
          <th>{{ $t('orderInfo.satisfaction') }}</th>
          <td>
            <star-rating />
          </td>
        </tr>
        <tr>
          <th>{{ $t('user.review') }}</th>
          <td
            :class="{
              active : textArea === true
            }"
            @click="textAreaChk"
          >
            <textarea class="review" />
          </td>
        </tr>
        <tr>
          <th>{{ $t('orderInfo.attach') }}</th>
          <td>
            <div>
              <file-item :files="files" />
              <information-title info="사진은 최대 10장까지 등록 가능합니다." />
            </div>
          </td>
        </tr>
      </layer-popup>
    </div>
  </section>
</template>
<script>
import Vue from 'vue'
import LayerPopup from '../layout/common/LayerPopup'
import StarRating from '../layout/common/StarRating'
import FileItem from '../layout/common/FileItem'
import InformationTitle from '../layout/common/InformationTitle'
import Pagination from '../assets/Pagination'
import WhiteButton from '../assets/buttons/WhiteButton'
export default {
  name: 'TableList',
  components: {
    LayerPopup,
    StarRating,
    FileItem,
    InformationTitle,
    Pagination,
    WhiteButton
  },
  props: {
    orders: {
      type: Array,
      required: false
    },
    mode: {
      type: String,
      default: 'list'
    },
    title: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      eventBus: new Vue(),
      visible: false,
      textArea: true,
      reviewPop: false,
      reviewDescription: '상품평 작성을 완료하시면 구매확정으로 처리됩니다.',
      layerPopupStatus: null,
      files: {
        choiceText: '파일선택',
        data: 'file'
      },
      form: {
        orderCancel: {
          action: 'button',
          to: '',
          title: '주문취소',
          type: 'short',
          list: 'horizontal'
        },
        contactUs: {
          action: 'button',
          to: '',
          title: '문의하기',
          type: 'short',
          list: 'horizontal'
        },
        delivery: {
          action: 'button',
          to: '',
          title: '배송조회',
          type: 'short',
          list: 'horizontal'
        },
        review: {
          action: 'button',
          to: '',
          title: '상품평작성',
          type: 'short',
          list: 'horizontal'
        },
        return: {
          action: 'button',
          to: '',
          title: '반품신청',
          type: 'short',
          list: 'horizontal'
        },
        contact: {
          action: 'button',
          to: '',
          title: '문의하기',
          type: 'short',
          list: 'horizontal'
        }
      }
    }
  },
  methods: {
    layerPopupHandle () {
      this.visible = !this.visible
    },
    textAreaChk () {
      this.textArea = false
    },
    reviewPopAction () {
      this.eventBus.$emit('openPopup')
    },
    layerViews (event) {
      this.layerPopupStatus = event
    }
  }
}
</script>