import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { getDataService, postDataService } from '../services/commonService'
import { config, jsUtil } from '../utils'

const { prefix, api } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [],
    menuPopoverVisible: false,
    modalVisible: false,
    isFileModify: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: (localStorage.getItem(`${prefix}darkTheme`) === null || localStorage.getItem(`${prefix}darkTheme`) === 'true'),
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup ({ dispatch }) {
      if (location.pathname !== '/login' && location.pathname !== '/') {
        dispatch({ type: 'init_main_page' })
        if (location.pathname.indexOf('/fileModify/') > -1) {
          dispatch({ type: 'isFileModify' })
        }
      } else {
        dispatch(routerRedux.push('/login'))
      }
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {

    *getAllConfig({payload}, {call, put}) {
      const response = yield call(getDataService, {url: api.getAllConfig}, {serviceId: 'srvid_getAllConfig'})
      if(response.success) {
        localStorage.setItem('allConfig', JSON.stringify(response.data))
      }else {
        throw response
      }
    },

    *getCaseReason({payload}, {select, call, put}) {
      const response = yield call(getDataService, {url: api.getCaseReason}, {serviceId: 'srvid_getCaseReason'})
      if(response.success) {
        let caseReasonList = response.data
        const caseReasonFunc = (caseReasonList) => {
          if(jsUtil.isNull(caseReasonList) && caseReasonList.length === 0){
            return
          }
          caseReasonList.forEach((caseReasonItem) => {
            caseReasonItem.value = caseReasonItem.key
            caseReasonItem.disableCheckbox = !caseReasonItem.isChild
            if(caseReasonItem.children) {
              caseReasonFunc(caseReasonItem.children)              
            }
          }) 
        }
        caseReasonFunc(caseReasonList)
        localStorage.setItem('caseReasonList', JSON.stringify(caseReasonList))  
      }
    },
    
    *init_main_page ({
      payload,
    }, { call, put }) {
      let userInfo = payload && payload.user
      if(!userInfo){
        userInfo = localStorage.getItem('user')
        userInfo = userInfo && JSON.parse(userInfo)
      }
      if (userInfo) {
        //获取用户的左侧菜单
        const data = yield call(getDataService, {url: api.getMenuUrl}, {isMenu: 1,serviceId: 'srvid_getMenuUrl'})
        if (data.success) {
          yield put({ type: 'getMenuSuccess', payload: {menu: data.data, user: userInfo }})
          //如果是通过登录页面进入，则直接到待办下面的第一个菜单，否则就是刷新页面
          let phName = location.pathname
          if(phName === '/login' || phName === '/'){
            yield put(routerRedux.push('/home'))//跳转到登录后的首页
          }else{
            yield put(routerRedux.push(phName + location.search))//跳转到刷新前的页面
          }
        } else {
          yield put(routerRedux.push('/login'))//不成功的话跳到登录页面
          throw (data)
        }
      } else {
        yield put(routerRedux.push('/login'))//不成功的话跳到登录页面
        throw (data)
      }
    },

    *logout ({
      payload,
    }, { call, put }) {
      let params = parse(payload)
      const data = yield call(postDataService, {url: api.userLogout}, {...params, serviceId: 'srvid_userLogout'})
      if (data.success) {
        window.location = `${location.origin}/login`
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        // yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    *toPersonMsg({//跳转到个人资料
      payload,
    }, { call, put }) {
      yield put(routerRedux.push('/personalMsg'))
    },

    *changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield(select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    * modifyPwd ({ payload }, { call, put }) { // 修改动态口令
      const user = JSON.parse(localStorage.getItem('user'))
      const res = yield call(postDataService, {url: api.updateOrg }, { ...payload, id: user.tOrgId, serviceId: 'srvid_updateOrg' })
      if (res.success) {
        localStorage.setItem('dynamicKey', JSON.stringify(res.data.dynamicKey))
        yield put({ type: 'hideModal' })
      } else {
        throw res
      }
    },

  },
  reducers: {
    isFileModify (state) {
      return { ...state, isFileModify: true }
    },
    querySuccess (state, { payload: user }) {
      return {
        ...state,
        user,
      }
    },

    getMenuSuccess (state, { payload }) {
      return {
        ...state,
        menu: payload.menu,
        user: payload.user
      }
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
    doGlobleSearch (state, {payload: keywords}){
      return {
        ...state,
        'keywords': keywords
      }
    },

    showModal (state){
      return {
        ...state,
        modalVisible: true
      }
    },

    hideModal (state){
      return {
        ...state,
        modalVisible: false
      }
    },
  }
}
