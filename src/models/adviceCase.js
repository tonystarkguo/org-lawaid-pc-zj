// import { getDataService, postDataService } from '../services/commonService'
import { query, create, update } from '../services/adviceQuery'
import { config } from '../utils'
import { parse } from 'qs'

const { api } = config

export default {
	namespace: 'adviceCase',
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
	},
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/adviceCase') {
          dispatch({type: 'query', payload: {...location.query}})
        }
      })
    }
  },
  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.pageNum) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
  },
	reducers: {
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
	}
}