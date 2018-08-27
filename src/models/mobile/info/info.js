import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { getDataService, postDataService } from '../../../services/commonService'
import { config, jsUtil } from '../../../utils'

const { api } = config

let listType = localStorage.getItem('listType')

export default {
  namespace: 'info',
  state: {
    content:''
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({type: 'getContent'})
    },
  },
  effects: {
    *getContent({payload},{select, call, put}) {
      const params = {
        ...payload
      }
      const response = yield call(getDataService, {url: api.appGetContentMock}, {...params, serviceId: 'srvid_appGetContentMock'})
      if (response.success) {
        yield put({ 
          type: 'setContent',
          response
        })        
      }else {
        throw response
      }

    }
  },
  reducers: {
    setContent(state, { response }) {
      return {
        ...state,
        content: response.data
      }
    }
  }
}
