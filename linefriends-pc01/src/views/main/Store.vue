<template>

  <!-- ↓↓↓↓↓ wrapper-pc ↓↓↓↓↓ -->
  <div class="wrapper-pc">

    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="store">

      <!-- store detial -->
      <div class="wrap">

        <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
        <bread-crumbs breadCrumbs="店舗情報"/>
        <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

        <!-- ↓↓↓↓↓ store-content ↓↓↓↓↓ -->
        <div class="store-content">
          <h1>店舗案内</h1>
          <div class="banner_area">
            <div class="top_bnr swiperCon">
              <slick :options="SlickOptions">
                <div class="bnr_img">
                  <a href="#">
                    <img src="@/assets/img/temp/banner_top_1.jpg" alt="">
                  </a>
                </div>
                <div class="bnr_img">
                  <a href="#">
                    <img src="@/assets/img/temp/banner_top_1.jpg" alt="">
                  </a>
                </div>
              </slick>
            </div>
          </div>

          <!-- ↓↓↓↓↓ menu_wrap ↓↓↓↓↓ -->
          <div class="menu_wrap">
            <ul class="nav_menu">
              <li class="active">
                <a href="#">全体</a>
              </li>
              <li>
                <a href="#">韓国</a>
              </li>
              <li>
                <a href="#">中国</a>
              </li>
              <li>
                <a href="#">日本</a>
              </li>
              <li>
                <a href="#">台湾</a>
              </li>
              <li>
                <a href="#">香港</a>
              </li>
              <li>
                <a href="#">タイ</a>
              </li>
              <li>
                <a href="#">アメリカ</a>
              </li>
            </ul>

          </div>
          <!-- ↑↑↑↑↑ menu_wrap ↑↑↑↑↑ -->

          <!-- ↓↓↓↓↓ box_area ↓↓↓↓↓ -->
          <div class="box_area">

            <!-- ↓↓↓↓↓ store-number ↓↓↓↓↓ -->
            <dl class="store-number">
              <dt>韓国</dt>
            </dl>
            <!-- ↑↑↑↑↑ store-number ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>Flagship store 梨泰院(イテウォン)店</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">ソウル特別市 龍山区 梨泰院路 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점플래그십 스토어 이태원점플래그십 스토어</h2>
              <ul class="box">
                <li>
                  <!-- <img src="@/assets/img/store/store.png" alt=""> -->
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로서울특별시 용산구 이서울특별시 용산구 이태원로</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
              <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->
            </div>

          </div>
          <!-- ↑↑↑↑↑ box_area ↑↑↑↑↑ -->

          <!-- ↓↓↓↓↓ box_area ↓↓↓↓↓ -->
          <div class="box_area">

            <!-- ↓↓↓↓↓ store-number ↓↓↓↓↓ -->
            <dl class="store-number1">
              <dd>중국</dd>
            </dl>

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↑↑↑↑↑ store-number ↑↑↑↑↑ -->
          </div>
          <!-- ↑↑↑↑↑ box_area ↑↑↑↑↑ -->

          <!-- ↓↓↓↓↓ box_area ↓↓↓↓↓ -->
          <div class="box_area">

            <dl class="store-number1">
              <dd>일본</dd>
            </dl>

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점플래그십 스토어 이태원점플래그십 스토어</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로서울특별시 용산구 이서울특별시 용산구 이태원로</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
            </div>
            <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            <!-- ↓↓↓↓↓ filter ↓↓↓↓↓ -->
            <div class="filter">
              <h2>플래그십 스토어 이태원점</h2>
              <ul class="box">
                <li>
                  <a href="" class="store">STORE&CAFE</a>
                </li>
                <li>
                  <a href="" class="place">서울특별시 용산구 이태원로 200</a>
                  <a href="" class="a_blue">地図で見る</a>
                </li>
                <li>
                  <a href="" class="call">02-790-0901</a>
                </li>
                <li>
                  <a href="" class="time">毎日 11AM-11PM</a>
                </li>
              </ul>
              <!-- ↑↑↑↑↑ filter ↑↑↑↑↑ -->

            </div>
          </div>
          <!-- ↑↑↑↑↑ box_area ↑↑↑↑↑ -->

        </div>
        <!-- ↑↑↑↑↑ store-content ↑↑↑↑↑ -->
      </div>
      <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->

  </div>
  <!-- ↑↑↑↑↑ wrapper-pc ↑↑↑↑↑ -->
</template>
<script>
import Slick from 'vue-slick'
import BreadCrumbs from '@/components/common/BreadCrumbs'
export default {
  name: 'Store',
  components: {
    Slick,
    BreadCrumbs
  },
  data () {
    return {
      SlickOptions: {
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: false, // 垂直方向
        autoplay: true,
        dots: true,
        arrows: false,
        infinite: false,
        fade: false
      }
    }
  }
}
</script>
