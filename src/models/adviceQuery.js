// import { query, create, update } from '../services/adviceQuery'
import { getDataService, postDataService } from '../services/commonService'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'
import moment from 'moment'

const { api } = config

export default {
	namespace: 'adviceQuery',
	state: {
		list: [],
		currentItem: {},
		modalVisible: false,
    modalType: 'create',
		pagination:{
			showSizeChanger: true,
			showQuickJumber: true,
			showTotal: total => `共${total} 条`,
			current: 1,
			total: null
		},
    searchKeys: {
      name: {value: ''},
      mobile: {value: ''},
      dicConsultSource: {value: ''},
      dicConsultTreatmentMode: {value: ''},
      answerGlobalName: {value: ''},
      createTime: {value: []},
      dicGender: {value: ''},
      dicConsultStatus: {value: ''},
      areaId: {value: ''},
    },//列表表头搜索关键字列表
	},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/adviceQuery') {
          dispatch({type: 'getAllCity'})
          const searchInfo = localStorage.getItem(`searchInfo${window.location.pathname}`) && JSON.parse(localStorage.getItem(`searchInfo${window.location.pathname}`))
          if (location.action === 'POP' && searchInfo) {
            dispatch({ type: 'initPage', payload: searchInfo })
            dispatch({ type: 'query', payload: { ...location.query, searchInfo } })
          } else {
            localStorage.removeItem(`searchInfo${window.location.pathname}`)
            dispatch({ type: 'initPage' })
            dispatch({ type: 'query', payload: { ...location.query } })            
          }
        }
      })
    }
  },
  effects: {
    * getAllCity({ payload }, { call, put }) {
    const res = yield call(getDataService, { url:api.getAllCity }, {caseSort: 0})
    if (res.success) {
      yield put({ type: 'setAllCity', payload: res.data})
    } else {
      throw res
    }
  },
    * query ({ payload = {} }, { select, call, put }) {
      let searchKeys = yield select(({ adviceQuery }) => adviceQuery.searchKeys)
      if (payload.searchInfo) {
        searchKeys = payload.searchInfo
      }
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })
      if(criterias.areaId && criterias.areaId.length){
        if(criterias.areaId.length == 1){
          criterias.areaId = criterias.areaId[0].toString()
        }else{
          criterias.subAreaId = criterias.areaId[1].toString()
         criterias.areaId = criterias.areaId[0].toString()
        }
      }

      if(criterias.createTime && criterias.createTime.length){
        criterias.consultStartTime = moment(criterias.createTime[0]).format('YYYY-MM-DD')
        criterias.consultEndTime = moment(criterias.createTime[1]).format('YYYY-MM-DD')
        delete criterias.createTime
      }

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 10
      // reqParams.areaId = 'ownCore'
      reqParams.serviceId = 'srvid_getConsultListUrl'
			
      const res = yield call(getDataService, {url: api.getConsultListUrl}, {...reqParams, ...criterias})

      if (res.success) {
        if (!payload.searchInfo) {
          localStorage.setItem(`searchInfo${window.location.pathname}`, JSON.stringify(searchKeys))
        }
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
          if(newItem.dicConsultType == 'online_ChineseFrenchNet'){
            newItem.consultType = '在线咨询-中国法网'
          }else if(newItem.dicConsultType == 'online_wechatConsultation'){
            newItem.consultType = '在线咨询-微信'
          }else if(newItem.dicConsultType == 'online_ZhejiangLawNetwork'){
            newItem.consultType = '在线咨询-浙江法网'
          }else if(newItem.dicConsultType == 'online_TerminalSelfHelpMachine'){
            newItem.consultType = '在线咨询-终端自助机'
          }
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

    * sign({ payload }, { call, put }) {
      let params = {
        id: payload.id
      }
      const res = yield call(postDataService, { url:api.signForConsultUrl }, { ...params, serviceId: 'srvid_signForConsultUrl'})
      if (res.success) {
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    * back({ payload }, { call, put }) {
      let params = {
        id: payload.sign.id,
        tConsultId: payload.id
      }
      const res = yield call(postDataService, { url:api.chargebackUrl }, { ...params, serviceId: 'srvid_chargebackUrl'})
      if (res.success) {
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

  },
	reducers: {
    initPage(state, action) {
      if (action.payload) {
        return {
          ...state, searchKeys: {
            ...action.payload,
            createTime: action.payload.createTime.value.length ? {
              name: 'createTime',
              value: [
                moment(action.payload.createTime.value[0]),
                moment(action.payload.createTime.value[1]),
              ],
              touched: true,
              dirty: false,
            } : { value: [] },
          }
        }
      }
      return {
        ...state, 
        searchKeys: {
          name: {value: ''},
          mobile: {value: ''},
          dicConsultSource: {value: ''},
          dicConsultTreatmentMode: {value: ''},
          answerGlobalName: {value: ''},
          createTime: {value: []},
          dicGender: {value: ''},
          dicConsultStatus: {value: ''},
          areaId: {value: ''},
        }
      }
    },
    setAllCity(state,action){
      return {
        ...state,
        allArea: action.payload
      }
    },
		querySuccess (state, action){
      const { list, pagination } = action.payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination
        }
      }
    },
    showModal (state, action){
      return {...state, ...action.payload, modalVisible: true}
    },
    hideModal (state, action){
      return {...state, modalVisible: false}
    },
    updateFilterFields (state, action){
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
	}
}