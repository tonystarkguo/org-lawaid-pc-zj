import { postDataService, getDataService } from '../services/commonService'
import { routerRedux } from 'dva/router'
import { config } from '../utils'
import pathToRegexp from 'path-to-regexp'

const { api } = config

export default {
  namespace: 'address',
  state: {
    tOrgId: 79,
    org: [],
    name: '',
    longitude: '',
    latitude: '',
    address: '',
    telephone: ''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/address').exec(location.pathname)
        if (match) {
          dispatch({ type: 'orgChange', payload: '' })
        }
      })
    },
  },
  effects: {
    *orgChange({ payload }, { put, call }) {   
      const params = { orgName: payload, type: '5', serviceId: 'orgList' }
      const data = yield call(getDataService, { url:api.orgList }, params)
      if (data.success) {
        yield put({ 
          type: 'orgChangeSuc',
          payload: data.data.list
        })
      } else if(data.code === '9999'){
        //do nothing, it will not update the state and will not re-render the page.
      } else {
        throw data
      }
    }
  },
  reducers: {
    orgChangeSuc(state, action){
      return {
        ...state,
        org: action.payload
      }
    },
    updateOrgId(state, action){
      return {
        ...state,
        ...action.payload
      }
    }
  }
}

