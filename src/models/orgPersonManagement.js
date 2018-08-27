// import { query, create, update, remove } from '../services/orgManagement'
import { getDataService, postDataService } from '../services/commonService'
import { message } from 'antd'
import { config, jsUtil } from '../utils'
import { parse } from 'qs'

const { api } = config

export default {
  namespace: 'orgPersonManagement',
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
    roles:[],
    info: {},
    searchKeys: {
      name: {value: ''},
    },//列表表头搜索关键字列表
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/orgPersonManagement') {
          dispatch({type: 'initPage'})
          dispatch({type: 'query', payload: {...location.query}})
          dispatch({type: 'getRoles'})
        }
      })
    }
  },
  effects: {
    * query ({ payload = {} }, { select, call, put }) {
      const searchKeys = yield select(({ orgPersonManagement }) => orgPersonManagement.searchKeys)
      let criterias = _.mapValues(searchKeys, (item, index) => {
        return item.value
      })
      criterias = _.pickBy(criterias, (item) => {
        return !jsUtil.isNull(item)
      })

      let reqParams = {}
      reqParams.pageNum = payload.pageNum && Number(payload.pageNum) || 1
      reqParams.pageSize = payload.pageSize && Number(payload.pageSize) || 10
      reqParams.serviceId = 'srvid_getOrgPersonList'

      const res = yield call(getDataService, {url: api.getOrgPersonList}, {...reqParams, ...criterias})

      if (res.success) {
        let resData = res && res.data && res.data.list || []
        let pageNum = pageNum || 1
        let pageSize = 10
        let startSeq = (pageNum == 1 ? 1 : (2*Number(pageSize) + 1))

        resData = resData.map((item, index) => {
          let newItem = item;
          if(newItem.isDeleted === true){
            newItem.isDeleted = '删除'
          }else if(newItem.isDeleted === false){
            newItem.isDeleted = '未删除'
          }else{
            newItem.isDeleted = ''
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

    * create ({ payload }, { call, put }) {
      const res = yield call(postDataService, {url:api.addOrgPerson}, {...payload, serviceId: 'srvid_addOrgPerson'})
      if(res.code === '40040'){
        message.error('系统用户名重名，请换一个试试！')
        return
      } else if (res.code === '1') {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      }else {
        throw res
      }
    },

    * update ({ payload }, { select, call, put }) {
      const tOrmUserId = yield select(({ orgPersonManagement }) => orgPersonManagement.currentItem.tOrmUserId)
      const params = { ...payload, tOrmUserId }
      const res = yield call(postDataService, {url:api.updateOrgPersonInfo}, {...params, serviceId: 'srvid_updateOrgPersonInfo'})
      if (res.success) {
        console.log(payload)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },
    * receiveSms ({ payload }, { select, call, put }) {
      const res = yield call(postDataService, {url:api.isSms}, {id: payload.tOrmUserId,isSms:!payload.status, serviceId: 'srvid_updateOrgPersonInfo'})
      if (res.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },
    * remove ({ payload }, { select, call, put }) {
      const res = yield call(postDataService, {url:api.deleteOrgPerson}, {id: payload, serviceId: 'srvid_deleteOrgPerson'})
      if (res.success) {
        yield put({ type: 'query' })
      } else {
        throw res
      }
    },

    * getRoles({ payload }, { call, put, select }) {
      const res = yield call(getDataService, {url:api.getAllrole}, {serviceId: 'srvid_getAllrole'})
      if (res.success) {
        yield put({ type: 'getRolesSuccess', payload:res.data })
      } else {
        throw res
      }
    },
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
    getRolesSuccess (state, action){
      return {...state, roles: action.payload}
    },
    getMsg (state, action){
      return {...state, ...action.payload, info: action.payload.currentItem, modalVisible: true}
    },
    showModal (state, action){
      return {...state, ...action.payload, modalVisible: true}
    },
    hideModal (state, action){
      return {...state, modalVisible: false, info: {}}
    },
    updateFilterFields (state, action){
      return {...state, searchKeys: {...state.searchKeys, ...action.payload}}
    },
  }
}