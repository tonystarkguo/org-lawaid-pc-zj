import { postDataService, getDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config, jsUtil } from '../utils'
import moment from 'moment'
import pathToRegexp from 'path-to-regexp'
import {message} from 'antd'

const { api } = config

export default {
  namespace: 'neworder',
  state: {
    isIdCard: false,
    loginLoading: false,
    calendarModalVisible: false,
    timeModalVisible: false,
    tOrgId: 79,
    ResvData: [],
    dayResvData: {},
    dayResvCurrentDate: {},
    currentValue: moment(),//日历当前时间
    org: [],
    existUserInfo: {}
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/neworder').exec(location.pathname)
        if (match) {
          dispatch({ type: 'orgChange', payload: '' })
        }
      })
    },
  },
  effects: { 
    *getResvData({ payload }, { select, put, call }) {
      const tOrgId = yield select(({neworder}) => neworder.tOrgId) 
      const currentDate = payload.format('YYYY-MM-DD')
      const params = {
        currentDate: currentDate,
        tOrgId: tOrgId
      }
      const data = yield call(getDataService, {url:api.getResvData}, {...params, serviceId: 'srvid_getResvData'})
      if (data.success) {
        yield put({ 
          type: 'loadResvData',
          payload: {data, currentDate:payload}
        })
      } else {
        throw data
      }
    }, 
    *getDayResvData({ payload }, { select, put, call }) {
      const tOrgId = yield select(({neworder}) => neworder.tOrgId) 
      const currentDate = payload.format('YYYY-MM-DD')
      const params = {
        currentDate: currentDate,
        tOrgId: tOrgId
      }       
      const data = yield call(getDataService, {url:api.getDayResvData}, {...params, serviceId: 'srvid_getDayResvData'})
      if (data.success) {
        yield put({ 
          type: 'loadDayResvData',
          payload: data
        })
        yield put({
          type: 'showDayResvModal',
          payload: payload
        })
      } else {
        throw data
      }
    },
    *orgChange({ payload }, { put, call }) {
      const params = { orgName: payload, type: '5' }
      const data = yield call(getDataService, { url:api.orgList }, {...params, serviceId: 'srvid_orgList'})
      if (!jsUtil.isNull(data) && data.success) {
        yield put({ 
          type: 'orgChangeSuc',
          payload: data.data.list
        })
      }
    },
    *save({ payload }, { put, call }) {
      const data = yield call(postDataService, { url:api.newResv }, {...payload, serviceId: 'srvid_newResv'})
      if (data.success) {
        if(data.code === '40005'){
          message.error('同一天不能预约同一个机构！')
          return
        }else{
          yield put(routerRedux.push('/ordermanage'))
        }
      }
    },
    *searchApplyerById({ payload }, { select, put, call }) {
      const data = yield call(getDataService, {url: api.recipientInfoList}, {cardCode: payload, sericeId: 'srvid_recipientInfoList'})
      if (data.success && data.data && data.data.list && data.data.list.length) {
        yield put({ 
          type: 'queryApplerSuc',
          payload: data.data.list[0]
        })
      } else {
        message.error('未查到用户！')
      }
    },
  },
  reducers: {
    showCalendarModal(state) {
      return {
        ...state,
        calendarModalVisible: true,
      }
    },
    hideCalendarModal(state) {
      return {
        ...state,
        calendarModalVisible: false,
        ResvData: []
      }
    },
    hideDayResvModal(state) {
      return {
        ...state,
        timeModalVisible: false,
        dayResvData: {}
      }
    },
    showDayResvModal(state, action) {
      return {
        ...state,
        timeModalVisible: true,
        dayResvCurrentDate: action.payload
      }
    },
    loadResvData(state, action) {
      return {
        ...state,
        ResvData: action.payload.data,
        currentValue: action.payload.currentDate
      }
    },
    loadDayResvData(state, action) {
      return {
        ...state,
        dayResvData: action.payload
      }
    },
    showBtn(state){
      return {
        ...state,
        isIdCard: true
      }
    },
    hideBtn(state){
      return {
        ...state,
        isIdCard: false
      }
    },
    orgChangeSuc(state, action){
      return {
        ...state,
        org: action.payload
      }
    },
    updateOrgId(state, action){
      return {
        ...state,
        tOrgId: action.payload && action.payload.key
      }
    },
    queryApplerSuc(state, action){
      return {
        ...state,
        existUserInfo: action.payload
      }
    },
  }
}

