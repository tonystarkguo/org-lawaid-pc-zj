import { getDataService, postDataService } from '../../services/commonService'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../../utils'
import { parse } from 'qs'

const { api } = config

export default {
	namespace: 'adviceSort',
	state: {
		currentItem: {},
		modalVisible: false,
    modalType: 'create',
    beSign: {
      list: [],
      pagination:{
        showSizeChanger: true,
        showQuickJumber: true,
        showTotal: total => `共${total} 条`,
        current: 1,
        total: null
      },
    },
    beReply: {
      list: [],
      pagination:{
        showSizeChanger: true,
        showQuickJumber: true,
        showTotal: total => `共${total} 条`,
        current: 1,
        total: null
      },
    },
    searchKeys: {
      name: {value: ''},
      mobile: {value: ''},
      consultNumber: {value: ''},
    },//列表表头搜索关键字列表
	},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/adviceSort') {
          const searchInfo = localStorage.getItem(`searchInfo${window.location.pathname}`) && JSON.parse(localStorage.getItem(`searchInfo${window.location.pathname}`))
          if (location.action === 'POP' && searchInfo) {
            dispatch({ type: 'initPage', payload: searchInfo })
            dispatch({
              type: 'beSignQuery',
              payload: { dicConsultStatus: 'beSign', dicConsultSource: 'online', searchInfo },
            })
          } else {
            dispatch({ type: 'initPage' })
            localStorage.removeItem(`searchInfo${window.location.pathname}`)
            dispatch({
              type: 'beSignQuery',
              payload: { dicConsultStatus: 'beSign', dicConsultSource: 'online' },
            })
          }
          dispatch({
            type: 'beReplyQuery',
            payload: {
              dicConsultStatus: 'myBeReply',
              dicConsultSource: 'online',
            }
          })
        }
      })
    }
  },
  effects: {
    * beSignQuery ({ payload }, { select, call, put }) {
      let searchKeys = yield select(({ adviceSort }) => adviceSort.searchKeys)
      if (payload.searchInfo) {
        searchKeys = payload.searchInfo
      }
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum)
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize)
      reqParams.dicConsultStatus = payload.dicConsultStatus
      reqParams.dicConsultSource = payload.dicConsultSource
      reqParams.serviceId = 'srvid_getConsultListUrl'

      const res = yield call(getDataService, {url: api.getConsultListUrl}, {...reqParams, ...criterias})
      if (res.success) {
        if (!payload.searchInfo) {
          localStorage.setItem(`searchInfo${window.location.pathname}`, JSON.stringify(searchKeys))
        }
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          if(newItem.sign.dicStatus == '1'){
            newItem.status = '待签收'
          }
          newItem.seq = startSeq++
          return newItem
        })

        yield put({
          type: 'beSignQuerySuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
              showTotal: total => `共${total} 条`,
            }
          }
        })
      }
    },

    * beReplyQuery ({ payload }, { call, put }) {
      const res = yield call(getDataService, {url:api.getConsultListUrl}, {...payload, serviceId: 'srvid_getConsultListUrl'})
      if (res.success) {
        let tGlobalId = JSON.parse(localStorage.getItem('user')).tGlobalId
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          if(newItem.sign.dicStatus == '1'){
            newItem.status = '待签收'
          }else if(newItem.sign.dicStatus == '2' && newItem.isSubmit == false && newItem.sign.signGlobalId == tGlobalId){
            newItem.status = '待回复'
          }else if(newItem.sign.dicStatus == '2' && newItem.isSubmit == true && newItem.sign.signGlobalId == tGlobalId){
            newItem.status = '已回复'
          }else if(newItem.sign.dicStatus == '2' && newItem.isSubmit == false && newItem.sign.signGlobalId != tGlobalId){
            newItem.status = '待回复'
          }else if(newItem.sign.dicStatus == '2' && newItem.isSubmit == true && newItem.sign.signGlobalId != tGlobalId){
            newItem.status = '已回复'
          }
          newItem.seq = startSeq++
          return newItem
        })

        yield put({
          type: 'beReplyQuerySuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total,
              showTotal: total => `共${total} 条`,
            }
          }
        })
      }
    },

    * sign({ payload }, { call, put }) {
      let params = {
        id: payload.item.id
      }
      const res = yield call(postDataService, { url:api.signForConsultUrl }, { ...params, serviceId: 'srvid_signForConsultUrl'})
      if (res.success) {
        yield put({ 
          type: 'beSignQuery', 
          payload: {
            dicConsultStatus:'beSign',
            dicConsultSource: 'online',
          } 
        })
        yield put({ 
          type: 'beReplyQuery', 
          payload: {
            dicConsultStatus:'myBeReply',
            dicConsultSource: 'online',
          } 
        })
      } else {
        throw res
      }
    },

    * back({ payload }, { call, put }) {
      let params = {
        id: payload.item.sign.id,
        tConsultId: payload.item.id
      }
      const res = yield call(postDataService, { url:api.chargebackUrl }, { ...params, serviceId: 'srvid_chargebackUrl'})
      if (res.success) {
        yield put({ 
          type: 'beSignQuery', 
          payload: {
            dicConsultStatus:'beSign',
            dicConsultSource: 'online',
          }
        })
        yield put({ 
          type: 'beReplyQuery', 
          payload: {
            dicConsultStatus:'myBeReply',
            dicConsultSource: 'online',
          } 
        })
      } else {
        throw res
      }
    },

  },
	reducers: {
    initPage(state, action) {
      if (action.payload) {
        return {...state, searchKeys: action.payload}
      }
      return {
        ...state, 
        searchKeys: {
          name: {value: ''},
          mobile: {value: ''},
          consultNumber: {value: ''},
        }
      }
    },

		beSignQuerySuccess (state, action){
      const { list, pagination } = action.payload
      return {
        ...state,
        beSign: {
          list,
          pagination: {
            ...state.pagination,
            ...pagination
          }
        }
      }
    },

    beReplyQuerySuccess (state, action){
      const { list, pagination } = action.payload
      return {
        ...state,
        beReply: {
          list,
          pagination: {
            ...state.pagination,
            ...pagination
          }
        }
      }
    },

    updateFilterFields (state, action){
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
	}
}