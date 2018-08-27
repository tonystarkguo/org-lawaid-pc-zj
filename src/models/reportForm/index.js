import { getDataService } from '../../services/commonService'
import { config } from '../../utils'
import { message } from 'antd'
const { api } = config

export default {
  namespace: 'reportForm',
  state: {
    cityList: [],
    sourceList: [
      {
        key: '0',
        value: '咨询'
      }, {
        key: '1',
        value: '案件'
      }
    ],
    download: {
      month: {
        data: '',
        show: false,
        yearText: '',
        monthText: '',
      },
      quarter: {
        data: '',
        show: false,
        downloadData: '',
        yearText: '',
        quarterText: '',
      },
      halfYear: {
        data: '',
        downloadData: '',
        show: false,
        state: 0,
      },
      year: {
        data: '',
        downloadData: '',
        show: false,
        state: 1,
      },
    },
    //月报
    monthStatementData: [],
    //季报
    quarterStatementData: [],
    //半年报
    halfYearStatementData: {},
    //年报
    yearStatementData: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        if (location.pathname === '/reportForm') {
          dispatch({ type: 'initEditStatus' }) // 初始化
        }
      })
    }
  },
  effects: {
    //获取月报
    *getMonthStatement({ payload }, { call, put }) {
      const getMonthStatement = yield call(getDataService, { url: api.getMonthStatement }, payload)
      if (getMonthStatement.success) {
        yield put({
          type: 'setMonthStatement',
          payload: {
            list: getMonthStatement.data,
            getData: payload
          },
        })
      } else {
        throw getMonthStatement
      }
    },
    //获取季报
    *getQuarterStatement({ payload }, { call, put }) {
      // console.log('请求参数：')
      // console.log(payload);
      const getQuarterStatement = yield call(getDataService, { url: api.getQuarterStatement }, payload)
      // console.log('响应')
      // console.log(getQuarterStatement)
      if (getQuarterStatement.success) {
        yield put({
          type: 'setQuarterStatement',
          payload: {
            list: getQuarterStatement.data,
            getData: payload
          },
        })
      } else {
        throw getQuarterStatement
      }
    },
    //获取半年报
    *getHalfYearStatement({ payload }, { call, put }) {
      // console.log('请求参数：')
      const getHalfYearStatement = yield call(getDataService, { url: api.getHalfYearStatement }, {...payload})
      // console.log('返回参数：')
      // console.log(getHalfYearStatement);
      if (getHalfYearStatement.success) {
        // console.log('请求参数：')
        // console.log(payload);
        // console.log(getHalfYearStatement)
        yield put({
          type: 'setHalfYearStatement',
          payload: {
            list: getHalfYearStatement.data,
            getData: payload
          },
        })
      } else {
        throw getHalfYearStatement
      }
    },
    //获取年报
    *getYearStatement({ payload }, { call, put }) {
      // console.log('请求参数：')
      // console.log(payload);
      const getYearStatement = yield call(getDataService, { url: api.getHalfYearStatement }, payload)
      // console.log('返回参数：')
      // console.log(getYearStatement);
      if (getYearStatement.success) {
        // console.log(getYearStatement)
        yield put({
          type: 'setYearStatement',
          payload: {
            list: getYearStatement.data,
            getData: payload
          },
        })
      } else {
        throw getYearStatement
      }
    },
  },
  reducers: {
    initEditStatus(state, action) {
      return {
        ...state,
        cityList: [],
        sourceList: [
          {
            key: '0',
            value: '咨询'
          }, {
            key: '1',
            value: '案件'
          }
        ],
        download: {
          month: {
            data: '',
            show: false,
            yearText: '',
            monthText: '',
          },
          quarter: {
            data: '',
            show: false,
            yearText: '',
            quarterText: '',
          },
          halfYear: {
            data: '',
            show: false
          },
          year: {
            data: '',
            show: false
          },
        },
        //月报
        monthStatementData: [],
        //季报
        quarterStatementData: [],
        //半年报
        halfYearStatementData: {},
        //年报
        yearStatementData: {},
      }
    },
    setMonthStatement(state, action) {
      const monthStatementData = action.payload.list;
      return {
        ...state,
        monthStatementData,
        download: {
          ...state.download,
          month: {
            data: action.payload.getData.time,
            show: true,
            yearText: action.payload.getData.smYear,
            monthText: action.payload.getData.smMonth
          },
        }
      }
    },
    setQuarterStatement(state, action) {
      const quarterStatementData = action.payload.list;
      const year = action.payload.getData.smYear;
      const quarter = action.payload.getData.smQuarter;
      let quarterText = '';
      if (quarter == '01') {
        quarterText = '1';
      } else if (quarter == '04') {
        quarterText = '2';
      } else if (quarter == '07') {
        quarterText = '3';
      } else if (quarter == '10') {
        quarterText = '4';
      }
      return {
        ...state,
        quarterStatementData,
        download: {
          ...state.download,
          quarter: {
            data: year + quarter,
            show: true,
            downloadData: action.payload.getData,
            yearText: year,
            quarterText: quarterText
          },
        }
      }
    },
    setHalfYearStatement(state, action) {
      const halfYearStatementData = action.payload.list;
      return {
        ...state,
        halfYearStatementData,
        download: {
          ...state.download,
          halfYear: {
            data: action.payload.getData.smHalfYear,
            downloadData: action.payload.getData,
            show: true,
          },
        }
      }
    },
    setYearStatement(state, action) {
      const yearStatementData = action.payload.list;
      return {
        ...state,
        yearStatementData,
        download: {
          ...state.download,
          year: {
            data: action.payload.getData.smYear,
            downloadData: action.payload.getData,
            show: true,
          },
        }
      }
    },
  },
}
