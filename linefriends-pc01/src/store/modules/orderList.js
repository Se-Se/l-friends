import { createNcpApiStore } from '@/api'
import qs from 'qs'
import { getToday, addMonth } from '@/utils/dateUtils'

const defaultParams = {
  'orderRequestTypes': null,
  'pageNumber': 1,
  'pageSize': 5,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: 'fetchList',
    property: 'list',
    path: 'profile/orders',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    onSuccess (state, response) {
      state.list = response.data.items
      state.totalCount = response.data.totalCount
    }
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    queryType: '',
    fetchListParams: {},
    list: null,
    totalCount: null,
    getNew: false
  },
  actions: {
    async getOrderList ({ state, commit, dispatch }, { type, to }) {
      commit('RESET_PARAMS')
      let tempParams = {
        startYmd: addMonth(new Date(), -1),
        endYmd: getToday()
      }

      if (type === 'ORDER') {
        tempParams.orderRequestTypes = [
          'DEPOSIT_WAIT',
          'PAY_DONE',
          'PRODUCT_PREPARE',
          'DELIVERY_PREPARE',
          'DELIVERY_ING',
          'DELIVERY_DONE',
          'BUY_CONFIRM'
        ]
      } else if (type === 'CANCEL') {
        tempParams.orderRequestTypes = [
          'CANCEL_DONE',
          'RETURN_DONE',
          'EXCHANGE_DONE',
          'CANCEL_PROCESSING',
          'RETURN_PROCESSING',
          'EXCHANGE_PROCESSING'
        ]
      }
      state.queryType = type

      if (to && to.query) {
        let param = to.query

        if (param.startYmd) {
          tempParams.startYmd = param.startYmd
        }
        if (param.endYmd) {
          tempParams.endYmd = param.endYmd
        }
        if (param.pageNumber) {
          tempParams.pageNumber = Number(param.pageNumber)
        } else {
          tempParams.pageNumber = 1
        }
      }
      commit('SET_PARAMS', tempParams)

      let isShowBk = false
      let oldParams = null
      oldParams = history.state && history.state.listState && history.state.listState.params
      if (oldParams) {
        if (JSON.stringify(oldParams.orderRequestTypes) === JSON.stringify(tempParams.orderRequestTypes) && oldParams.startYmd === tempParams.startYmd && oldParams.endYmd === tempParams.endYmd && Number(oldParams.pageNumber) === Number(tempParams.pageNumber)) {
          isShowBk = true
        }
      }
      if (!isShowBk || state.getNew) {
        commit('CLEAR_LIST')
        await dispatch('fetchList', { params: state.fetchListParams })
        let tempState = JSON.parse(JSON.stringify(history.state))
        let listState = {
          params: state.fetchListParams,
          list: state.list,
          totalCount: state.totalCount
        }
        tempState.listState = listState
        history.replaceState(tempState, null, document.URL)
      } else {
        state.list = history.state.listState.list
        state.totalCount = history.state.listState.totalCount
        state.fetchListParams = history.state.listState.params
      }
      state.getNew = false
    }
  },
  mutations: {
    GET_NEW (state) {
      state.getNew = true
    },
    CLEAR_LIST (state) {
      state.list = null
      state.totalCount = null
    },
    RESET_PARAMS (state) {
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    }
  }
}
