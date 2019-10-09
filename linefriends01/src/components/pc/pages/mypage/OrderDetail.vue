<template>
  <div>
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <main-title title="마이페이지" />
        <status
          :name="userName"
          :mypageStatus="mypageStatus"
          :executives="executives"
        />
        <menu-wrap mode="order" />
        <order-detail-header />
        <table-list
          title="주문배송 조회"
          :orders="orders"
          mode="detail"
        />
        <pay-info
          :orderDetails="orderDetails"
        />
        <table-list-horizontal
          title="구매자 정보"
          :data="buyerInfo"
        />
        <table-list-horizontal
          title="배송지 정보"
          :data="deliveryInfo"
        />
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import MainWrapper from '../../layout/common/MainWrapper'
import BreadCrumbs from '../../layout/common/BreadCrumbs'
import MenuWrap from '../../mypage/MenuWrap'
import MainTitle from '../../mypage/MainTitle'
import Status from '../../mypage/Status'
import TableList from '../../mypage/TableList'
import OrderDetailHeader from '../../mypage/OrderDetailHeader'
import PayInfo from '../../mypage/PayInfo'
import TableListHorizontal from '../../mypage/TableListHorizontal'

export default {
  name: 'OrderDetail',
  components: {
    LayoutWidth,
    MainWrapper,
    BreadCrumbs,
    MenuWrap,
    MainTitle,
    Status,
    TableList,
    OrderDetailHeader,
    PayInfo,
    TableListHorizontal
  },
  data () {
    return {
      userName: '테스트',
      basicCrumbs: '주문배송조회',
      executives: true,
      mypageStatus: [
        {
          idx: 0,
          title: '배송중',
          icon: 'delivery',
          images: 'images/pc/icons/ic-delivery34x23.svg',
          value: 0
        },
        {
          idx: 1,
          title: '쿠폰',
          icon: 'coupon',
          iamges: 'images/pc/icons/ic-coupon24x24.svg',
          value: 0
        },
        {
          idx: 2,
          title: '상품평',
          icon: 'review',
          images: 'images/pc/icons/ic-review27x27.svg',
          value: 1
        },
        {
          idx: 3,
          title: '찜한 상품',
          icon: 'wish',
          images: 'images/pc/icons/ic-wish26x23.svg',
          value: 12
        }
      ],
      orders: [
        {
          idx: 0,
          ordDate: '2019-03-25',
          ordNo: '201903251348206125',
          images: '',
          ordTitle: 'BT21 TATA 얼굴 방석',
          ordCnt: '1',
          ordPrice: '7,000',
          ordStatus: '결제완료',
          ordSize: 'S'
        }
      ],
      orderDetails: {
        idx: 0,
        price: 32500,
        deliveryPrice: 2500,
        couponPrice: 7000,
        payMoment: '신용카드',
        payInfo: '???? 12345**********/일시불'
      },
      buyerInfo: {
        idx: 0,
        mode: 'buyer',
        name: '백계훈',
        phone: '010-5484-8257',
        email: 'gh.back@dnd-lab.com'
      },
      deliveryInfo: {
        idx: 0,
        mode: 'delivery',
        name: '백계훈',
        phone: '010-5484-8257',
        address: '경기도 시흥시 옥구천동로 404 (월드아파트 113동 603호)',
        memo: '부재시 현관문 앞에 놔주세요.'
      }
    }
  }
}
</script>
