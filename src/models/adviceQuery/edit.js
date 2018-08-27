import { postDataService, getDataService } from '../../services/commonService'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../../utils'
import { message } from 'antd'

const { api } = config

export default {
  namespace: 'adviceEdit',
  state: {
    item: {},
    treeCaseReason: [],//案由
    consultHistory: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/adviceEdit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })//获取详情
          dispatch({ type: 'setCaseReason' })//获取案由
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

    /** save({ payload }, { put, call }) {
      let dicConsultStatus = sessionStorage.getItem('dicConsultStatus')
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        tOrgId: user.tOrgId,
        abbreviation: user.abbreviation,
        answerGlobalId: user.tGlobalId,
        isSubmit: 0,
        ...payload
      }
      const data = yield call(postDataService, { url:api.saveOrCommitConsultUrl }, { ...params, serviceId: 'srvid_saveOrCommitConsultUrl'})
      if (data.success) {
        yield put(routerRedux.push(`/adviceQuery?dicConsultStatus=${dicConsultStatus}`))
      }else{
        console.log(data)
      }
    },*/

    * submit({ payload }, { put, call }) {
      let dicConsultStatus = sessionStorage.getItem('dicConsultStatus')
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        tOrgId: user.tOrgId,
        abbreviation: user.abbreviation,
        answerGlobalId: user.tGlobalId,
        isSubmit: 1,
        ...payload
      }
      const data = yield call(postDataService, { url:api.saveOrCommitConsultUrl }, { ...params, serviceId: 'srvid_saveOrCommitConsultUrl'})
      if (data.success) {
        yield put(routerRedux.push('/adviceQuery'))
      }else{
        console.log(data)
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

  },
  reducers: {
    getHistorySuccess(state, action){
      return {...state, consultHistory: action.payload}
    },
    setCaseReason(state) {
      const caseReasonList = JSON.parse(localStorage.getItem('caseReasonList'))
      return {
        ...state,
        treeCaseReason: caseReasonList
      }
    },
    querySuccess(state, action){
      return {...state, item: action.payload, consultHistory: []}
    },
    showContent(state){
      return {...state, isShow: true}
    },
    hideContent(state){
      return {...state, isShow: false}
    }
  }
}

