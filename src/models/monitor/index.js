import { getDataService, postDataService } from '../../services/commonService'
import { config } from '../../utils'
import moment from 'moment'
import { parse } from 'qs'
const { api } = config

export default {
  namespace: 'monitor',
  state: {
    list: [],
    currentItem: {},
    dictData: {},
    modalVisible: false,
    modalType: 'create',
    tabsKey: '1',
    currentApi: '',
    loading: true,
    searchData: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共${total} 条`,
      current: 1,
      pageSize: 10,
      total: null,
    },
    caseId: '',
    attendModal: {
      visible: false,
      data: {},
    },
    stopModal: {
      visible: false,
      data: {},
    },
    visitModal: {
      visible: false,
      data: {},
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        if (location.pathname === '/monitor') {
          let urlParams = parse(location.search.substr(1))
          let listType = urlParams.type
          localStorage.setItem('listType', listType)
          dispatch({ type: 'tabsChange' })
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    *getData ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
      const { tabsKey, searchData } = yield select(({ monitor }) => monitor)
      const allConfig = JSON.parse(localStorage.getItem('allConfig')) || {}
      const { dictData } = allConfig || {}
      let currentApi = ''
      switch (tabsKey) {
        case '1':
          currentApi = 'getCaseUndertakeList'
          break
        case '2':
          currentApi = 'getRestrictDayWork'
          break
        case '3':
          currentApi = 'getNotSatisfaction'
          break
        case '4':
          currentApi = 'getJudgeOpinion'
          break
        case '5':
          currentApi = 'getSpecialReport'
          break
        case '6':
          currentApi = 'getCaseWaitCheck'
          break
        default:
          break
      }
      const res = yield call(getDataService, { url: api[currentApi] }, { pageNum: 1, pageSize: 10, ...searchData })
      if (res.success) {
        if (res.data.list && res.data.list.length > 0) {
          res.data.list.forEach(item => {
            item.rpUserName = item.rpNameMob || item.rpUserName
            item.reasonName = item.resonName || item.reasonName
            item.hpOrgName = item.hpWorkUnits || item.undertakeCompany
            item.undertakeName = item.hpNameMobs || item.undertakeName
            item.orgName = item.dicOriginChannaelName || item.orgName
            item.caseStatusName = item.dicCaseStatusName || item.caseStatusName
          })
        }
        yield put({
          type: 'setData',
          payload: res.data.list || [],
          total: res.data.total,
          currentApi,
          dictData,
        })
      } else {
        throw res
      }
    },
    *tabelChange ({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' })
       const { tabsKey, searchData } = yield select(({ monitor }) => monitor)
      const { current, pageSize } = payload
      const { currentApi } = yield select(({ monitor }) => monitor)
      const res = yield call(getDataService, { url: api[currentApi] }, { pageNum: current, pageSize, ...searchData })
      if (res.success) {
        yield put({
          type: 'setTabelChange',
          list: res.data.list || [],
          pagination: payload,
          total: res.data.total,
        })
      } else {
        throw res
      }
    },
    *sendAttend ({ payload }, { select, call, put }) {
      const tCaseId = yield select(({ monitor }) => monitor.caseId)
      const params = {
        ...payload,
        remarkDate: moment(payload.remarkDate),
        dicRemarkType: '2',
        tCaseId,
      }
      const res = yield call(postDataService, { url: api.commitRemarkUrl }, { ...params })
      if (res.success) {
        yield put({
          type: 'hideAttendModal',
          payload: '',
        })
      } else {
        throw res
      }
    },
    *sendStop ({ payload }, { select, call, put }) {
      const caseId = yield select(({ monitor }) => monitor.caseId)
      const res = yield call(postDataService, { url: api.endAid }, { ...payload, caseId })
      if (res.success) {
        yield put({
          type: 'hideStopModal',
          payload: '',
        })
        yield put({
          type: 'getData',
        })
      } else {
        throw res
      }
    },
    *sendVisit ({ payload }, { select, call, put }) {
      const tCaseId = yield select(({ monitor }) => monitor.caseId)
      const params = {
        ...payload,
        remarkDate: moment(payload.remarkDate),
        dicRemarkType: '1',
        tCaseId,
      }
      const res = yield call(postDataService, { url: api.commitRemarkUrl }, { ...params })
      if (res.success) {
        yield put({
          type: 'hideVisitModal',
          payload: '',
        })
      } else {
        throw res
      }
    },
  },
  reducers: {
    setSearchData (state, action) {
      return { ...state, searchData: action.payload }
    },
    showLoading (state) {
      return { ...state, loading: true }
    },
    tabsChange (state, action) {
      const tabsKey = action.payload ? action.payload : state.tabsKey
      return { ...state, loading: true, tabsKey, list: [], searchData: {}, pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
      } }
    },
    setTabelChange (state, action) {
      return { ...state, loading: false, list: action.list, pagination: { ...state.pagination, ...action.pagination, total: action.total } }
    },
    setData (state, action) {
      return { ...state, loading: false, dictData: action.dictData, list: action.payload, currentApi: action.currentApi, pagination: { ...state.pagination, total: action.total } }
    },
    showAttendModal (state, action) {
      return { ...state, attendModal: { ...state.attendModal, visible: true }, caseId: action.payload.caseId }
    },
    showStopModal (state, action) {
      return { ...state, stopModal: { ...state.stopModal, visible: true }, caseId: action.payload.caseId }
    },
    showVisitModal (state, action) {
      return { ...state, visitModal: { ...state.visitModal, visible: true }, caseId: action.payload.caseId }
    },
    hideAttendModal (state, action) {
      return { ...state, attendModal: { ...state.attendModal, visible: false } }
    },
    hideStopModal (state, action) {
      return { ...state, stopModal: { ...state.stopModal, visible: false } }
    },
    hideVisitModal (state, action) {
      return { ...state, visitModal: { ...state.visitModal, visible: false } }
    },
  },
}
