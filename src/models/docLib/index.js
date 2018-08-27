import { getDataService } from '../../services/commonService'
import {config, jsUtil} from '../../utils'
import {message} from 'antd'
const {api} = config

export default {
  namespace: 'docLib',
  state: {
    docsList: [],
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/docLib') {
          dispatch({type: 'getDocs'})
        }
      })
    }
  },
  effects: {
    *getDocs({ payload }, {call, put, select}) {
      const res = yield call(getDataService, {
        url: api.getEmptyDocsUrl
      }, {serviceId: 'srvid_getDocsUrl'})
      if (res.success) {
        yield put({type: 'getDocSuccess', payload: res.data})
      } else if (res.code === '9999') {
        //do nothing, it will not update the state and will not re-render the page.
      } else {
        throw res
      }
    },

  },
  reducers: {
    getDocSuccess(state, action) {
      return {
        ...state,
        docsList: action.payload
      }
    }
  },
}