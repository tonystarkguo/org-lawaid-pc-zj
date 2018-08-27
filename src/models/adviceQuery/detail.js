import { postDataService, getDataService } from '../../services/commonService'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../../utils'
import { message } from 'antd'

const { api } = config

export default {
  namespace: 'adviceDet',
  state: {
    visible: false,
    item: {},
    consultHistory: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/adviceDet/:id').exec(location.pathname)
        if (match) {
          console.log(match[1])
          dispatch({ type: 'query', payload: { id: match[1] } })//获取详情
          localStorage.setItem('consultId', match[1])
        }
      })
    },
  },
  effects: {
    *query({ payload }, { put, call }) {
      const res = yield call(getDataService, {url:api.getConsultByIdUrl}, {...payload, serviceId: 'srvid_getConsultByIdUrl'})
      if (res.success) {
        yield put({ type: 'querySuccess', payload: res.data })
      } else {
        throw res
      }
    },

    * showHistory({ payload }, { put, call }) {
      const res = yield call(getDataService, { url:api.getConsultHistory }, { ...payload, serviceId: 'srvid_getConsultHistory'})
      if (res.success) {
        yield put({ type: 'getHistorySuccess', payload: res.data })
      }else{
        throw res
      }
    },

    * submit ({ payload }, { put, call }) {
      const consultId = localStorage.getItem('consultId')
      const res = yield call(postDataService, { url: api.additionalConsult }, { ...payload, tConsultId: consultId, serviceId: 'srvid_additionalConsult'})
      yield put({ type: 'hideAddModal' })
      if (res.success) {
        yield put(routerRedux.push('/adviceQuery'))
      } else {
        throw res
      }
    },

  },
  reducers: {
    getHistorySuccess(state, action){
      return {...state, consultHistory: action.payload}
    },
    querySuccess(state, action){
      return {...state, item: action.payload, consultHistory: []}
    },
    showAddModal (state) {
      return { ...state, visible: true }
    },
    hideAddModal (state) {
      return { ...state, visible: false }
    },
  }
}

