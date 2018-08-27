import { getDataService } from '../../services/commonService'
import { config } from '../../utils'
import { message } from 'antd'
const { api } = config

export default {
  namespace: 'daily',
  state: {
    statisticsData: {},
    statisticsDataShow: false,
    toDoData: {},
    toDoDataShow: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/daily') {
          dispatch({ type: 'init' })
        }
      })
    },
  },
  effects: {
    *getDailyStatistics({ payload }, { call, put }) {
      const dailyStatistics = yield call(getDataService, { url: api.getDailyStatistics }, payload)
      if (dailyStatistics.success) {
        yield put({
          type: 'setDailyStatistics',
          payload: {
            list: dailyStatistics.data
          },
        })
      } else {
        throw dailyStatistics
      }
    },

    *getDailyToDo({ payload }, { call, put }) {
      const res = yield call(getDataService, { url: api.getTodoDaily }, payload)
      if (res.success) {
        yield put({
          type: 'setDailyToDo',
          payload: {
            list: res.data
          },
        })
      } else {
        throw res
      }
    },
  },
  reducers: {
    setDailyStatistics(state, action) {
      const statisticsData = action.payload.list;
      document.getElementById("dailyView").innerHTML = statisticsData.content;
      return {
        ...state,
        statisticsData: statisticsData,
        statisticsDataShow: true
      }
    },
    setDailyToDo(state, action) {
      const toDoData = action.payload.list;
//    console.log(toDoData)
      return {
        ...state,
        toDoData: toDoData,
        toDoDataShow: true
      }
    },
    init(state, action) {
      return {
        ...state,
        statisticsData: {},
        statisticsDataShow: false,
        toDoData: {},
        toDoDataShow: false,
      }
    },
  }
}
