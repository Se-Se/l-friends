<ul class="item_best">
          <li
            v-for="(product,index) in likeProducts"
            :key="index"
            class="goods-item"
          >
            <router-link :to="`/goods/detail/${product.productNo}`">
                <!-- [D] 품절상품 유형 : .bx_img에 .ico_soldout 클래스 추가 -->
                <article v-if="product.stockCnt === 0||(product.saleStatusType !== 'READY'&&product.saleStatusType !=='ONSALE')">
                  <span class="bx_img" :class="{itemcard_type: product.stockCnt !== 0, ico_soldout: product.stockCnt === 0}">
                    <img :src="product.imageUrls[0]">
                    <span class="bx_input check2 checkBoxPlace" style="margin-left: 20px;">
                      <input type="checkbox" :id="`item_${product.productNo}`" checked="" :value="product.productNo" v-model="selectedNos" @click="changeAllSelector">
                      <label :for="`item_${product.productNo}`">
                        <span></span>
                      </label>
                    </span>
                    <i class="ico_noSale" v-if="product.stockCnt !== 0"></i>
                  </span>
                </article>
                <article v-else-if="product.saleStatusType === 'READY'">
                  <span class="bx_img">
                    <router-link :to="`/goods/detail/${product.productNo}`">
                      <img :src="product.imageUrls[0]">
                      <i class="ico_beSold"></i>
                    </router-link>
                    <span class="bx_input check2 checkBoxPlace" style="margin-left: 20px;">
                      <!-- <input type="checkbox" :id="`item_${product.productNo}`" checked="" :value="product.productNo" v-model="selectedNos" @click="changeAllSelector">
                      <label :for="`item_${product.productNo}`">
                        <span></span>
                      </label> -->
                      <input
                        :id="`item_${product.productNo}`"
                        :value="product.productNo"
                        v-model="selectedNos"
                        @click="changeAllSelector"
                        type="checkbox"
                        class="switch-input"
                      >
                        <label :for="`item_${product.productNo}`">
                          <span
                            class="switch-label__action checkbox"
                          ></span>
                          <p
                            :class="{
                              'switch-label__title': true
                            }"
                          >
                            
                          </p>
                        </label>
                    </span>
                  </span>
                </article>
                <article v-else>
                  <figure class="goods-item__fig">
                    <img :src="product.imageUrls[0]" alt="">
                  </figure>
                  <span class="bx_img">
                    <router-link :to="`/goods/detail/${product.productNo}`">
                      <img :src="product.imageUrls[0]" alt="">
                    </router-link>
                    <span class="bx_input check2 checkBoxPlace" style="margin-left: 20px;">
                      <!-- <input type="checkbox" :id="`item_${product.productNo}`" checked="" :value="product.productNo" v-model="selectedNos" @click="changeAllSelector">
                      <label :for="`item_${product.productNo}`">
                        <span></span>
                      </label> -->
                      <input
                        :id="`item_${product.productNo}`"
                        :value="product.productNo"
                        v-model="selectedNos"
                        @click="changeAllSelector"
                        type="checkbox"
                        class="switch-input"
                      >
                        <label :for="`item_${product.productNo}`">
                          <span
                            class="switch-label__action checkbox"
                          ></span>
                          <p
                            :class="{
                              'switch-label__title': true
                            }"
                          >
                            
                          </p>
                        </label>
                    </span>
                  </span>
                </article>
                <div class="goods-item--info">
                  <template v-if="product.stockCnt === 0||(product.saleStatusType !== 'READY'&&product.saleStatusType !=='ONSALE')">
                    <!-- <router-link :to="`/brand/${ product.brandNo }`" v-if="product.brandName"><span class="brand">{{product.brandName}}</span></router-link> -->
                    <h2 class="goods-item--info__name">{{product.productName | wordsFormat(45)}}</h2>
                  </template>
                  <template v-else>
                    <router-link :to="`/goods/detail/${product.productNo}`">
                      <!-- <router-link :to="`/brand/${ product.brandNo }`" v-if="product.brandName"><span class="brand">{{product.brandName}}</span></router-link> -->
                      <p>{{ product.promotionText }}</p>
                      <h2 class="goods-item--info__name">{{product.productName | wordsFormat(45)}}</h2>
                    </router-link>
                  </template>
                  <template v-if="product.stockCnt === 0">
                    <!-- <div class="tit">
                      <p>
                        <strong>구매불가</strong>이 상품은 상품정보 변경 또는 재고소진으로 주문이 불가합니다.</p>
                    </div> -->
                  </template>
                  <template v-else-if="product.saleStatusType === 'READY'">
                    <div class="tit">
                      <p>
                        {{product.saleStartYmdt}} 오픈예정</p>
                    </div>
                  </template>
                  <template v-else-if="product.saleStatusType !=='ONSALE'">
                    <!-- <div class="tit">
                      <p>
                        <strong>구매불가</strong>이 상품은 상품정보 변경 또는 재고소진으로 주문이 불가합니다.</p>
                    </div> -->
                  </template>
                  <template v-else>
                    <span class="goods-item--info__price-wrap">
                      <strong class="sale" v-if="priceCalculate(product).discountRate !== 0">{{ priceCalculate(product).discountRate }}%
                      </strong>
                      <strong class="number">{{ priceFormat(priceCalculate(product).finalSalePrice) }}<span class="txt">원</span></strong>
                    </span>
                    <div class="bx_tag">
                      <template v-for="sticker in getIconSticker(product)">
                        <span
                          class="ico_tag"
                          :class="{blue: sticker === '무료배송', red: sticker === '쿠폰'}"
                        >{{ sticker }}</span>
                      </template>
                      <template v-if="product.saleCnt >= 10">
                        <span class="buy_num">
                          <em>{{product.saleCnt | formatNumber}}</em>
                          <span>개 구매중</span>
                        </span>
                      </template>
                    </div>
                  </template>
                </div>
              </article>
            </router-link>
          </li>
      </ul>