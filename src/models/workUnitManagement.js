import { getDataService, postDataService } from '../services/commonService'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'

const { api } = config
const { getLabelByValue, createTreeBydics, createCurrentList } = jsUtil

export default {
	namespace: 'workUnitManagement',
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
			total: null,
		},
    searchKeys: {
      name: {value: ''},
    },//列表表头搜索关键字列表
    allConfig: {},//字典
	},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/workUnitManagement') {
          dispatch({type: 'setAllConfig'}) //获取所有字典
          dispatch({type: 'initPage'})
          dispatch({type: 'query', payload: {...location.query}})
        }
      })
    }
  },
  effects: {
    * query ({ payload = {} }, { select, call, put }) {
      const searchKeys = yield select(({ workUnitManagement }) => workUnitManagement.searchKeys)
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 10
      reqParams.serviceId = 'srvid_getLawfirm'

      const data = yield call(getDataService, {url: api.getLawfirm}, {...reqParams, ...criterias})

      if (data.success) {
        let resData = data && data.data && data.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          newItem.seq = startSeq++
          let tSmsProvinceName = item.tSmsProvinceName === null ? '' : item.tSmsProvinceName
          let tSmsCityName = item.tSmsCityName === null ? '' : item.tSmsCityName
          let tSmsAreaName = item.tSmsAreaName === null ? '' : item.tSmsAreaName
          newItem.addr = tSmsProvinceName + tSmsCityName + tSmsAreaName
          return newItem
        })

        yield put({
          type: 'querySuccess',
          payload: {
            list: resData,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.total
            }
          }
        })
        
      }
    },

    * create ({ payload }, { call, put }) {
      console.log(payload)
      const data = yield call(postDataService, {url:api.addLawfirm}, {...payload, serviceId: 'srvid_addLawfirm'})
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ workUnitManagement }) => workUnitManagement.currentItem.id)
      const params = { ...payload, id }
      const data = yield call(postDataService, {url:api.updateLawfirm}, {...params, serviceId: 'srvid_updateLawfirm'})
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    /** remove ({ payload }, { select, call, put }) {
      const data = yield call(postDataService, {url:api.deleteOrg}, {id: payload, serviceId: 'srvid_deleteOrg'})
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },*/
  },
	reducers: {
    initPage(state, action) {
      return {
        ...state, 
        searchKeys: {
          name: {value: ''},
        }
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
    setAllConfig(state, action) {
      const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
      const {dictData} = allConfig || {}
      const { dic_case_type, dic_legal_position, dic_legal_status, dic_org_aid_type } = dictData || {}
      const dic_standing = createTreeBydics(dic_case_type, dic_legal_status, dic_legal_position) || []
      const new_dic_standing = createCurrentList(dic_standing) || []
      const org_aid_type = createTreeBydics(dic_case_type, dic_org_aid_type) || []
      const new_org_aid_type = createCurrentList(org_aid_type) || []
      return {
        ...state,
        allConfig,
        new_dic_standing,
        new_org_aid_type
      }
    },
	}
}