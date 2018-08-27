import { getDataService, postDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'

const { api } = config

export default {
  namespace: 'granSubsidies',
  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    okText: '提交发放',
    pagination: {
      showSizeChanger: true,
      showQuickJumber: true,
      showTotal: total => `共${total} 条`,
      current: 1,
      total: null
    },
    exportList: [],
    standardBack: 0,
    subsidyFeeBack: 0,
    interpretationFeeBack: 0,
    otherFeeBack: 0,
    lessFeeBack: 0,
    searchKeys: {
      hpWorkUnit: {value: ''},
      hpName: {value: ''},
      settleState: {value: ''},
      createTime: {value: ''},
    },//列表表头搜索关键字列表
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/granSubsidies') {
          dispatch({type: 'initPage'})
          dispatch({ type: 'query', payload: { ...location.query } })
        }
      })
    }
  },
  effects: {
    * query ({ payload }, { select, call, put }) {
      const searchKeys = yield select(({ granSubsidies }) => granSubsidies.searchKeys)
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })
      if(criterias.createTime && criterias.createTime.length){
        criterias.beginTime = criterias.createTime[0].format('YYYY-MM-DD')
        criterias.endTime = criterias.createTime[1].format('YYYY-MM-DD')
        delete criterias.createTime
      }

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 10
      reqParams.serviceId = 'srvid_getCaseSettleUrl'

      const res = yield call(getDataService, {url: api.getCaseSettleUrl}, {...reqParams, ...criterias})

      if (res.success) {
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          newItem.seq = startSeq++
          return newItem
        })

        yield put({
          type: 'querySuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: res.data.total
            }
          }
        })
      }
    },

    * open ({ payload }, { call, put }) {
      const res = yield call(postDataService, {url: api.openCaseSettleUrl }, { ...payload, serviceId: 'srvid_openCaseSettleUrl'})
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ 
          type: 'query', 
          payload: {
            pageNum: 1,
            pageSize: 10,
          } 
        })
      }else{
        throw res
      }
    },
    * edit ({ payload }, { call, put }) {
    const res = yield call(postDataService, {url: api.editCaseSettleUrl }, { ...payload, serviceId: 'srvid_editCaseSettleUrl'})
    if (res.success) {
      yield put({ type: 'hideModal' })
      yield put({ 
        type: 'query', 
        payload: {
          pageNum: 1,
          pageSize: 10,
        } 
      })
    }else{
      throw res
    }
  },
    * export ({ payload }, { call, put }) {
      console.log(payload)
      const res = yield call(postDataService, {url: api.exportSubsidyRelease }, payload)
      if (res.success) {
        yield put({ 
          type: 'query', 
          payload: {
            pageNum: 1,
            pageSize: 10,
          } 
        })
      }else{
        throw res
      }
    },

  },
  reducers: {
    initPage(state, action) {
      return {
        ...state, 
        searchKeys: {
          hpWorkUnit: {value: ''},
          hpName: {value: ''},
          settleState: {value: ''},
          createTime: {value: ''},
        },
        exportList: [],
      }
    },
    querySuccess (state, action){
      const { list, pagination, dicConsultStatus } = action.payload
      return {
        ...state,
        list,
        dicConsultStatus,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    showModal (state, action){
      return {...state, ...action.payload, modalVisible: true, okText: '提交发放'}
    },
    showEditModal (state, action){
      return {...state, ...action.payload, modalVisible: true, okText: '提交修改',standardBack: action.payload.currentItem.standard,
      subsidyFeeBack:action.payload.currentItem.subsidyFee,
      interpretationFeeBack: action.payload.currentItem.interpretationFee,
      otherFeeBack: action.payload.currentItem.otherFee,
      lessFeeBack: action.payload.currentItem.lessFee,}
      },
    hideModal (state, action){
      return {
        ...state, 
        modalVisible: false,
        // standardBack: 0,
        // subsidyFeeBack: 0,
        // interpretationFeeBack: 0,
        // otherFeeBack: 0,
        // lessFeeBack: 0,
      }
    },
    setExportList(state, action){
      return {...state, exportList: action.payload}
    },
    setStandard(state, action){
      return {...state, standardBack: action.payload}
    },
    setSubsidyFee(state, action){
      return {...state, subsidyFeeBack: action.payload}
    },
    setInterpretationFee(state, action){
      return {...state, interpretationFeeBack: action.payload}
    },
    setOtherFee(state, action){
      return {...state, otherFeeBack: action.payload}
    },
    setLessFee(state, action){
      return {...state, lessFeeBack: action.payload}
    },
    updateFilterFields (state, action){
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
  }
}